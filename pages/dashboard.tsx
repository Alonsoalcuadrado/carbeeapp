import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Cursor,
  fetchAppointments,
  fetchAppointmentTimeAvailability,
} from "../api/apiClient";
import { useRouter } from "next/router";
import "../styles/dashboard.css";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [availability, setAvailability] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pageCursor, setPageCursor] = useState<{
    before?: Cursor;
    after?: Cursor;
  }>({});
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const router = useRouter();

  const fetchAppointmentsData = async () => {
    const params = { size: 3, ...pageCursor };
    const data = await fetchAppointments(params);
    const extractedAppointments = data.edges.map((edge: any) => ({
      ...edge.node,
      cursor: edge.cursor,
    }));
    setAppointments(extractedAppointments);
    setPageInfo(data.pageInfo);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    fetchAppointmentTimeAvailability(selectedDate).then((data) =>
      setAvailability(data)
    );
    fetchAppointmentsData();
  }, [selectedDate, pageCursor]);
  const formatDate = (dateStr: string) => {
    return moment(dateStr).format("LL");
  };

  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(moment().add(i, "days").format("YYYY-MM-DD"));
    }
    return dates;
  };

  const formatScheduledTime = (scheduledTime: string) => {
    return moment(scheduledTime).format("LLLL");
  };

  return (
    <div className="dashboard-container">
      <div className="date-box">
        <h2>Dashboard</h2>
      </div>

      <section className="status-box">
        <h3>Availability</h3>
        <div className="select-box">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {getNextWeekDates().map((date) => (
              <option value={date} key={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="status-box">
        <h3>Appointments</h3>
        <div className="service-box">
          <ul>
            {appointments?.map((appointment) => (
              <li key={appointment.id}>
                <div>
                  <strong>Status:</strong> {appointment.status}
                </div>
                <div>
                  <strong>Start Time:</strong>{" "}
                  {formatScheduledTime(appointment.scheduledTime)}
                </div>
                <div>
                  <strong>Service:</strong> {appointment.workOrder?.service}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="pagination-controls">
        <button
          onClick={() => setPageCursor({ before: appointments[0]?.cursor })}
          disabled={!pageInfo?.hasPreviousPage}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setPageCursor({
              after: appointments[appointments.length - 1]?.cursor,
            })
          }
          disabled={!pageInfo?.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
