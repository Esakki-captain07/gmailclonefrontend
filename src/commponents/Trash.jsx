import React, { useState, useEffect } from 'react';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import TopBar from './TopBar';
import SideBar from './SideBar';

function Trash() {
  const [trashEmails, setTrashEmails] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchTrashEmails = async () => {
    console.log('Fetching trash emails...');
    try {
      const response = await AxiosService.get(`${ApiRoutes.GET_TRASH_MAILS.path}`);
      console.log("Raw Response:", response); 

      const data = response; 
      console.log("Response Data:", data); 

      if (Array.isArray(data)) {
        setTrashEmails(data);
      } else {
        toast.error("Unexpected data format received.");
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching starred mails:", error);
      toast.error(error.message || "Internal Server Error");
      setTrashEmails([]);
    }
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  const handleDelete = async (id) => {
    console.log(`Deleting email with id: ${id}`);
    try {
      await AxiosService.delete(`${ApiRoutes.DELETE_EMAIL.path}/${id}`, { authenticate: ApiRoutes.DELETE_EMAIL.auth });
      toast.success('Email deleted successfully');
      setTrashEmails(trashEmails.filter(email => email._id !== id))
    } catch (error) {
      console.error('Error deleting email:', error); 
      toast.error(error.message || 'Failed to delete email');
    }
  };
  useEffect(() => {
    fetchTrashEmails();
  }, []);
  return (
    <>
      <TopBar toggleSidebar={toggleSidebar} />
      <SideBar isOpen={isSidebarOpen} />
      <div className={`content ${isSidebarOpen ? 'content-shifted' : ''}`}>
        <div className='inbox-message'>
          <h2>Trash</h2>
          {trashEmails.length > 0 ? (
            trashEmails.map((email) => (
              <div key={email._id} className='message-item'>
                <div className='message-header'>
                  <div className='message-email'>To: {email.recipients}</div>
                  <div className='message-subject'>{email.subject}</div>
                  <button className='trash' onClick={() => handleDelete(email._id)}><i className="bi bi-trash"></i></button>
                  <div className='message-date'>{email.date}</div>

                </div>
              </div>
            ))
          ) : (
            <p>No emails in trash</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Trash;
