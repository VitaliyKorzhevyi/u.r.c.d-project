import { Routes, Route } from "react-router";
import { Auth } from "./pages/AuthForm";
import { HomePage } from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import './App.css'

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
        <Route path="homepage" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
