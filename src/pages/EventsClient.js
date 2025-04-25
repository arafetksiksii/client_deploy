import React, { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://server-deploy-aq8t.onrender.com"); // Adjust if your server runs elsewhere

const EventsClient = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();

    // 🔵 Listen for created events
    socket.on("eventCreated", (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
    });

    // 🟢 Listen for updated events
    socket.on("eventUpdated", (updatedEvent) => {
      setEvents((prev) =>
        prev.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
      );
    });

    // 🔴 Listen for deleted events
    socket.on("eventDeleted", (deletedEventId) => {
      setEvents((prev) => prev.filter((event) => event._id !== deletedEventId));
    });

    // ✅ Cleanup when component unmounts
    return () => {
      socket.off("eventCreated");
      socket.off("eventUpdated");
      socket.off("eventDeleted");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Événements</h1>

      <div style={styles.list}>
        {events.map((event) => (
          <div key={event._id} style={styles.card}>
            <img
src={event.image ? event.image : "/Menu/images/placeholder.png"}
alt="event"
              style={styles.image}
              onError={(e) => (e.target.src = "/Menu/images/placeholder.png")}
            />
            <div style={styles.details}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Lieu :</strong> {event.location}</p>
              <p><strong>Prix :</strong> {event.price} TND</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: "url('https://itbafa.com/Menu/images/background_dashboard.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "60px 20px",
    color: "#fff",
  },
  title: {
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "20px",
    textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "16px",
    backdropFilter: "blur(6px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    gap: "20px",
  },
  image: {
    width: "140px",
    height: "140px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  details: {
    flex: 1,
  },
};

export default EventsClient;
