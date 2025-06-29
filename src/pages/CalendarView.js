import React, { useState, useEffect, useContext } from 'react'; // Add useContext
import './CalendarView.css';
import { DataContext } from '../context/DataContext'; // Import DataContext

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-06-29'));
    const [days, setDays] = useState([]);
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get incidents from DataContext
    const { incidents } = useContext(DataContext); // Use useContext to get incidents

    useEffect(() => {
        generateCalendarDays(currentDate);
    }, [currentDate, incidents]); // Add incidents to dependency array

    const generateCalendarDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const totalDaysInMonth = lastDayOfMonth.getDate();

        const generatedDays = [];

        // Helper to format date to 'YYYY-MM-DD' for comparison
        const formatDate = (d) => d.toISOString().split('T')[0];

        // 1. Days from the previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek; i > 0; i--) {
            const day = prevMonthLastDay - i + 1;
            const keyDate = new Date(year, month - 1, day);
            generatedDays.push({
                key: formatDate(keyDate),
                dayOfMonth: day,
                isCurrentMonth: false,
                appointments: [], // No appointments for prev/next month days
            });
        }

        // 2. Days of the current month
        for (let i = 1; i <= totalDaysInMonth; i++) {
            const keyDate = new Date(year, month, i);
            const dateStr = formatDate(keyDate);

            // Filter incidents for this specific day
            // Ensure incidents is not null/undefined before filtering
            const dailyAppointments = incidents ? incidents.filter(inc => {
                const appointmentDate = new Date(inc.appointmentDate);
                return formatDate(appointmentDate) === dateStr;
            }) : [];


            generatedDays.push({
                key: dateStr,
                dayOfMonth: i,
                isCurrentMonth: true,
                isToday: keyDate.toDateString() === today.toDateString(),
                appointments: dailyAppointments, // Assign filtered appointments
            });
        }

        // 3. Days from the next month
        const lastDayOfWeek = lastDayOfMonth.getDay();
        const remainingDays = 6 - lastDayOfWeek;
        for (let i = 1; i <= remainingDays; i++) {
            const keyDate = new Date(year, month + 1, i);
             generatedDays.push({
                key: formatDate(keyDate),
                dayOfMonth: i,
                isCurrentMonth: false,
                appointments: [], // No appointments for prev/next month days
            });
        }
        
        setDays(generatedDays);
    };

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    
    const handleGoToToday = () => {
        setCurrentDate(new Date());
    }

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h2 className="calendar-title">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="calendar-nav">
                    <button onClick={handleGoToToday}>Today</button>
                    <button onClick={handlePrevMonth}>&lt;</button>
                    <button onClick={handleNextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar-grid">
                {daysOfWeek.map(day => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}

                {days.map((day) => (
                    <div
                        key={day.key}
                        className={`calendar-day ${!day.isCurrentMonth ? 'not-current-month' : ''}`}
                    >
                        <span className={`day-number ${day.isToday ? 'today' : ''}`}>
                            {day.dayOfMonth}
                        </span>
                        <div className="events-container">
                            {day.appointments?.map(app => (
                                <div key={app.id} className="event-chip">
                                    {app.title}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;
