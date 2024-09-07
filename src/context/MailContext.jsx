import React, { createContext, useState, useEffect } from 'react';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';


const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCompose = () => setIsComposeOpen(!isComposeOpen);


 


  return (
    <AppContext.Provider value={{
      isSidebarOpen,
      isComposeOpen,
      toggleSidebar,
      toggleCompose,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
