import React, { useEffect, useState } from "react";
import API from "../services/api";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) form.append(key, formData[key]);

    if (editId) {
      await API.put(`/events/${editId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await API.post("/events", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setFormData({ title: "", description: "", date: "", location: "", price: "", image: null });
    setEditId(null);
    setShowForm(false);
    fetchEvents();
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      price: event.price,
      image: null,
    });
    setEditId(event._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await API.delete(`/events/${id}`);
      fetchEvents();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 Événements</h1>

      <button style={styles.createButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? "❌ Fermer le formulaire" : "➕ Créer un événement"}
      </button>

      {showForm && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>📝 {editId ? "Modifier l'événement" : "Créer un événement"}</h2>
        <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} style={styles.input} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={styles.input} />
        <input name="date" type="date" value={formData.date} onChange={handleChange} style={styles.input} required />
        <input name="location" placeholder="Lieu" value={formData.location} onChange={handleChange} style={styles.input} />
        <input name="price" type="number" placeholder="Prix" value={formData.price} onChange={handleChange} style={styles.input} />
        <input name="image" type="file" accept="image/*" onChange={handleChange} style={styles.input} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button type="submit" style={styles.button}>
            {editId ? "✅ Modifier" : "✅ Créer"}
          </button>
          <button type="button" style={{ ...styles.button, background: "#888" }} onClick={() => { setShowForm(false); setEditId(null); }}>
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <div style={styles.list}>
        {events.map((event) => (
          <div key={event._id} style={styles.card}>
<img
src={event.image ? event.image : "/images/placeholder.png"}
alt="event"
  style={styles.image}
  onError={(e) => (e.target.src = "/images/placeholder.png")}
/>

            <div style={styles.details}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Lieu :</strong> {event.location}</p>
              <p><strong>Prix :</strong> {event.price} TND</p>
            </div>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(event)}>✏️</button>
              <button onClick={() => handleDelete(event._id)}>🗑️</button>
            </div>
          </div>
        ))}
        <button style={styles.createButton} onClick={() => setShowForm(true)}>
  ➕ Créer un événement
</button>

      </div>

      <style>{`
        * { font-family: 'Inter', sans-serif; }
        button:hover { opacity: 0.9; cursor: pointer; }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: "url('../../public/images/background_dashboard.jpg')",
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
  createButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "16px 20px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "#00c3ff",
    color: "#fff",
    border: "none",
    zIndex: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },
  
  form: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backdropFilter: "blur(8px)",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    border: "none",
  },
  button: {
    padding: "12px",
    background: "#ff69b4",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
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
    alignItems: "center", // vertically center image + text
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
  actions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    gap: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "30px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
  },
  
};

export default EventsPage;
