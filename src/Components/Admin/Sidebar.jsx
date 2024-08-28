import { useState, useEffect } from "react";
import "../../assets/Styles/Sidebar.css";
import logo from "../../assets/Images/ArchentsLogo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IoPeopleOutline } from "react-icons/io5";
import { VscProject } from "react-icons/vsc";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsCalendarDay } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { VscTasklist } from "react-icons/vsc";
import { FaChevronRight } from "react-icons/fa";
import { RiDashboard3Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Header from "./Header";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [sessionData, setSessionData] = useState(null);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setOpenDropdowns([]); // Close all dropdowns when sidebar is minimized
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("sessionData");
    if (data) {
      setSessionData(JSON.parse(data));
    }
  }, []);

  const toggleDropdown = (index) => {
    if (!isOpen) return; // Prevent dropdowns from opening when sidebar is minimized
    setOpenDropdowns((prevOpenDropdowns) => {
      if (prevOpenDropdowns.includes(index)) {
        return prevOpenDropdowns.filter((i) => i !== index);
      } else {
        return [...prevOpenDropdowns, index];
      }
    });
  };

  const usaFinanceMenuItems = [
    {
      name: "Project Management",
      icon: <VscProject />,
      submenu: [
        { path: "/Employee/Projects", name: "- All projects" },
        { path: "/Employee/TimeSheet", name: "- Timesheet" }, // Include Timesheet for USA Finance Team
      ],
    },
  ];


  const adminMenuItems = [
    {
      name: "Dashboards",
      icon: <RiDashboard3Line />,
      submenu: [
        { path: "/list2", name: "- Invoice Management" },
        { path: "/list1", name: "- HR management" },
        { path: "/list2", name: "- Job Hiring Management" },
        { path: "/list1", name: "- Project management1" },
        { path: "/list1", name: "- Project management1" },
      ],
    },
    {
      name: "Hr Management",
      icon: <IoPeopleOutline />,
      submenu: [
        { path: "/EmployeeDashboard", name: "- Employees" },
        { path: "/Roles", name: "- Roles" },
        { path: "/list2", name: "- Jobs" },
        { path: "/list1", name: "- Condidates" },
        { path: "/list1", name: "- Attendance" },
        { path: "/list1", name: "- Leaves" },
      ],
    },
    {
      name: "Project Management",
      icon: <VscProject />,
      submenu: [
        { path: "/contracts", name: "- Contracts" },
        { path: "/Dashboard/AllProjects", name: "- Projects" },
        { path: "/Files", name: "- Files" },
        { path: "/Profile", name: "- Profile" },
      ],
    },
    {
      name: "General",
      icon: <AiOutlineDashboard />,
      submenu: [
        { path: "/list2", name: "- Contracts" },
        { path: "/list1", name: "- Profile" },
        { path: "/list2", name: "- Preferences" },
      ],
    },
    {
      name: "Calender",
      icon: <BsCalendarDay />,
      submenu: [
        { path: "/list2", name: "- Inbox" },
        { path: "/list1", name: "- Chat Priview" },
        { path: "/list2", name: "- chat Priview 1" },
      ],
    },
    {
      name: "Email",
      icon: <MdOutlineMailOutline />,
      submenu: [
        { path: "/list2", name: "- Inbox" },
        { path: "/list1", name: "- Email Compose" },
        { path: "/list2", name: "- Email Priview " },
      ],
    },
    {
      name: "Chat",
      icon: <IoChatbubbleOutline />,
      submenu: [
        { path: "/list2", name: "- Inbox" },
        { path: "/list1", name: "- Chat Priview" },
        { path: "/list2", name: "- chat2 Priview " },
      ],
    },
    {
      name: "Invoices",
      icon: <LiaFileInvoiceSolid />,
      submenu: [
        { path: "/list2", name: "- Invoice List" },
        { path: "/list1", name: "- Invoice Details" },
        { path: "/list2", name: "- Create Invoice" },
      ],
    },
    {
      name: "Task",
      icon: <VscTasklist />,
      submenu: [
        { path: "/list2", name: "- Task List" },
        { path: "/list1", name: "- Task2" },
      ],
    },
  ];

  const employeeMenuItems = [
    {
      name: "Dashboards",
      icon: <RiDashboard3Line />,
      submenu: [{ path: "/list2", name: "- Projects" }],
    },
  ];

  const ProjectManagerMenuItems = [
    // {
    //   name: "Dashboards",
    //   icon: <RiDashboard3Line />,
    //   submenu: [
    //     { path: "/list2", name: "- Invoice Management" },
    //     { path: "/list1", name: "- HR management" },
    //     { path: "/list2", name: "- Job Hiring Management" },
    //     { path: "/list1", name: "- Project management1" },
    //     { path: "/list1", name: "- Project management1" },
    //   ],
    // },
    {
      name: "Hr Management",
      icon: <IoPeopleOutline />,
      submenu: [{ path: "/EmployeeDashboard", name: "- Employees" }],
    },
    {
      name: "Project Management",
      icon: <VscProject />,
      submenu: [
        { path: "/Employee/Projects", name: "- All projects" },
        { path: "/Employee/TimeSheet", name: "- Timesheet" },
      ],
    },
  ];

  const menuItems =
    sessionData?.employee?.role?.name === "Admin"
      ? adminMenuItems
      : sessionData?.employee?.role?.name === "Project Manager"
      ? ProjectManagerMenuItems
      : sessionData?.employee?.role?.name === "USA Finance"
      ? usaFinanceMenuItems
      : employeeMenuItems;

  return (
    <div className="containers" style={{ width: "100vw" }}>
      <div
        style={{ width: isOpen ? "370px" : "80px", backgroundColor: "white" }}
        className="sidebar"
      >
        <div className="top_section">
          <div
            style={{ marginLeft: isOpen ? "222px" : "0px" }}
            className="bars"
          >
            <i
              className="bi bi-list openandcloseicon"
              onClick={toggle}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>
        {menuItems.map((item, index) => (
          <div key={index} className="sidebarmenu">
            {isOpen &&
              (index === 0 ? (
                <div>
                  <p className="Mainmenup ms-4 mb-4 ls-1 text-grey text-uppercase">
                    Main Home
                  </p>
                  <p className="b-2 text-uppercase ms-3 mt-4 mb-2">Home</p>
                </div>
              ) : index === 1 ? (
                <p className="mb-2 text-uppercase ms-3 mt-4 mb-2">SASS</p>
              ) : index === 4 ? (
                <p className="b-2 text-uppercase ms-3 mt-4 mb-2">APPS</p>
              ) : null)}
            <NavLink
              to={item.path}
              className="link"
              onClick={() => item.submenu && toggleDropdown(index)}
            >
              <div className="icon" style={{ color: "black" }}>
                {item.icon}
                <div
                  style={{
                    display: isOpen ? "block" : "none",
                    fontSize: "16px",
                    margin: "0px 5px",
                    color: "black",
                  }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </div>

              {item.submenu && (
                <FaChevronRight
                  className={`dropdown-icon ${
                    openDropdowns.includes(index) ? "open" : ""
                  }`}
                  style={{ color: "#9f9f9f" }}
                />
              )}
            </NavLink>
            {item.submenu && (
              <div
                className={`submenu ${
                  openDropdowns.includes(index) ? "open" : ""
                }`}
                style={{
                  padding: isOpen ? "0px 0px" : "8px 0px",
                  backgroundColor: isOpen ? "#DEEFF5" : "white",
                }}
              >
                {item.submenu.map((subItem, subIndex) => (
                  <NavLink
                    to={subItem.path}
                    key={subIndex}
                    className="link submenu_link"
                  >
                    <div
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      {subItem.name}
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="renderdiv">
        <Header />
        <main
          style={{ backgroundColor: "rgb(222, 239, 245)" }}
          className="childercomponents"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;