import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import './App.css';
import MainDisplay from './components/MainDisplay';
import { UserContextProvider } from './contexts/UserContext';
import LoginScreen from "./pages/LoginScreen"
import NoPage from './pages/NoPage';
import Layout from './pages/Layout'
import SignupScreen from './pages/SignupScreen';
function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />
            <Route path="loginPage" element={<LoginScreen />} />
            <Route path="signupPage" element={<SignupScreen />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
