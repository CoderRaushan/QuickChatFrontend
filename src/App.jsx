import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./components/Register.jsx";
import ButtonShow from "./components/ButtonShow.jsx";
import Test from "./components/Testing.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/b" element={<ButtonShow/>}/>
        <Route path="/test" element={<Test/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;