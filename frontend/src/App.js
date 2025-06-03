import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Employee from './Employee';
import Admin from './Admin';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/employee" element={<Employee />} />
         <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App;
