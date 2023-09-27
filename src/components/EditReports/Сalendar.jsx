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

    uk.localize.month = function (monthIndex, { width = 'abbreviated' } = {}) {
        const monthNames = {
            narrow: ['С', 'Л', 'Б', 'К', 'Т', 'Ч', 'Л', 'С', 'В', 'Ж', 'Л', 'Г'],
            abbreviated: [
                'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
                'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
            ],
            wide: [
                'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
                'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
            ]
        };
    
        return monthNames[width][monthIndex];
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
          showYearDropdown
          dateFormatCalendar="MMMM"
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          selectsRange
          inline
        />
    );
}

export default DatepickerComponent;




