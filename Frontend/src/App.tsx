import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Mailbox from "./components/Mailbox";
import ComposeMail from "./components/ComposeMail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/compose" element={<ComposeMail />} /> 
      </Routes>
    </Router>
  );
}

export default App;
