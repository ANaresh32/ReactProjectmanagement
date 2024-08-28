import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeRoutes from "./ManageRoutes/EmployeeRoutes";
import AdminRoutes from "./ManageRoutes/AdminRoutes";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeRoutes />} />
        <Route path="/*" element={<AdminRoutes />} />
        {/* <Route path="/Employee" element={<EmployeeRoutes />} /> */}
      </Routes>
    </Router>
  );
}

export default App;