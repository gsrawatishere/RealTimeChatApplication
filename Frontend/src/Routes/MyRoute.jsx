import { createBrowserRouter, createRoutesFromChildren, Route } from "react-router-dom";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";


const MyRoute = createBrowserRouter(
    createRoutesFromChildren(
        <>
              <Route path="/register" element={<Register/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/home' element={<Home/>} />
              <Route path="/profile" element={<Profile/>} />
 
        </>
    )
)



export default MyRoute;