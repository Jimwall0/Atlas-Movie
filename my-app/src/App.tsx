import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import LoginAuth from "./components/LoginAuth";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginAuth/>}/>
      </Routes>
    </div>
  )
}