import React, { useState } from 'react';
import './AirbnbStyleCalendar.css';

const AirbnbStyleCalendar = ({ bookedDates, onSubmit }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedButton, setSelectedButton] = useState('checkIn');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate an array of Date objects for a given month/year
  const generateDates = (monthIndex, year) => {
    const dates = [];
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      dates.push(new Date(year, monthIndex, day));
    }
    return dates;
  };

  // Return two consecutive months of data
  const getTwoMonths = () => {
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    const firstMonthDates = generateDates(monthIndex, year);
    const secondMonthIndex = (monthIndex + 1) % 12;
    const secondMonthYear = monthIndex === 11 ? year + 1 : year;
    const secondMonthDates = generateDates(secondMonthIndex, secondMonthYear);

    return [
      { month: monthIndex, year, dates: firstMonthDates },
      { month: secondMonthIndex, year: secondMonthYear, dates: secondMonthDates },
    ];
  };

  // Move to previous/next month
  const navigateMonth = (direction) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  // Check if date is in bookedDates
  const isBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  // Disabled logic
  const isDisabled = (date) => {
    if (selectedButton === 'checkIn') {
      // If a check-out date is already picked, don't allow picking a check-in after it
      //if (checkOutDate && date > checkOutDate) return true;
    } else if (selectedButton === 'checkOut') {
      // If no check-in date chosen yet, can't pick check-out
      if (!checkInDate) return true;
      // If date < checkInDate, can't pick it as check-out
      if (date < checkInDate) return true;
      if (
        bookedDates.some(
          (b) => b >= checkInDate && b <= date
        )
      ) {
        return true;
      }
    }
    return isBooked(date);
  };

  // Preview range while hovering
  const isInRangePreview = (date) => {
    if (checkInDate && hoveredDate && selectedButton === 'checkOut') {
      if (hoveredDate >= checkInDate) {
        return date >= checkInDate && date <= hoveredDate;
      }
    }
    return false;
  };

  // Final chosen range
  const isInRange = (date) => {
    if (checkInDate && checkOutDate) {
      return date >= checkInDate && date <= checkOutDate;
    }
    return false;
  };

  // Handle day click
  const handleDateClick = (date) => {
    if (selectedButton === 'checkIn') {
        if (checkInDate && checkOutDate && date > checkOutDate) {
            // Already have a full range chosen; picking a new checkIn
            setCheckInDate(date);
            setCheckOutDate(null);
            setSelectedButton('checkOut');
          } else {
            // Normal checkIn picking
            setCheckInDate(date);
            //setCheckOutDate(null);
            setSelectedButton('checkOut');
          }
    } else {
      // 'checkOut'
      if (checkInDate && date >= checkInDate) {
        setCheckOutDate(date);
        setSelectedButton('checkIn');
      }
    }
  };

  const handleButtonClick = (type) => {
    setSelectedButton(type);
  };

  // Hover logic
  const handleMouseEnter = (date) => {
    if (selectedButton === 'checkOut' && checkInDate) {
      setHoveredDate(date);
    }
  };
  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  // Example "submit"
  const handleSubmit = () => {
    if (!checkInDate || !checkOutDate) {
        alert('Please select both check-in and check-out dates.');
    } else {
        onSubmit({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            });        
        // alert(
        //     `Check-In: ${checkInDate.toDateString()}\nCheck-Out: ${checkOutDate.toDateString()}`
        // );
    }
  };

  const [firstMonth, secondMonth] = getTwoMonths();

  /**
   * canBridgeRight:
   * Decide if we should draw a bridging bar from 'date' to 'nextDate'.
   * We'll only do it if:
   *   1) Both days are in final or preview range
   *   2) 'date' is NOT the actual checkOut day
   *   3) They are consecutive days in time
   *   4) We are not at the "end" of a row in the grid (where bridging would cross to the next row)
   */
  const canBridgeRight = (date, nextDate, idx) => {
    if (!nextDate) return false;

    // If current day is specifically the checkOut day, skip bridging.
    if (checkOutDate && date.toDateString() === checkOutDate.toDateString()) {
      return false;
    }

    // Are both days in the final or preview range?
    const thisInRange = isInRange(date) || isInRangePreview(date);
    const nextInRange = isInRange(nextDate) || isInRangePreview(nextDate);

    if (!thisInRange || !nextInRange) return false;

    // Must be exactly one day apart in time
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (nextDate.getTime() - date.getTime() !== oneDayMs) {
      return false;
    }

    // If it's the last column in the row, skip bridging to the next
    // because that would "wrap" across a week row
    if ((idx + 1) % 7 === 0) {
      return false;
    }

    return true;
  };

  // Render a single month
  const renderCalendar = (monthData) => (
    <div className="calendar-month">
      <h3>
        {monthData.month + 1} / {monthData.year}
      </h3>
      <div className="calendar-grid">
        {monthData.dates.map((date, idx, allDates) => {
          const booked = isBooked(date);
          const disabled = isDisabled(date);

          const isRangeStart =
            checkInDate && date.toDateString() === checkInDate.toDateString();
          const isRangeEnd =
            checkOutDate && date.toDateString() === checkOutDate.toDateString();

          const inPreview = isInRangePreview(date);
          const inRangeFinal = isInRange(date);
          const inRangeOrPreview = inRangeFinal || inPreview;

          const nextDate = allDates[idx + 1];
          const bridge = canBridgeRight(date, nextDate, idx);

          let dayClass = 'calendar-day';
          if (booked) dayClass += ' booked';
          if (disabled) dayClass += ' disabled';
          if (inRangeOrPreview) dayClass += ' range';
          if (isRangeStart) dayClass += ' range-start';
          if (isRangeEnd) dayClass += ' range-end';

          // If we cannot bridge, but the day is in the range, mark it end-of-row
          if (inRangeOrPreview && !bridge) {
            dayClass += ' end-of-row';
          }

          // Optional: lighter circle for hover preview
          if (inPreview && !inRangeFinal) {
            dayClass += ' range-preview';
          }

          return (
            <div
              key={date.toDateString()}
              className={dayClass}
              onClick={() => {
                if (!disabled) handleDateClick(date);
              }}
              onMouseEnter={() => handleMouseEnter(date)}
              onMouseLeave={handleMouseLeave}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="airbnb-style-calendar">
      <div className="calendar-buttons">
        <button
          className={selectedButton === 'checkIn' ? 'active' : ''}
          onClick={() => handleButtonClick('checkIn')}
        >
          Select Check-In
        </button>
        <button
          className={selectedButton === 'checkOut' ? 'active' : ''}
          onClick={() => handleButtonClick('checkOut')}
        >
          Select Check-Out
        </button>
      </div>

      <div className="selected-dates">
        <p>Check-In Date: {checkInDate ? checkInDate.toDateString() : 'Not selected'}</p>
        <p>Check-Out Date: {checkOutDate ? checkOutDate.toDateString() : 'Not selected'}</p>
      </div>

      <div className="calendar-navigation">
        <button onClick={() => navigateMonth(-1)}>&lt;</button>
        <button onClick={() => navigateMonth(1)}>&gt;</button>
      </div>

      <div className="calendar-container">
        {renderCalendar(firstMonth)}
        {renderCalendar(secondMonth)}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AirbnbStyleCalendar;
