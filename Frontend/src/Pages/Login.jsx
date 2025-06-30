import React from 'react'
import { useState } from 'react';
import Loader from '../Components/Loader';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from 'react-router-dom';
import AuthImagePattern from '../Components/AuthImagePattern';
import { axiosInstance } from '../Api/axiosInstance';




const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        
        try{
            setIsLoading(true);

            
            const response = await axiosInstance.post('/auth/login',{
                email,
                password, 
            })
            
            if(response.status==200){
                toast.success('Login Success!');
              }

             setemail("");
             setpassword(""); 
        }catch (error) {
            
            toast.error(error?.response?.data?.msg || 'Login failed');
          } finally {
          setIsLoading(false); 
        }
        
    
    }

    return (
       <div>
         <div className="min-h-screen grid lg:grid-cols-2">
          
          {/* left side */}
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* LOGO */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                  >
                    <MessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                  <p className="text-base-content/60">Sign in to your account</p>
                </div>
              </div>
    
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
            
                </div>
    
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                     onChange={(e)=>{setemail(e.target.value)}}
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      required
                      
                    />
                  </div>
                </div>
    
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                     onChange={(e)=>{setpassword(e.target.value)}}
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                     required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
    
                <button type="submit" className="btn btn-primary w-full" >
                    Login
                </button>
              </form>
    
              <div className="text-center">
                <p className="text-base-content/60">
                Create account{" "}
                  <Link to="/login" className="link link-primary">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
    
          {/* right side */}
    
          <AuthImagePattern
            title="Welcome back!"
            subtitle="Sign in to continue your conversations and catch up with your messages."
          />
        </div>
       
        {
        isLoading && (
            <Loader/>
        )
      }
       </div>
      );
}

export default Login;