import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import Compose from './Compose';

function DraftMails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCompose = () => {
    setIsComposeOpen(!isComposeOpen);
    if (isComposeOpen) {
      setSelectedEmail(null); 
    }
  };

  const getData = async () => {
    try {
      const response = await AxiosService.get(ApiRoutes.GET_DRAFT_MAILS.path, { 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        } 
      });

      const { data } = response;
      if (data && Array.isArray(data)) {
        setEmailData(data);
      } else {
        toast.error("Unexpected data format received.");
      }
    } catch (error) {
      toast.error(error.message || "Internal Server Error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setIsComposeOpen(true); 
  };

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
  
        toast.success(response.data || 'Email starred successfully');
        setEmailData(prevEmails => prevEmails.map(email =>
          email._id === id ? { ...email, starred: true } : email
        ));
      
    } catch (error) {
      toast.error(error.message || 'Failed to star email');
    }
  };

  const removeDraftAfterSend = (sentEmailData) => {
    setEmailData(emailData.filter(email => email._id !== sentEmailData._id));
  };

  return (
    <>
      <TopBar toggleSidebar={toggleSidebar} />
      <SideBar isOpen={isSidebarOpen} onComposeClick={toggleCompose} />
      <div className={`content ${isSidebarOpen ? 'content-shifted' : ''}`}>
        <div className='inbox-message'>
          {emailData.length > 0 ? (
            emailData.map((email) => (
              <div key={email._id} className="message-item" onClick={() => handleEmailClick(email)}>
                <div className="message-header">
                <button className='star' onClick={(e) => { e.stopPropagation(); handleMoveToStared(email._id); }}>
                    <i className="bi bi-star"></i>
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
      {isComposeOpen && (
        <Compose
          onClose={toggleCompose}
          onSend={removeDraftAfterSend} 
          initialEmailData={selectedEmail} 
        />
      )}
    </>
  );
}

export default DraftMails;
