export const addEmployeeFormValidation = (name, value) => {
  if (name === "employeeId") {
    if (!value) return "Employee ID is required";

    const employeeIdPattern = /^IARC\d+$/;

    if (!employeeIdPattern.test(value))
      return "Employee ID must start with 'IARC' followed by numbers only.";
  }

  if (name === "firstName") {
    if (!value) return "First name is required";

    const namePattern = /^[A-Za-z]+$/;

    if (!namePattern.test(value))
      return "First name must contain only letters.";
  }
  if (name === "email") {
    if (!value) return "Email is required";
    if (!/^[a-zA-Z]+\.[a-zA-Z]+@archents\.com$/.test(value)) {
      return "Email must be in the format name.surname@archents.com.";
    }
  }
  if (name === "mobileNo") {
    if (!value) return "Mobile Number is required";
    if (!/^\d{10}$/.test(value)) {
      return "Mobile number must be exactly 10 digits and contain only numbers.";
    }
  }
  if (name === "role") {
    if (!value) return "Please select role";
  }

  return "";
};