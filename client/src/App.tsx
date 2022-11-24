import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import './App.css';
import SimulatorScreen from './pages/SimulatorScreen';
import { UserContextProvider } from './contexts/UserContext';
import LoginScreen from "./pages/LoginScreen"
import NoPage from './pages/NoPage';
import Layout from './pages/Layout'
import SignupScreen from './pages/SignupScreen';
import { FantasyTeamProvider } from './contexts/FantasyTeamContext';
function App() {
  return (
    <UserContextProvider>
      <FantasyTeamProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>

              <Route index element={<Home />} />
              <Route path="loginPage" element={<LoginScreen />} />
              <Route path="signupPage" element={<SignupScreen />} />
              <Route path="simulator" element={<SimulatorScreen />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FantasyTeamProvider>
    </UserContextProvider>
  );
}

export default App;
