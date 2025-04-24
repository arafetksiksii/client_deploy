import React, { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://server-deploy-aq8t.onrender.com"); // adjust if hosted elsewhere

const BoissonsClient = () => {
  const [boissons, setBoissons] = useState([]);

  const fetchBoissons = async () => {
    const res = await API.get("/boissons");
    setBoissons(res.data);
  };

  useEffect(() => {
    fetchBoissons();

    socket.on("boissonCreated", (newBoisson) => {
      setBoissons((prev) => [...prev, newBoisson]);
    });

    socket.on("boissonUpdated", (updatedBoisson) => {
      setBoissons((prev) =>
        prev.map((b) => (b._id === updatedBoisson._id ? updatedBoisson : b))
      );
    });

    socket.on("boissonDeleted", (deletedId) => {
      setBoissons((prev) => prev.filter((b) => b._id !== deletedId));
    });

    return () => {
      socket.off("boissonCreated");
      socket.off("boissonUpdated");
      socket.off("boissonDeleted");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🥤 Boissons</h1>

      <div style={styles.list}>
        {boissons.map((boisson) => (
          <div key={boisson._id} style={styles.card}>
            <img
             src={boisson.image ? boisson.image : "/images/placeholder.png"}

              alt="boisson"
              style={styles.image}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />
            <div style={styles.details}>
              <h3>{boisson.title}</h3>
              <p>
                <strong>Prix:</strong> {boisson.price} TND
              </p>
              <p>
                <strong>Quantité:</strong> {boisson.quantity}
              </p>
              <p>{boisson.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`* { font-family: 'Inter', sans-serif; }`}</style>
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

export default BoissonsClient;
