import { Routes, Route } from "react-router";
import { Auth } from "./pages/AuthForm";
import { HomePage } from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "./App.css";

import { MainPage } from "./components/MainPage/MainPage";
import { UserManagement } from "./components/UserManagement/UserManagement";
import { Reports } from "./components/Reports/Reports";
import { Statistics } from "./components/Statistics/Statistics";
import { Chat } from "./components/Chat/Chat";
import React from "react";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        padding="20px"
      />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/homepage" element={<HomePage />}>
          <Route path="main-page" element={<MainPage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
