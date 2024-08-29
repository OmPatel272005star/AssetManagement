import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Asset from './pages/Asset';
import Allocation from './pages/Allocation';
import Employee from './pages/Employee';
import AlertPage from './pages/AlertPage';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

function App() {
  const [auth, setAuth] = useState(false);
  useEffect(()=>{
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuth(true);
    }
  },[auth]);
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        {auth ? (
          <>
            <Route path="/" exact element={<Home z/>} />
            <Route path="/Employee" exact element={<Employee />} />
            <Route path="/Category" exact element={<Category />} />
            <Route path="/Asset" exact element={<Asset />} />
            <Route path="/Allocation" exact element={<Allocation />} />
          </>
        ) : (
          <>
            <Route path="/login" exact element={<LoginPage auth={auth} setAuth={setAuth} />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/Employee" exact element={<AlertPage />} />
            <Route path="/Category" exact element={<AlertPage />} />
            <Route path="/Asset" exact element={<AlertPage />} />
            <Route path="/Allocation" exact element={<AlertPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
