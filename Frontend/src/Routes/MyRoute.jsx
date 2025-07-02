import { createBrowserRouter, createRoutesFromChildren, Route } from "react-router-dom";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import App from "../App";


const MyRoute = createBrowserRouter(
    createRoutesFromChildren(
        <>
              <Route path="/register" element={<Register/>} />
              <Route path='/login' element={<Login/>} />
             
             

              <Route path='/' element={<App/>}>
                <Route index element={<Home/>} />
                <Route path="profile" element={<Profile/>} />

              </Route>
 
        </>
    )
)



export default MyRoute;