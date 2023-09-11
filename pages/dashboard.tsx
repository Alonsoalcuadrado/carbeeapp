import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { fetchAppointments, fetchAppointmentTimeAvailability } from '../api/apiClient';
import { useRouter } from 'next/router';
import "../styles/dashboard.css"

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [availability, setAvailability] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    //Get auth if not redirect to login
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      router.replace('/login');
    }
  }, []);

  useEffect(() => {
    // Get availability
    fetchAppointmentTimeAvailability(selectedDate).then(data => setAvailability(data));

    // Get appointments
    fetchAppointments({ size: 10 }).then(data => setAppointments(data.edges));
  }, [selectedDate]);

  const formatDate = (dateStr: string) => {
    return moment(dateStr).format('LL');
  };

  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  };

  return (
    <div className="dashboard-container">
      <div className="date-box">
        <h2>Dashboard</h2>
      </div>

      <section className="status-box">
        <h3>Availability</h3>
        <div className="select-box">
        <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
            {getNextWeekDates().map(date => (
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
            {appointments.map(appointment => (
              <li key={appointment.id}>
                <div><strong>Status:</strong> {appointment.status}</div>
                <div><strong>Start Time:</strong> {appointment.startTime}</div>
                <div><strong>Duration:</strong> {appointment.duration}</div>
                {appointment.completeTime && <div><strong>Complete Time:</strong> {appointment.completeTime}</div>}
                <div><strong>Service:</strong> {appointment.workOrderDto?.service}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );


}

export default Dashboard;
