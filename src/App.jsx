import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Profile from "./components/Profile.jsx";
import SignIn from "./components/SignIn.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import Home from "./components/Home.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EditProfile from "./components/EditProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}> 
        <LeftSideBar /> 
        <div style={{ flex: 1 }}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/account/edit" element={<EditProfile/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
