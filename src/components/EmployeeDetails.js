import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeById } from '../services/employeeService';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEmployeeById(id);
      setEmployee(data);
    };

    fetchData();
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h1>Employee Details</h1>
      <p>{employee.firstName} {employee.lastName}</p>
      <p>Email: {employee.email}</p>
      <p>Mobile: {employee.mobileNo}</p>
    </div>
  );
};

export default EmployeeDetails;
