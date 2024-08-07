import axios from 'axios';
import React, { useState, useEffect } from 'react';

const AddEmployeeModal = ({ employee, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    mobileNo: '',
    dateOfJoining: '',
    projectManagerId: '', 
    employeeStatus: 'Active', 
    skillSets: '',
    roleId: ''
  });
  const [roles, setRoles] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [errors, setErrors] = useState({});
  const [existingEmployeeIds, setExistingEmployeeIds] = useState([]);
  const [employeeExistsError, setEmployeeExistsError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailMobileErrors, setEmailMobileErrors] = useState({});
  const isEditing = !!employee;

  useEffect(() => {
    if (employee) {
      const formattedDate = new Date(employee.dateOfJoining).toISOString().split('T')[0];
      setFormData({
        ...employee,
        dateOfJoining: formattedDate,
        employeeStatus: employee.employeeStatus === 1 ? 'Active' : 'Inactive',
        projectManagerId: employee.projectManagerId ? employee.projectManagerId : ''
      });
    } else {
      const now = new Date();
      now.setHours(11, 0, 0, 0);
      const defaultDate = now.toISOString().split('T')[0];
      setFormData(prevData => ({ ...prevData, dateOfJoining: defaultDate }));
      fetchEmployeeIds();
    }
    fetchRoles();
    fetchProjectManagers();
  }, [employee]);

  const fetchEmployeeIds = async () => {
    try {
      const response = await axios.get('https://localhost:44305/api/Employees/AllEmployees');
      const ids = response.data.map(emp => emp.employeeId);
      setExistingEmployeeIds(ids);
      if (!employee) {
        const nextEmployeeId = getNextEmployeeId(ids);
        setFormData(prevData => ({ ...prevData, employeeId: nextEmployeeId }));
      }
    } catch (error) {
      console.error('Error fetching employee IDs', error);
    }
  };

  const getNextEmployeeId = (existingIds) => {
    const prefix = 'IARC';
    const currentIds = existingIds
      .filter(id => id.startsWith(prefix))
      .map(id => parseInt(id.slice(prefix.length), 10))
      .filter(id => !isNaN(id));
    const maxId = currentIds.length ? Math.max(...currentIds) : 0;
    return `${prefix}${String(maxId + 1).padStart(4, '0')}`;
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://localhost:44305/api/Roles/AllRoles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const fetchProjectManagers = async () => {
    try {
      const response = await axios.get('https://localhost:44305/api/Employees/AllEmployees');
      const rolesResponse = await axios.get('https://localhost:44305/api/Roles/AllRoles');
      const projectManagerRole = rolesResponse.data.find(role => role.name === 'Project Manager');
      if (projectManagerRole) {
        const projectManagers = response.data.filter(emp => emp.roleId === projectManagerRole.id);
        setProjectManagers(projectManagers);
      }
    } catch (error) {
      console.error('Error fetching project managers', error);
    }
  };

  const handleProjectManagerChange = (e) => {
    const selectedName = e.target.value;
    const selectedPm = projectManagers.find(pm => `${pm.firstName} ${pm.lastName}` === selectedName);
    if (selectedPm) {
      setFormData(prevData => ({
        ...prevData,
        projectManagerId: selectedPm.id 
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        projectManagerId: '' 
      }));
    }
  };

  const validate = (fieldName, value) => {
    switch (fieldName) {
      case 'firstName':
        if (!value) return 'First name is required';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid';
        break;
      case 'passwordHash':
        if (!value) return "Password field is missing";
        const errors = [];
        if (value.length < 8) errors.push('at least 8 characters');
        if (!/[A-Z]/.test(value)) errors.push('at least one uppercase letter');
        if (!/[a-z]/.test(value)) errors.push('at least one lowercase letter');
        if (!/\d/.test(value)) errors.push('at least one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('at least one special character');
        if (errors.length) return `Password must contain ${errors.join(', ')}`;
        break;
      case 'dateOfJoining':
        if (!value) return 'Date of Joining is required';
        break;
      case 'roleId':
        if (!value) return 'Role is required';
        break;
      case 'mobileNo':
        if (!value) return 'Mobile number is required';
        if (!/^\d+$/.test(value)) return 'Mobile number must contain only numbers';
        break;
      case 'employeeId':
        if (!value) return 'Employee ID is required';
        if (existingEmployeeIds.includes(value)) return 'Employee ID already exists';
        break;
      default:
        return '';
    }
    return '';
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));

    if (name === 'employeeId' && existingEmployeeIds.includes(value)) {
      setEmployeeExistsError('Employee ID already exists');
    } else {
      setEmployeeExistsError('');
    }
    
    if (name === 'email' || name === 'mobileNo') {
      const debounceTimeout = setTimeout(async () => {
        const duplicateErrors = await checkEmailAndMobileExistence();
        setEmailMobileErrors(duplicateErrors);
      }, 500);
      return () => clearTimeout(debounceTimeout);
    }
  };

  const checkEmailAndMobileExistence = async () => {
    try {
      const response = await axios.get('https://localhost:44305/api/Employees/AllEmployees');
      const { email, mobileNo } = formData;
      const existingEmployee = response.data.find(
        emp => (emp.email === email || emp.mobileNo === mobileNo) && emp.id !== employee?.id
      );
      const newErrors = {};
      if (existingEmployee) {
        if (existingEmployee.email === email) {
          newErrors.email = 'Email already exists';
        }
        if (existingEmployee.mobileNo === mobileNo) {
          newErrors.mobileNo = 'Mobile number already exists';
        }
      }
      return newErrors;
    } catch (error) {
      console.error('Error checking email and mobile existence', error);
      return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validate(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    const duplicateErrors = await checkEmailAndMobileExistence();
    setEmailMobileErrors(duplicateErrors);

    if (Object.keys(newErrors).length > 0 || Object.keys(duplicateErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { dateOfJoining, employeeStatus, projectManagerId } = formData;
      const date = new Date(dateOfJoining);
      date.setHours(11, 0, 0, 0);
      const formattedDateOfJoining = date.toISOString();

      const dataToSubmit = {
        ...formData,
        dateOfJoining: formattedDateOfJoining,
        employeeStatus: employeeStatus === 'Active' ? 1 : 0, 
        projectManagerId: projectManagerId ? projectManagerId : null 
      };

      if (!employee) {
        await axios.post('https://localhost:44305/api/Employees/CreateEmployee', dataToSubmit);
      } else {
        await axios.put(`https://localhost:44305/api/Employees/UpdateEmployee`, dataToSubmit);
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving employee', error);
    }
  };

  return (
    <div className="AddEmpMdlOverlay">
      <div className="AddEmpMdlContent">
        <div className='AddEmpMdlHeader'>
          <div className='AddEmpMdlHeaderLeft'>
            <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          </div>
          <div className='AddEmpMdlRightDiv'>
            <button className="AddEmpMdlRightCloseBtn" onClick={onClose}>X</button>
          </div>
        </div>
        
        <form className="AddEmpMdl" onSubmit={handleSubmit}>
          {/* {isEditing && (
            <input type="hidden" name="employeeId" value={formData.employeeId} />
          )} */}
          <label htmlFor="firstName">Employee ID:
            <input type="EmpInputtxt" id="employeeId" name="employeeId" value={formData.employeeId}
              onChange={handleChange} disabled={isEditing} />
            {errors.employeeId && <span className="error">{errors.employeeId}</span>}
          </label>

          <label htmlFor="firstName">First Name:
            <input type="EmpInputtxt" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}/>
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </label>

          <label htmlFor="lastName">Last Name:
            <input type="EmpInputtxt" id="lastName" name="lastName"value={formData.lastName} onChange={handleChange} />
          </label>

          <label htmlFor="email">Email:
            <input type="EmpInputtxt" id="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
            {emailMobileErrors.email && <span className="error">{emailMobileErrors.email}</span>}
          </label>

          <label>Password:
            <div className="AddEmpMdlPwdInput">
              <input type={passwordVisible ? "text" : "password"}
                name="passwordHash" value={formData.passwordHash} onChange={handleChange}/>
              <span className="AddEmpMdlEyeIcon" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            {errors.passwordHash && (<span className="AddEmpMdlPwdError">{errors.passwordHash}</span>)}
          </label>

          <label htmlFor="mobileNo">Mobile Number:
            <input type="EmpInputtxt" id="mobileNo" name="mobileNo"
              value={formData.mobileNo} onChange={handleChange} />
            {errors.mobileNo && <span className="error">{errors.mobileNo}</span>}
            {emailMobileErrors.mobileNo && <span className="error">{emailMobileErrors.mobileNo}</span>}
          </label>

          <label htmlFor="dateOfJoining">Date of Joining:
            <input type="date" id="dateOfJoining" name="dateOfJoining" className="AddEmpMdlDoj"
              value={formData.dateOfJoining} onChange={handleChange} />
            {errors.dateOfJoining && <span className="error">{errors.dateOfJoining}</span>}
          </label>

          {/* <label htmlFor="projectManagerId">Project Manager:
            <select id="projectManagerId" name="projectManagerId"
              value={formData.projectManagerId} onChange={handleProjectManagerChange} >
              <option value="">Select Project Manager</option>
              {projectManagers.map(pm => (
                <option key={pm.id} value={`${pm.firstName} ${pm.lastName}`}>
                  {pm.firstName} {pm.lastName}
                </option>
              ))}
            </select>
          </label> */}
          <label htmlFor="projectManagerId">Project Manager:
            <select name="projectManagerId" value={formData.projectManagerId || ""} onChange={handleChange}>
              <option value="">Select Project Manager</option>
              {projectManagers.map((pm) => ( <option key={pm.id} value={pm.id}>
                {pm.firstName} {pm.lastName}</option>
              ))}
            </select>
          </label>

          <label htmlFor="roleId">Role:
            <select id="roleId" name="roleId" value={formData.roleId} onChange={handleChange}>
              <option value="">Select Role</option>
              {roles.map(role => ( 
                <option key={role.id} value={role.id}> {role.name}</option>
              ))}
            </select>
            {errors.roleId && <span className="error">{errors.roleId}</span>}
          </label>
          
          <label> Skill Sets:
            <textarea id="skillSets" name="skillSets" value={formData.skillSets} onChange={handleChange}></textarea>
          </label>
          
          <button type="submit" className="AddEmpMdlSubmitBtn">
            {isEditing ? 'Save Modifications' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
