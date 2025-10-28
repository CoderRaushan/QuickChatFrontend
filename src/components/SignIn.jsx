import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import quickchatImg from "@/assets/quickchat.png"; // Adjust the path as necessary
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../ReduxStore/authSlice";
import {setisLogin} from "../ReduxStore/LoginSlice.js";

const SignIn = () => {
const Navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {user}=useSelector(store=>store.auth);
  const dispatch=useDispatch();
    const {isLogin}=useSelector((store)=>store.isLogin);
  const [loading, setloading] = useState(false);
  // const [Verified, setVerified] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields.");
      setloading(false);
      return;
    }
    try {
     
      const userdata = {
        email: formData.email,
        password: formData.password,
      };
  
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.post(`${MainUri}/user/signin`, userdata,{ 
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      if (response.data.success) {
        dispatch(setisLogin(true));
        Navigate("/");
        dispatch(setAuthUser(response.data.user));
        setFormData({ email: "", password: "" });
        toast.success(response.data.message || "Signed in successfully");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error.response.data.message || error.message);
      toast.error(error.response.data.message || error.message);
    } finally {
      setloading(false);
    }
  };
  const MainUri= import.meta.env.VITE_MainUri;
  const callGoogle = async (e) => {
    const GoogleUri =  `${MainUri}/auth/google`
    e.preventDefault();
    window.location.href = GoogleUri;
  };
  const callGithub = async (e) => {
    e.preventDefault();
    window.location.href = `${MainUri}/auth/github`;
  };
  const callYoutube = async (e) => {
    e.preventDefault();
    window.location.href =`${MainUri}/auth/youtube`;
  };
// useEffect(()=>{
//   if(user)
//   {
//     Navigate("/");
//   }
// },[])
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <img src={quickchatImg} alt="Logo" className="h-16 w-16" />
          </CardTitle>
          <CardDescription className="text-center">
            SignIn to see photos & videos from your friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  autoComplete="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  autoComplete="current-password"
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              {loading ? (
                  <Button disabled className="flex items-center justify-center w-full">
                    <Loader2  className="mr-2 h-4 w-4 animate-spin"/>
                      Please Wait!
                  </Button>
                ) : (
                  <Button 
                  onClick={handleSignIn}
                  className="w-full mt-4"
                  type="submit"
                >
                  Sign in
                </Button>
                )}
              <div className="flex flex-col space-y-4">
                <span className="flex items-center justify-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-800 hover:underline">
                    Signup
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
