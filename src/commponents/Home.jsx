import React, { useContext, useEffect, useState } from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Compose from './Compose';
import { AppContext } from '../context/MailContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';

function Home() {
  const [mailData, setMailData] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    isSidebarOpen,
    isComposeOpen,
    toggleSidebar,
    toggleCompose,
  } = useContext(AppContext);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = mailData.filter((email) => {
      const subject = email.subject ? email.subject.toLowerCase() : '';
      const sender = email.sender ? email.sender.toLowerCase() : '';
      return subject.includes(query) || sender.includes(query);
    });

    setFilteredEmails(filtered);
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
  
        toast.success(response.data || 'Updated successfully');
        setMailData(prevEmails => 
          prevEmails.map(email => 
              email._id === id ? { ...email, starred: !email.starred } : email
          )
      );
      
    } catch (error) {
      toast.error(error.message || 'Failed to star email');
    }
  };

  const getData = async () => {
    try {
      const response = await AxiosService.get(ApiRoutes.GET_ALL_MAIL.path, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { data } = response;
      console.log('API Response:', data);
      if (Array.isArray(response.data)) {
        const emails = response.data;
        setMailData(emails);
        setFilteredEmails(emails); 
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      toast.error(error.message || 'Internal Server Error');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMoveToTrash = async (id) => {
    try {
      await AxiosService.put(`${ApiRoutes.MOVE_TO_TRASH.path}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Email moved to trash successfully.");
      setMailData((prevMails) => prevMails.filter((email) => email._id !== id));
    setFilteredEmails((prevFilteredEmails) => prevFilteredEmails.filter((email) => email._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to move email to trash.");
    }
  };

  const navigate = useNavigate();

  const handleEmailClick = (id) => {
    console.log('Clicked Email ID:', id);
    navigate(`/viewmail/${id}`);
  };

  return (
    <>
      <TopBar toggleSidebar={toggleSidebar} handleSearch={handleSearch} />
      <SideBar isOpen={isSidebarOpen} onComposeClick={toggleCompose} />
      <div className={`content ${isSidebarOpen ? 'content-shifted' : ''}`}>
        <div className="inbox-message">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <div key={email._id} className="message-item" onClick={() => handleEmailClick(email._id)}>
                <div className="message-header">
                  <button
                    className="star"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToStared(email._id, email.starred);
                    }}
                  >
                    <i className="bi bi-star"></i>
                  </button>
                  <div className="message-email">{email.sender}</div>
                  <div className="message-subject">{email.subject}</div>
                  <button
                    className="trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToTrash(email._id);
                    }}
                  >
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

export default Home;
