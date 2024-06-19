// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails';
import EmployeeForm from './components/EmployeeForm';
import ProjectList from './components/ProjectList';
import TimesheetList from './components/TimesheetList';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Employees</Link></li>
            <li><Link to="/add-employee">Add Employee</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/timesheets">Timesheets</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/add-employee" element={<EmployeeForm />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/timesheets" element={<TimesheetList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;