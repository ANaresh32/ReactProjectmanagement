import React, { useEffect, useState } from 'react';
import { getTimesheets } from '../services/timesheetService';

const TimesheetList = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTimesheets();
      setTimesheets(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Timesheet List</h1>
      <ul>
        {timesheets.map((timesheet) => (
          <li key={timesheet.id}>
            {timesheet.date} - {timesheet.hoursWorked} hours
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimesheetList;
