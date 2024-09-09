import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import Compose from './Compose';

function StaredMails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);

  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = emailData.filter(email => {
      const subject = email.subject ? email.subject.toLowerCase() : '';
      const recipients = email.recipients ? email.recipients.toLowerCase() : ''; 
      return subject.includes(query) || recipients.includes(query);
    });
  
    setFilteredEmails(filtered);
  };

  const toggleCompose = () => {
    setIsComposeOpen(!isComposeOpen);
    if (isComposeOpen) {
      setSelectedEmail(null);
    }
  };

  const handleEmailClick = (id) => {
    navigate(`/viewmail/${id}`)
  };

  const getData = async () => {
    try {
        const response = await AxiosService.get(`${ApiRoutes.GET_STARED_MAILS.path}`);
        console.log("Raw Response:", response); 
        const data = response; 
        console.log("Response Data:", data); 

        if (Array.isArray(data)) {
            setEmailData(data);
        } else {
            toast.error("Unexpected data format received.");
            console.error("Unexpected data format:", data);
        }
    } catch (error) {
        console.error("Error fetching starred mails:", error);
        toast.error(error.message || "Internal Server Error");
        setEmailData([]); 
    }
};

useEffect(() => {
  handleSearch({ target: { value: searchQuery } });
}, [emailData]);

useEffect(() => {
    getData();
  },[]);

  const handleMoveToTrash = async (id) => {
    try {
      await AxiosService.put(`${ApiRoutes.MOVE_TO_TRASH.path}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Email moved to trash successfully.");
      setEmailData(emailData.filter(email => email._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to move email to trash.");
    }
  };
  const handleMoveToStared = async (id) => {
    try {
      const response = await AxiosService.put(`${ApiRoutes.UPDATE_STARED.path}/${id}`, {
        starred: true 
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
  
        toast.success('Updated successfully');
        setEmailData(prevEmails => 
          prevEmails.filter(email => email._id !== id)
        );
      
    } catch (error) {
      toast.error(error.message || 'Failed to star email');
    }
  };

  

  return (
    <>
        <TopBar toggleSidebar={toggleSidebar} />
        <SideBar isOpen={isSidebarOpen} onComposeClick={toggleCompose} />
        <div className={`content ${isSidebarOpen ? 'content-shifted' : ''}`}>
            <div className='inbox-message'>
                {emailData.length > 0 ? (
                    emailData.map((email) => (
                        <div key={email._id} className="message-item" onClick={() => handleEmailClick(email._id)}>
                            <div className="message-header">
                            <button className='trash-star fill-star' onClick={(e) => { e.stopPropagation(); handleMoveToStared(email._id); }}>
                     <i className={`bi ${email.starred ? 'bi-star' : 'bi-star-fill'}`}></i>
                  </button>
                                <div className="message-email">To: {email.recipients}</div>
                                <div className="message-subject">{email.subject}</div>
                                <button className='trash' onClick={(e) => { e.stopPropagation(); handleMoveToTrash(email._id); }}>
                                    <i className="bi bi-trash"></i>
                                </button>
                                <div className="message-date">{new Date(email.date).toLocaleString()}</div>
                            </div>
                            
                        </div>
                    ))
                ) : (
                    <p>No emails found.</p>
                )}
            </div>
        </div>
        {isComposeOpen && <Compose onClose={toggleCompose} onSend={(emailData) => console.log('Email sent:', emailData)} />}

    </>
  );
}

export default StaredMails;
