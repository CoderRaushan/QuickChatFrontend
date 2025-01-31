import React, { useState } from "react";
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
import GooglePhoto from "@/assets/SignUpLogin/google.png";
import GitHubPhoto from "@/assets/SignUpLogin/github.png";
const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
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
    if (!formData.username || !formData.email) {
      alert("Please enter your username and email.");
      return;
    }
    try {
      const verificationData = {
        username: formData.username,
        email: formData.email,
      };
      const verificationUri = import.meta.env.VITE_VERIFYEMAIL;
      const response = await axios.post(verificationUri, verificationData);
      if (response.data.success) {
        console.log(response.data.message);
        setIsCodeSent(true);
        setUserDetails({
          username: formData.username,
          email: formData.email,
        });
        alert(response.data.message);
      } else {
        console.log(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response.data.message);
      alert("Error:", error.response.data.message);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !formData.verificationCode ||
      !formData.age ||
      !formData.password ||
      !formData.username ||
      !formData.email
    ) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const userdata = {
        username: userDetails.username,
        email: userDetails.email,
        Varcode: formData.verificationCode,
        age: formData.age,
        password: formData.password,
      };
      const signupUri = import.meta.env.VITE_signup;
      const response = await axios.post(signupUri, userdata);
      if (response.data.success) {
        setFormData({
          username: "",
          email: "",
          verificationCode: "",
          age: "",
          password: "",
        });
        setIsCodeSent(false);
        console.log(response.data.message);
        alert(response.data.message);
      } else {
        console.log(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response.data.message);
      alert("Error:", error.response.data.message);
    }
  };
  const callGoogle = async (e) => {
    const GoogleUri = import.meta.env.VITE_GooglLOGIN;
    e.preventDefault();
    window.location.href = GoogleUri;
  };
  const callGithub = async (e) => {
    const GoogleUri = import.meta.env.VITE_githubLOGIN;
    e.preventDefault();
    window.location.href = GoogleUri;
  };

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
            <form onSubmit={handleGetCode}>
              <div className="space-y-4">
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
                <Button className="w-full mt-4" type="submit">
                  Get Verification Code
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
