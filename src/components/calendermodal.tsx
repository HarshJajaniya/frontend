"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://meetmom-backend.onrender.com"
    : "http://localhost:8000");
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/meetings`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const safeMeetings = Array.isArray(data) ? data : [];
        const formatted = safeMeetings.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.title,
          start: meeting.startTime,
          end: meeting.endTime,
          url: meeting.meetLink,
        }));

        setEvents(formatted);
      })
      .catch(() => {
        setEvents([]);
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