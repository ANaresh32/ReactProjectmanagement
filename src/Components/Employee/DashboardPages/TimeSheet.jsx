import { useEffect, useState, forwardRef } from "react";
import EmployeeService from "../../../Service/EmployeeService/EmployeeService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assets/Styles/TimeSheet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import TimeSheetService from "../../../Service/TimeSheetService";
import logo from "../../../assets/Images/1.jpg";
import { GrPowerReset } from "react-icons/gr";
import { IoSaveOutline } from "react-icons/io5";

export default function TimeSheet() {
  const [projectDetails, setProjectDetails] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disabledTabs, setDisabledTabs] = useState([]);
  const [hours, setHours] = useState({});
  const [revenue, setRevenue] = useState({}); // Add state for revenue if needed
  const userDetails = JSON.parse(localStorage.getItem("sessionData"));
  const [selectedProjectId, setSelectedProjectID] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [disiblebuttons, setDisiblebuttons] = useState(false);
  const [isUSAUser, setIsUSAUser] = useState(userDetails.employee.role.name === "USA Finance");

  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    if (projectDetails.length > 0) {
      const initialProject = projectDetails[selectedTabIndex].project.id;
      GetProjectDeatis(initialProject, selectedDate);
    }
  }, [projectDetails, selectedTabIndex, selectedDate]);

  async function FetchData() {
    const response = await EmployeeService.GetProjectInfo(userDetails.employee.id);
    const projects = response.item;
    setProjectDetails(projects);
  }

  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
  };

  const handleDateChange = async (projectId, date) => {
    const formattedDate = format(date, "MMMM yyyy");
    setSelectedDate(date);
    setHours({});
    setRevenue({}); // Clear revenue data
    await GetProjectDeatis(projectId, formattedDate);
  };

  const handleHoursChange = (employeeId, value) => {
    setHours((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const handleRevenueChange = (employeeId, value) => {
    setRevenue((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const submitFunction = () => {
    const currentProject = projectDetails[selectedTabIndex];
    const employeeData = currentProject.employees.map((employee) => ({
      employeeId: employee.id,
      hoursWorked: hours[employee.id] || "",
      revenue: isUSAUser ? revenue[employee.id] || "" : undefined, // Include revenue if USA user
    }));
    return {
      projectId: currentProject.project.id,
      selectedDate: format(selectedDate, "MMMM yyyy"),
      employeeData,
    };
  };

  const SaveForm = async () => {
    const data = submitFunction();
    const response = await TimeSheetService.AddNewTimeSheet(
      data,
      userDetails.employee.id,
      false
    );
    if (response.isSuccess) {
      toast.success("Successfully saved.", {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const SubmitFormFunction = async () => {
    const data = submitFunction();
    const response = await TimeSheetService.AddNewTimeSheet(
      data,
      userDetails.employee.id,
      true
    );
    if (response.isSuccess) {
      toast.success("Successfully submitted.", {
        position: "top-right",
        autoClose: 4000,
      });
      const projectId = projectDetails[selectedTabIndex].project.id;
      await GetProjectDeatis(projectId, selectedDate);
      setDisabledTabs((prev) => [...prev, selectedTabIndex]);
    } else {
      toast.error(response.error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const GetProjectDeatis = async (id, date) => {
    setSelectedProjectID(id);
    const formattedDate = format(date, "MMMM yyyy");
    const response = await TimeSheetService.GetTimeSheetDeatils(
      formattedDate,
      id
    );

    setEmployees(response.item);
    if (response.item.length > 0) {
      if (response.item.every((el) => el.isSubmited === true)) {
        setDisiblebuttons(true);
      } else {
        setDisiblebuttons(false);
      }
    } else {
      setDisiblebuttons(false);
    }

    const newHours = {};
    const newRevenue = {}; // Initialize revenue object
    response.item.forEach((each) => {
      newHours[each.employeeId] = each.workingHourse;
      if (isUSAUser) {
        newRevenue[each.employeeId] = each.revenue || ""; // Add revenue if USA user
      }
    });
    setHours(newHours);
    setRevenue(newRevenue); // Update revenue state
  };

  const Resetfunction = (e) => {
    setHours({});
    setRevenue({}); // Clear revenue data on reset
  };

  return (
    <div className="Maindiv">
      <div className="card" style={{ borderRadius: "0px" }}>
        <div>
          <p className="timesheet">Time Sheet</p>
        </div>

        <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabSelect}>
          <TabList>
            {projectDetails.map((obj, index) => (
              <Tab
                key={index}
                style={{ color: "blue" }}
                onClick={() => GetProjectDeatis(obj.project.id, selectedDate)}
              >
                {obj.project.projectName}
              </Tab>
            ))}
          </TabList>
          {projectDetails.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "black", fontWeight: "600" }}
            >
              <p>No projects assigned</p>
            </div>
          ) : (
            projectDetails.map((project, projectIndex) => (
              <TabPanel key={projectIndex}>
                <div>
                  <div className="datepicker">
                    <DatePicker
                      style={{ alignItems: "end" }}
                      selected={selectedDate}
                      onChange={(date) =>
                        handleDateChange(project.project.id, date)
                      }
                      showMonthYearPicker
                      dateFormat="MMMM yyyy"
                      customInput={<CustomInput />}
                      className="w-100"
                      maxDate={maxDate}
                    />
                  </div>
                </div>

                <div className="row">
                  <table className="table table-striped mt-2">
                    <thead>
                      <tr>
                        <th className="tableheader">NAME</th>
                        <th className="tableheader">DESIGNATION</th>
                        <th className="" style={{ textAlign: "center" }}>
                          STATUS
                        </th>
                        <th className="" style={{ textAlign: "center" }}>
                          ROLE
                        </th>
                        <th className="" style={{ textAlign: "center" }}>
                          HOURS
                        </th>
                        {isUSAUser && (
                          <th className="" style={{ textAlign: "center" }}>
                            REVENUE
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {project.employees.length === 0 ? (
                        <tr>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: "center" }}>No Records Found</td>
                          <td></td>
                          <td></td>
                        </tr>
                      ) : (
                        project.employees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.designation}</td>
                            <td style={{ textAlign: "center" }}>
                              {employee.isSubmited ? "Submitted" : "Not Submitted"}
                            </td>
                            <td>{employee.role}</td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="number"
                                min="0"
                                className="form-control"
                                disabled={employee.isSubmited}
                                value={hours[employee.id] || ""}
                                onChange={(e) =>
                                  handleHoursChange(employee.id, e.target.value)
                                }
                              />
                            </td>
                            {isUSAUser && (
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control"
                                  disabled={employee.isSubmited}
                                  value={revenue[employee.id] || ""}
                                  onChange={(e) =>
                                    handleRevenueChange(employee.id, e.target.value)
                                  }
                                />
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="row">
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={SaveForm}
                      disabled={disiblebuttons}
                    >
                      <IoSaveOutline style={{ marginRight: "5px" }} />
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={SubmitFormFunction}
                      disabled={disiblebuttons}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={Resetfunction}
                      disabled={disiblebuttons}
                    >
                      <GrPowerReset style={{ marginRight: "5px" }} />
                      Reset
                    </button>
                  </div>
                </div>
              </TabPanel>
            ))
          )}
        </Tabs>
        <ToastContainer />
      </div>
    </div>
  );
}

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="datepicker-button" onClick={onClick} ref={ref}>
    <FontAwesomeIcon icon={faCalendar} />
    {value}
  </button>
));
