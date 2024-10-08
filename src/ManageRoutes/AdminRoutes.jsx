import Dashboard from "../Components/Dashboard";
import About from "../Components/Admin/Pages/About";
import Sidebar from "../Components/Admin/Sidebar";
import Comment from "../Components/Admin/Pages/Comment";
import Product from "../Components/Admin/Pages/Product";
import ProductList from "../Components/Admin/Pages/ProductList";
import AllProjects from "../Components/Admin/Pages/AllProjects";
import AddProject from "../Components/Admin/Pages/AddProject";
import { ViewProject } from "../Components/Admin/ViewProject";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "../Components/Employee/EmployeeDashboard";
import Roles from "../Components/Employee/Roles";
import EmployeeDetails from "../Components/Employee/EmployeeDetails";

import Projects from "../Components/Employee/DashboardPages/Projects";
import ViewMangerProject from "../Components/Employee/DashboardPages/ViewProject";
import TimeSheet from "../Components/Employee/DashboardPages/TimeSheet";
import Profile from "../Components/Admin/Pages/Profile";
import AllEmployees from "../Components/Hr/Employees";
import GetAllRevenue from "../Components/IndianFinance/Revenue";
import UnderManagerEmployees from "../Components/Manager/UnderManagerEmployees";
import ViewEmployee from "../Components/Manager/ViewEmployee";
import AddRevenue from "../Components/USFinance/AddRevenue";
import USFiNanceAllProjects from "../Components/USFinance/AllProjects";

export default function AdminRoutes() {
  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/AdminDashboard" element={<Dashboard />} />
        <Route path="/Dashboard/AllProjects" element={<AllProjects />} />
        <Route path="/Dashboard/AddProject" element={<AddProject />} />
        <Route path="/Dashboard/ViewProject" element={<ViewProject />} />
        <Route path="/product" element={<Product />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/Roles" element={<Roles />} />
        <Route path="/EmployeeDetails" element={<EmployeeDetails />} />
        <Route path="/Employee/Projects" element={<Projects />} />
        <Route path="/Employee/ViewProject" element={<ViewMangerProject />} />
        <Route path="/Employee/TimeSheet" element={<TimeSheet />} />
        <Route path="/Dashboard/Profile" element={<Profile />} />
        <Route path="/IndianFinance/Revenue" element={<GetAllRevenue />} />
        <Route path="/ViewEmployee" element={<ViewEmployee />} />
        <Route path="/USFinance/AddRevenue" element={<AddRevenue />} />
        <Route
          path="/UnderManagerEmployees"
          element={<UnderManagerEmployees />}
        />
        <Route
          path="/USFinance/UsFinaceALlProjects"
          element={<USFiNanceAllProjects />}
        />
        {/* hrRoutes */}
        <Route path="/AllEmployees" element={<AllEmployees />} />
      </Routes>
    </Sidebar>
  );
}
