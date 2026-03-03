"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/meetings", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.title,
          start: meeting.startTime,
          end: meeting.endTime,
          url: meeting.meetLink,
        }));

        setEvents(formatted);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={(info) => {
          if (info.event.url) {
            window.open(info.event.url, "_blank");
            info.jsEvent.preventDefault();
          }
        }}
        height="auto"
      />
    </div>
  );
}