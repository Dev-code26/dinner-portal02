import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import DinnerForm from "./components/DinnerForm"; // fix path here!
import Admin from "./components/pages/Admin";
import Dashboard from "./components/pages/Dashboard";
import Employee from "./components/pages/EmployeeLogin";
// import EmployeeLogin from "./components/pages/EmployeeLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/dinner_menu" element={<DinnerForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/EmployeeLogin" element={<EmployeeLogin/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

