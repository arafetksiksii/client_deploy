import React, { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("https://server-deploy-aq8t.onrender.com"); // adjust if hosted elsewhere

const MenusClient = () => {
  const [menus, setMenus] = useState([]);

  const fetchMenus = async () => {
    const res = await API.get("/menus");
    setMenus(res.data);
  };

  useEffect(() => {
    fetchMenus();

    socket.on("menuCreated", (newMenu) => {
      setMenus((prev) => [...prev, newMenu]);
    });

    socket.on("menuUpdated", (updatedMenu) => {
      setMenus((prev) =>
        prev.map((menu) => (menu._id === updatedMenu._id ? updatedMenu : menu))
      );
    });

    socket.on("menuDeleted", (deletedMenuId) => {
      setMenus((prev) => prev.filter((menu) => menu._id !== deletedMenuId));
    });

    return () => {
      socket.off("menuCreated");
      socket.off("menuUpdated");
      socket.off("menuDeleted");
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Menus</h1>

      <div style={styles.list}>
        {menus.map((menu) => (
          <div key={menu._id} style={styles.card}>
            <img
              src={menu.image ? `https://server-deploy-aq8t.onrender.com${menu.image}` : "/images/placeholder.png"}
              alt="menu"
              style={styles.image}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />
            <div style={styles.details}>
              <h3>{menu.title}</h3>
              {menu.items.map((item, i) => (
                <p key={i}>
                  <strong>{item.name}</strong> – {item.price} TND<br />
                  <span style={{ opacity: 0.8 }}>{item.description}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }
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

export default MenusClient;
