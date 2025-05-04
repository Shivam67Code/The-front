import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Meals from "./pages/Dashboard/Meals"; 
import { UserProvider } from "./context/userContext"; 
import ThemeProvider from "./context/themeContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <div>
          <Router> 
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/meals" element={<Meals />} />
            </Routes>
          </Router>
        </div>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontsize: '13px'
            },
          }}
        />
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;

