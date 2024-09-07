import React, { useState, useEffect } from 'react';
import AxiosService from '../utils/AxiosService';
import { useParams } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Compose from './Compose';
import profile from '../assets/img/profile.png'

function ViewMail() {
    const { id } = useParams();
    const [email, setEmail] = useState(null); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCompose = () => {
        setIsComposeOpen(!isComposeOpen);
    };

    const fetchMail = async () => {
        try {
            if (id) {
                const response = await AxiosService.get('/email/getMailById', {
                    params: { id: id }
                });

                if (response && response.data) {
                    setEmail(response.data); 
                } else {
                    console.error('Email data is missing in the response');
                    setEmail(null);
                }
            } else {
                console.error('ID is undefined');
                setEmail(null);
            }
        } catch (error) {
            console.error('Fetch mail error:', error);
            setEmail(null);
        }
    };

    useEffect(() => {
        fetchMail(); 
    }, [id]);

    if (!email) {
        return <p>No email found.</p>;
    }

    const emailDate = new Date(email.date);
    const formattedDate = `${emailDate.getDate()} ${emailDate.toLocaleString('default', { month: 'long' })} ${emailDate.getFullYear()}`;

    return (
        <div className="email-container">
            <TopBar toggleSidebar={toggleSidebar} toggleCompose={toggleCompose} />
            <SideBar isOpen={isSidebarOpen} />
            <div className={`content ${isSidebarOpen ? 'content-shifted' : ''}`}>
                <h2 className="subject">
                    {email.subject || 'No Subject'}
                    <span className="indicator">Inbox</span>
                </h2>
                <div className="email-header">
                    <img src={profile} alt="profile" className="profile-pic" /> 
                    <div className="email-content">
                        <div>
                            <strong>{email.recipients}</strong>
                            <span className="email-address">&nbsp;&#60;{email.recipients}&#62;</span>
                            <p className="date-text">{formattedDate}</p>
                        </div>
                        <p className="email-body">{email.body || 'No content available.'}</p>
                    </div>
                </div>
                {isComposeOpen && <Compose />} 
            </div>
        </div>
    );
}

export default ViewMail;
