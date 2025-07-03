import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { axiosInstance } from "../Api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useState } from "react";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async ()=>{
    try {
         setIsLoading(true);

         const response = await axiosInstance.get('/auth/logout');
         if(response.status == 200){
          toast.success("Logged out successfully!");
         }
         navigate("/login");

    } catch (error) {
      console.error("Error logging out", error);
      toast.error(error?.response?.data?.msg || "Failed to Logout!");
    }
    finally{
      setIsLoading(false);
    }
  }
  
  return (
   <div>
     <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 
    backdrop-blur-lg "
    >
       
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center z-10">
                <MessageSquare className="w-5 h-5 text-primary z-10" />
              </div>
              <h1 className="text-lg font-bold">ShieldTalk</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4 z-10" />
              <span className="hidden sm:inline">Settings</span>
            </Link> */}

           
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2 mr-2 md:mr-6`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button 
                onClick={handleLogout}
                className="flex gap-2 items-center cursor-pointer" >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
         
          </div>
        </div>
      </div>
    </header>
    {
      isLoading && (
        <Loader/>
      )
    }
   </div>
  );
};

export default Navbar;