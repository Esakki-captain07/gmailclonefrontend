import Login from '../commponents/Login'
import SideBar from '../commponents/SideBar'
import GetSendMail from '../commponents/GetSendMail'
import Home from '../commponents/Home'
import Compose from '../commponents/Compose'
import {Navigate} from 'react-router-dom'
import ViewMail from '../commponents/ViewMail'
import Trash from '../commponents/Trash'
import DraftMails from '../commponents/DraftMails'
import StaredMails from '../commponents/StaredMails'
import SingIn from '../commponents/SingIn'
export default[
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/inbox',
        element:<Home/>
    },
    {
        path:'/signin',
        element:<SingIn/>
    },
    {
        path:'/sent',
        element:<GetSendMail/>
    },
    {
        path:'/sendMail',
        element:<Compose/>
    },
    {
        path:'/viewmail/:id',
        element:<ViewMail/>
    },
    {
        path:'/trash',
        element:<Trash/>
    },
    {
        path:'/draft',
        element:<DraftMails/>
    },
    {
        path:'/star',
        element:<StaredMails/>
    },
    {
        path:'/*',
        element:<Navigate to='/login'/>
    }
]