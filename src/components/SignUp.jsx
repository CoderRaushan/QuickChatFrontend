import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import quickchatImg from "@/assets/quickchat.png"; // Adjust the path as necessary
import GooglePhoto from "@/assets/SignUpLogin/google.png";
import GitHubPhoto from "@/assets/SignUpLogin/github.png";
import YoutubePhoto from "@/assets/SignUpLogin/youtube.webp";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
const SignupForm = () => {
  const [loading, setloading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    verificationCode: "",
    age: "",
    password: "",
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGetCode = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!formData.username || !formData.email) {
      toast.error("Please enter your username and email.");
      setloading(false);
      return;
    }
    try {
      const verificationData = {
        username: formData.username,
        email: formData.email,
      };
      const MainUri= import.meta.env.VITE_MainUri;
      const verificationUri = `${MainUri}/auth/verify-email`;
      const response = await axios.post(verificationUri, verificationData);
      if (response.data.success) {
        // console.log(response.data.message);
        setIsCodeSent(true);
        setUserDetails({
          username: formData.username,
          email: formData.email,
        });
        // alert(response.data.message);

        toast.success(response.data.message || "Messsage sent successfylly!");
      } else {
        // console.log(response.data.message);
        // alert(response.data.message);
        toast.error(response.data.message || "Messsage sending error!");
      }
    } catch (error) {
      console.error("Error:", error.response.data.message);
      toast.error(error.response.data.message || "Error sending message");
    } finally {
      setloading(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setloading(true); // Set loading before API call
    if (
      !formData.verificationCode ||
      !formData.age ||
      !formData.password ||
      !formData.username ||
      !formData.email ||
      !formData.name
    ) {
      toast.error("Please fill all fields.");
      setloading(false);
      return;
    }

    try {
      const userdata = {
        username: userDetails.username,
        email: userDetails.email,
        Varcode: formData.verificationCode,
        age: formData.age,
        password: formData.password,
        name: formData.name,
      };
      const MainUri= import.meta.env.VITE_MainUri;
      const signupUri = `${MainUri}/auth/signup`;
      const response = await axios.post(signupUri, userdata);
      if (response.data.success) {
        navigate("/signin");
        setFormData({
          username: "",
          email: "",
          verificationCode: "",
          age: "",
          password: "",
          name: "",
        });
        setIsCodeSent(false);
        // console.log(response.data.message);
        // alert(response.data.message);
        toast.success(response.data.message || "Signup successfylly!");
      } else {
        // console.log(response.data.message);
        // alert(response.data.message);
        toast.error(response.data.message || "Signup error!");
      }
    } catch (error) {
      console.error("Error:", error.response.data.message);
      // alert("Error:", error.response.data.message);
      toast.error(error.response.data.message || "Error signing up");
    } finally {
      setloading(false);
    }
  };
  const MainUri= import.meta.env.VITE_MainUri;
  const callGoogle = async (e) => {
    const GoogleUri = `${MainUri}/auth/google`;
    e.preventDefault();
    window.location.href = GoogleUri;
  };
  const callGithub = async (e) => {
    e.preventDefault();
    window.location.href = `${MainUri}/auth/github`;
  };
  const callYoutube = async (e) => {
    e.preventDefault();
    window.location.href =`${MainUri}/auth/youtube`; ;
  };
  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, []);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <img src={quickchatImg} alt="Logo" className="h-16 w-16" />
          </CardTitle>
          <CardDescription className="text-center">
            Signup to see photos & videos from your friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCodeSent ? (
            <form>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                {loading ? (
                  <Button
                    disabled
                    className="flex items-center justify-center w-full"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait!
                  </Button>
                ) : (
                  <Button
                    onClick={handleGetCode}
                    className="w-full mt-4"
                    type="submit"
                  >
                    Get Verification Code
                  </Button>
                )}
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={callGoogle}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={GooglePhoto} className="w-6 h-6" alt="Google" />{" "}
                    Sign in with Google
                  </Button>
                  <Button
                    onClick={callGithub}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={GitHubPhoto} className="w-6 h-6" alt="GitHub" />{" "}
                    Sign in with GitHub
                  </Button>
                  <Button
                    onClick={callYoutube}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={YoutubePhoto} className="w-6 h-6" alt="GitHub" />{" "}
                    Sign in with Youtube
                  </Button>
                  <span className="flex items-center justify-center">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-blue-800 hover:underline"
                    >
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter verification code"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
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
                <Button className="w-full mt-4" type="submit">
                  Signup
                </Button>
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={callGoogle}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={GooglePhoto} className="w-6 h-6" alt="Google" />{" "}
                    Sign in with Google
                  </Button>
                  <Button
                    onClick={callGithub}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={GitHubPhoto} className="w-6 h-6" alt="GitHub" />{" "}
                    Sign in with GitHub
                  </Button>
                  <Button
                    onClick={callYoutube}
                    className="flex items-center gap-2 bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <img src={YoutubePhoto} className="w-6 h-6" alt="GitHub" />{" "}
                    Sign in with Youtube
                  </Button>
                  <span className="flex items-center justify-center">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-blue-800 hover:underline"
                    >
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
