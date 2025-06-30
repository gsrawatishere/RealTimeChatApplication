import { createBrowserRouter, createRoutesFromChildren, Route } from "react-router-dom";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

const MyRoute = createBrowserRouter(
    createRoutesFromChildren(
        <>
              <Route path="/register" element={<Register/>} />
              <Route path='/login' element={<Login/>} />

        </>
    )
)



export default MyRoute;