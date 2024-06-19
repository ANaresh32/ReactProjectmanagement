import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    mobileNo: '',
    dateOfJoining: '',
    projectManagerId: '',
    employeeStatus: '',
    skillSets: '',
    roleId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:5001/api/employees', employee);
      alert('Employee added successfully');
    } catch (error) {
      console.error('There was an error adding the employee!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="employeeId" value={employee.employeeId} onChange={handleChange} placeholder="Employee ID" required />
      <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input type="email" name="email" value={employee.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="passwordHash" value={employee.passwordHash} onChange={handleChange} placeholder="Password" required />
      <input type="text" name="mobileNo" value={employee.mobileNo} onChange={handleChange} placeholder="Mobile Number" required />
      <input type="date" name="dateOfJoining" value={employee.dateOfJoining} onChange={handleChange} required />
      <input type="text" name="projectManagerId" value={employee.projectManagerId} onChange={handleChange} placeholder="Project Manager ID" />
      <input type="text" name="employeeStatus" value={employee.employeeStatus} onChange={handleChange} placeholder="Employee Status" required />
      <input type="text" name="skillSets" value={employee.skillSets} onChange={handleChange} placeholder="Skill Sets" />
      <input type="text" name="roleId" value={employee.roleId} onChange={handleChange} placeholder="Role ID" required />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;
