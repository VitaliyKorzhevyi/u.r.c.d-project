import { Routes, Route } from "react-router";
import { Auth } from "./pages/AuthForm";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="homepage" element={<HomePage />} />
    </Routes>
  );
}

export default App;

