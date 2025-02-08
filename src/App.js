import './styles.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './general_components/Login';
import Register from './general_components/Register';
import Home from './general_components/Home';
import Dashboard from './general_components/Dashboard';
import ProtectedRoute from './general_components/ProtectedRoute';
import ProfileSetup from './general_components/Profile';

function App() {
  return (
    <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element= {<Dashboard />} />
            <Route path='/home' element={<Home />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </header>
    </div>
  );
}

export default App;