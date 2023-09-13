

// export default MyCalendar;
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

function MyCalendar() {
  return (
    <FullCalendar
    style={{ width: '80%', maxWidth: '600px', margin: '0 auto' }}
      plugins={[interactionPlugin, dayGridPlugin]}

      editable={true}
      events={[
        { title: 'Meeting', start: new Date() },
      ]}
    />
  );
}

export default MyCalendar;