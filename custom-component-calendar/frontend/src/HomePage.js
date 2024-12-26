import React, { useState } from 'react';
import AirbnbStyleCalendar from './components/AirbnbStyleCalendar';

const HomePage = () => {
    const [selectedDates, setSelectedDates] = useState(null); // State to store check-in and check-out dates

    const bookedDates = [
        new Date(2025, 1, 15), // February 15, 2025
        new Date(2025, 1, 16), // February 16, 2025
        new Date(2025, 2, 5),  // March 5, 2025
    ];

    // Function to handle submitted dates from AirbnbStyleCalendar
    const handleCalendarSubmit = ({ checkIn, checkOut }) => {
        setSelectedDates({ checkIn, checkOut }); // Store the submitted dates
    };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            
            {/* Display the selected dates */}
            {selectedDates && (
                <div>
                    <h2>Selected Dates:</h2>
                    <p>Check-In: {selectedDates.checkIn.toDateString()}</p>
                    <p>Check-Out: {selectedDates.checkOut.toDateString()}</p>
                </div>
            )}

            {/* Render the AirbnbStyleCalendar with the onSubmit callback */}
            <AirbnbStyleCalendar 
                bookedDates={bookedDates} 
                onSubmit={handleCalendarSubmit} 
            />
        </div>
    );
};

export default HomePage;
