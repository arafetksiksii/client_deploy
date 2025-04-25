"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import QRCode from "qrcode"
import "./Dashboard.css" // Import the CSS file

const Dashboard = () => {
  const navigate = useNavigate()
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [showQrDialog, setShowQrDialog] = useState(false)
  const [user, setUser] = useState({ username: "", email: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
    }

    const userData = JSON.parse(localStorage.getItem("user") || '{"username":"User","email":"user@example.com"}')
    setUser(userData)

    return () => clearTimeout(timer)
  }, [navigate])

  const sections = [
    {
      icon: "📅",
      title: "Événements",
      description: "Gérez vos événements et planifications",
      path: "/events",
      colorClass: "card-events",
      badge: "3 nouveaux",
    },
    {
      icon: "📋",
      title: "Menus",
      description: "Créez et modifiez vos menus",
      path: "/menus",
      colorClass: "card-menus",
    },
    {
      icon: "🥤",
      title: "Boissons",
      description: "Gérez votre carte des boissons",
      path: "/boissons",
      colorClass: "card-boissons",
    },
    {
      icon: "🧾",
      title: "Présentations",
      description: "Créez des présentations attrayantes",
      path: "/presentations",
      colorClass: "card-presentations",
      badge: "Nouveau",
    },
    {
      icon: "🎁",
      title: "Offres Spéciales",
      description: "Gérez vos promotions et offres",
      path: "/offres",
      colorClass: "card-offres",
    },
    {
      icon: "📊",
      title: "Statistiques",
      description: "Analysez vos performances",
      path: "/stats",
      colorClass: "card-stats",
    },
  ]

  const generateQR = async () => {
    try {
      setIsLoading(true)
      const qrData = "https://itbafa.com/Menu/Home"
      const url = await QRCode.toDataURL(qrData)
      setQrCodeUrl(url)
      setShowQrDialog(true)
      setIsLoading(false)

      // Simple alert instead of toast
      alert("QR Code généré avec succès")
    } catch (err) {
      console.error("Error generating QR code:", err)
      alert("Impossible de générer le QR code")
      setIsLoading(false)
    }
  }

  const downloadQrCode = () => {
    const a = document.createElement("a")
    a.href = qrCodeUrl
    a.download = "qr_presentation.png"
    a.click()

    // Simple alert instead of toast
    alert("QR Code téléchargé avec succès")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Background overlay with blur effect */}
      <div className="background-overlay" style={{ backgroundImage: `url('https://itbafa.com/Menu/images/background_dashboard.jpg')` }}></div>

      {/* Content container */}
      <div className="content-container">
        {/* Header with user profile */}
        <div className="header">
          <div className="header-title">
  <span className="logo-icon">
  <img src="/Menu/images/logo_it_bafa.png" alt="IT Bafa Logo" className="logo" />
</span> 


          </div>

          <div className="header-actions">
            {/* Notification button */}
            <button className="icon-button" onClick={() => alert("Notifications")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Settings button */}
            <button className="icon-button" onClick={() => alert("Paramètres")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* User dropdown */}
            <div className="user-dropdown">
              <button className="user-button">
                <div className="user-avatar">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="avatar-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="user-info">
                  <p className="user-name">{user.username}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </button>

              {/* Dropdown menu */}
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item" onClick={() => navigate("/profile")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="dropdown-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mon profil
                </a>
                <a href="#" className="dropdown-item" onClick={() => navigate("/settings")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="dropdown-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Paramètres
                </a>
                <a href="#" className="dropdown-item" onClick={generateQR}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="dropdown-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  Générer QR Code
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item logout" onClick={handleLogout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="dropdown-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Déconnexion
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="stats-grid">
          {[
            { label: "Événements", value: "12", icon: "📅" },
            { label: "Présentations", value: "8", icon: "🧾" },
            { label: "Vues", value: "1.2k", icon: "👁️" },
            { label: "Téléchargements", value: "384", icon: "📥" },
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content - Section cards */}
        <h2 className="section-title">Vos services</h2>
        <div className="services-grid">
          {sections.map((section, index) => (
            <div key={index} className={`service-card ${section.colorClass}`} onClick={() => navigate(section.path)}>
              <div className="service-content">
                <div className="service-header">
                  <div className="service-icon">{section.icon}</div>
                  <div className="service-title-container">
                    <h3 className="service-title">{section.title}</h3>
                    {section.badge && <span className="service-badge">{section.badge}</span>}
                  </div>
                </div>

                <p className="service-description">{section.description}</p>

                <div className="service-footer">
                  <span className="service-access">Accéder</span>
                  <div className="service-arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="arrow-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <h2 className="section-title activity-title">Activité récente</h2>
        <div className="activity-card">
          <div className="activity-list">
            {[
              { text: "Vous avez créé une nouvelle présentation", time: "Il y a 2 heures", icon: "🧾" },
              { text: "Vous avez modifié le menu 'Été 2023'", time: "Hier", icon: "📋" },
              { text: "Vous avez généré un QR code", time: "Il y a 2 jours", icon: "📱" },
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-info">
                  <p className="activity-text">{activity.text}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating QR Code Button */}
        <button onClick={generateQR} className="qr-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="qr-button-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          Générer un QR Code
        </button>
      </div>

      {/* QR Code Dialog */}
      {showQrDialog && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">QR Code généré</h3>
              <p className="modal-subtitle">Scannez ce QR code pour accéder à votre présentation.</p>
            </div>
            <div className="qr-container">
              {qrCodeUrl && <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="qr-image" />}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowQrDialog(false)} className="modal-button cancel-button">
                Fermer
              </button>
              <button onClick={downloadQrCode} className="modal-button download-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="download-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
