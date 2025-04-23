import React, { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://server-deploy-aq8t.onrender.com"); // Adjust if deployed elsewhere

const PresentationsClient = () => {
  const [presentations, setPresentations] = useState([]);

  const fetchPresentations = async () => {
    const res = await API.get("/presentations");
    setPresentations(res.data);
  };

  useEffect(() => {
    fetchPresentations();

    socket.on("presentationCreated", (newPresentation) => {
      setPresentations((prev) => [...prev, newPresentation]);
    });

    socket.on("presentationUpdated", (updated) => {
      setPresentations((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    });

    socket.on("presentationDeleted", (deletedId) => {
      setPresentations((prev) => prev.filter((p) => p._id !== deletedId));
    });

    return () => {
      socket.off("presentationCreated");
      socket.off("presentationUpdated");
      socket.off("presentationDeleted");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Présentations</h1>

      <div style={styles.list}>
        {presentations.map((p) => (
          <div key={p._id} style={styles.card}>
            <img
              src={p.image ? `https://server-deploy-aq8t.onrender.com${p.image}` : "/images/placeholder.png"}
              alt="presentation"
              style={styles.image}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />
            <div style={styles.details}>
              <h3>{p.title}</h3>
              <p>{p.content}</p>
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
    gap: "20px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "16px",
    backdropFilter: "blur(6px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
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

export default PresentationsClient;
