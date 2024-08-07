import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeModal from './AddEmployeeModal';
import ConfirmationModal from './DeleteConfirmationEmpModal';
import '../../assets/Styles/EmployeePages/EmployeeDetails.css';

const EmployeeDetails = () => { 
  const [employee, setEmployee] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(''); // new state to track action type
  const [projectManagerName, setProjectManagerName] = useState('NA');
  const navigate = useNavigate();
  const empId = localStorage.getItem("id");

  useEffect(() => {
    fetchEmployeeDetails(empId);
    fetchRoles();
  }, [empId]);

  const fetchEmployeeDetails = async (empId) => {
    try {
      const response = await axios.get(`https://localhost:44305/api/Employees/GetEmployee?id=${empId}`);
      const employeeData = response.data;
      setEmployee(employeeData);

      // Fetch Project Manager details if `projectManagerId` is available
      if (employeeData.projectManagerId) {
        const pmResponse = await axios.get(`https://localhost:44305/api/Employees/GetEmployee?id=${employeeData.projectManagerId}`);
        setProjectManagerName(`${pmResponse.data.firstName} ${pmResponse.data.lastName}`);
      } else {
        setProjectManagerName('NA');
      }
    } catch (error) {
      console.error('Error fetching employee details', error.response ? error.response.data : error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://localhost:44305/api/Roles/AllRoles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error.response ? error.response.data : error.message);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDeactivate = () => {
    setActionType('deactivate');
    setShowConfirmModal(true);
  };

  const handleActivate = () => {
    setActionType('activate');
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    setActionType('delete');
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      if (actionType === 'deactivate' && employee) {
        await axios.put(`https://localhost:44305/api/Employees/UpdateEmployee`, { ...employee, employeeStatus: 0 });
        navigate('/EmployeeDashboard');  
      } else if (actionType === 'activate' && employee) {
        await axios.put(`https://localhost:44305/api/Employees/UpdateEmployee`, { ...employee, employeeStatus: 1 });
        navigate('/EmployeeDashboard');
      } else if (actionType === 'delete' && employee) {
        await axios.delete(`https://localhost:44305/api/Employees/${employee.id}`);
        navigate('/EmployeeDashboard');
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error(`Error during ${actionType} operation`, error.response ? error.response.data : error.message);
    }
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setActionType('');
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const isInactive = employee.employeeStatus === 0;

  return (
    <div className="EmployeeDetails">
      <div className="EmpDetailsHeader">
        <h3>Employee Details</h3>
        <button className="EmpBackBtn" onClick={() => navigate('/EmployeeDashboard')}>X</button>
      </div>
      <div className="EmpDetailsContainer">
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Employee ID:</div>
          <div className="EmpDetailsValue">{employee.employeeId}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">First Name:</div>
          <div className="EmpDetailsValue">{employee.firstName}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Last Name:</div>
          <div className="EmpDetailsValue">{employee.lastName}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Email:</div>
          <div className="EmpDetailsValue">{employee.email}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Mobile No:</div>
          <div className="EmpDetailsValue">{employee.mobileNo}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Date of Joining:</div>
          <div className="EmpDetailsValue">{new Date(employee.dateOfJoining).toLocaleDateString('en-GB')}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Status:</div>
          <div className="EmpDetailsValue">{isInactive ? 'Inactive' : 'Active'}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Role:</div>
          <div className="EmpDetailsValue">{getRoleName(employee.roleId)}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Project Manager:</div>
          <div className="EmpDetailsValue">{projectManagerName}</div>
        </div>
        <div className="EmpDetailsRow">
          <div className="EmpDetailsLabel">Skills:</div>
          <div className="EmpDetailsValue">{employee.skillSets || 'NA'}</div>
        </div>
      </div>
      <div className="EmpActions">
        {isInactive ? (
          <>
            <button className="EmpActivateBtn" onClick={handleActivate}>Activate</button>
            <button className="EmpDeleteBtn" onClick={handleDelete}>Delete</button>
          </>
        ) : (
          <>
            <button className="EmpEditBtn" onClick={handleEdit}>Edit</button>
            <button className="EmpDeactivateBtn" onClick={handleDeactivate}>Deactivate</button>
          </>
        )}
      </div>
      {showEditModal && <EmployeeModal employee={employee} onClose={() => setShowEditModal(false)} onRefresh={() => fetchEmployeeDetails(empId)} />}
      {showConfirmModal && (
        <ConfirmationModal
          message={`Are you sure you want to ${actionType} "${employee.firstName} ${employee.lastName}"?`}
          onConfirm={handleConfirm}
          onCancel={cancelAction}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
