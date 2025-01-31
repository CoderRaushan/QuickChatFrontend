import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Register from "./components/Register.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Register/>} /> */}
        <Route path="/" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;