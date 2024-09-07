import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import AppRoutes from '../src/utils/AppRoutes'
import {AppProvider} from '../src/context/MailContext'

function App(){
    let router = createBrowserRouter(AppRoutes)
    return<>
     <AppProvider>
         <RouterProvider router={router}/>
    </AppProvider>
    </>
   
}

export default App