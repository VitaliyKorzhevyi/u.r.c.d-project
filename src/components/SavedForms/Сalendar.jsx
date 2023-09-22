//todo зробити валыдацыю на 30 днів тільки

import { useState } from 'react';
import DatePicker from "react-datepicker";
import { uk } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

import "./Calendar.css";

function DatepickerComponent({ onDateChange }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const onChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      
      if (start) {
          const formattedStart = formatDate(start);
          console.log("Formatted start date in Child:", formattedStart);
          if (onDateChange && end) {
              const formattedEnd = formatDate(end);
              console.log("Formatted end date in Child:", formattedEnd);
              onDateChange(formattedStart, formattedEnd);
          }
      }
    };
    
    return (
        <DatePicker
          selected={startDate}
          onChange={onChange}
          locale={uk}
          dateFormat="P"
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          selectsRange
          inline
        />
    );
}

export default DatepickerComponent;




