import React from "react";
import { useNavigate } from 'react-router-dom';

function useLogout(setEmails) {
    let navigate = useNavigate();

    return () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();

        if (setEmails) {
            setEmails([]);
        }

        navigate('/login');
    };
}

export default useLogout;
