import React, { useContext, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Compose from './Compose';
import { AppContext } from '../context/MailContext';
import AxiosService from '../utils/AxiosService'; 
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';

function GetSendMail() {
  const [emailData, setEmailData] = useState([]);
  const {
    isSidebarOpen,
    isComposeOpen,
    toggleSidebar,
    toggleCompose,
    handleMoveToTrash,
    handleMoveToStared,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleEmailClick = (id) => {
    navigate(`/viewmail/${id}`);
  };

  const getData = async () => {
    try {
      const response = await AxiosService.get(ApiRoutes.GET_SEND_MAIL.path, { 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        } 
      });

      const { data } = response;
      console.log('API Response:', data); 
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
  },[]);

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
      {isComposeOpen && <Compose onClose={toggleCompose} onSend={(emailData) => console.log('Email sent:', emailData)} />}
    </>
  );
}

export default GetSendMail;
