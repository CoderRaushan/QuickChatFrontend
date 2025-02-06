import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
// import Register from "./components/Register.jsx";
import SignIn from "./components/SignIn.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import  Home  from "./components/Home.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Register/>} /> */}
        <Route path="/" element={<Home/>} />
        <Route path="/leftsidebar" element={<LeftSideBar/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/signin" element={<SignIn/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;