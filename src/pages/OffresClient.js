import React, { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://server-deploy-aq8t.onrender.com");

const OffresClient = () => {
  const [offres, setOffres] = useState([]);

  const fetchOffres = async () => {
    const res = await API.get("/offres");
    setOffres(res.data);
  };

  useEffect(() => {
    fetchOffres();

    socket.on("offreCreated", (newOffre) => {
      setOffres((prev) => [...prev, newOffre]);
    });

    socket.on("offreUpdated", (updatedOffre) => {
      setOffres((prev) =>
        prev.map((o) => (o._id === updatedOffre._id ? updatedOffre : o))
      );
    });

    socket.on("offreDeleted", (deletedId) => {
      setOffres((prev) => prev.filter((o) => o._id !== deletedId));
    });

    return () => {
      socket.off("offreCreated");
      socket.off("offreUpdated");
      socket.off("offreDeleted");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎁 Offres Spéciales</h1>

      <div style={styles.list}>
        {offres.map((offre) => (
          <div key={offre._id} style={styles.card}>
            <div style={styles.details}>
              <h3>{offre.title}</h3>
              <p>{offre.description}</p>
              <p><strong>Remise :</strong> {offre.discountPercentage}%</p>
              <p><strong>Du :</strong> {new Date(offre.startDate).toLocaleDateString()}</p>
              <p><strong>Au :</strong> {new Date(offre.endDate).toLocaleDateString()}</p>
              <p><strong>Statut :</strong> {offre.active ? "🟢 Active" : "🔴 Inactive"}</p>
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
    background: "rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    backdropFilter: "blur(6px)",
  },
  details: {
    color: "#fff",
  },
};

export default OffresClient;
