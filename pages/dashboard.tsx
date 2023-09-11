import React, { useState, useEffect } from 'react';
import { fetchAppointments, fetchAppointmentTimeAvailability } from '../api/apiClient';
import { useRouter } from 'next/router';

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


  return (
    <div>
      <h2>Dashboard</h2>

      <section>
        <h3>Disponibilidad</h3>
        <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
        </select>
        <ul>
          {availability.map(time => (
            <li key={time}>{time}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Mis Citas</h3>
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id}>
              <div>Status: {appointment.status}</div>
              <div>Start Time: {appointment.startTime}</div>
              <div>Duration: {appointment.duration}</div>
              {appointment.completeTime && <div>Complete Time: {appointment.completeTime}</div>}
              <div>Service: {appointment.workOrderDto?.service}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
