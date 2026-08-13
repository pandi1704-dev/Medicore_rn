import React, { createContext, useContext, useState } from 'react';
import { AppTheme } from '../theme/AppTheme';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'Video Call' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  fee: number;
  color: string;
  cancelReason?: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Aravind Kumar',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospital',
    date: 'Mon, Aug 17, 2026',
    time: '10:30 AM',
    type: 'Video Call',
    status: 'Upcoming',
    fee: 800,
    color: AppTheme.teal,
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    hospital: 'City Care Clinic',
    date: 'Wed, Aug 19, 2026',
    time: '02:00 PM',
    type: 'In-Person',
    status: 'Upcoming',
    fee: 650,
    color: AppTheme.rose,
  },
  {
    id: 'apt-3',
    doctorName: 'Dr. Rajesh Varma',
    specialty: 'Neurologist',
    hospital: 'Fortis Health',
    date: 'Jul 10, 2026',
    time: '04:00 PM',
    type: 'Video Call',
    status: 'Completed',
    fee: 950,
    color: AppTheme.violet,
  },
  {
    id: 'apt-4',
    doctorName: 'Dr. Ananya Roy',
    specialty: 'Pediatrician',
    hospital: 'Max Healthcare',
    date: 'Jun 28, 2026',
    time: '11:00 AM',
    type: 'In-Person',
    status: 'Cancelled',
    fee: 500,
    color: AppTheme.warning,
    cancelReason: 'Schedule Conflict',
  },
];

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (id: string, reason: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType>({
  appointments: INITIAL_APPOINTMENTS,
  addAppointment: () => {},
  cancelAppointment: () => {},
});

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const addAppointment = (newApt: Omit<Appointment, 'id' | 'status'>) => {
    const created: Appointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
      status: 'Upcoming',
    };
    setAppointments((prev) => [created, ...prev]);
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, status: 'Cancelled', cancelReason: reason }
          : apt
      )
    );
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentContext);
