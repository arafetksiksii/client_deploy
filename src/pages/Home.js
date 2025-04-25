"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    setIsLoaded(true)
  }, [])

  const sections = [
    {
      icon: "📅",
      title: "Événements",
      description: "Découvrez et participez à nos événements exclusifs",
      path: "/events-client",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
      delay: 0.1,
    },
    {
      icon: "📋",
      title: "Menus",
      description: "Explorez notre sélection de menus raffinés",
      path: "/menus-client",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      delay: 0.2,
    },
    {
      icon: "🥤",
      title: "Boissons",
      description: "Une carte de boissons pour tous les goûts",
      path: "/boissons-client",
      gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
      delay: 0.3,
    },
    {
      icon: "🧾",
      title: "Présentations",
      description: "Nos présentations exclusives et personnalisées",
      path: "/presentations-client",
      gradient: "linear-gradient(135deg, #D946EF 0%, #A21CAF 100%)",
      delay: 0.4,
    },
    {
      icon: "🎁",
      title: "Offres Spéciales",
      description: "Découvrez nos promotions et offres limitées",
      path: "/offres-client",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      delay: 0.5,
    },
  ]

  const handleMouseEnter = (index) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="home-container">
      {/* Overlay avec effet de parallaxe */}
      <div className="parallax-overlay"></div>

      {/* Header avec navigation */}
      <header className="home-header">
        <div className="logo">
        <span className="logo-icon">
  <img src="/Menu/images/logo_it_bafa.png" alt="IT Bafa Logo" className="logo" />
</span>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link active">
            Accueil
          </a>
          <a href="#" className="nav-link">
            À propos
          </a>
          <a href="#" className="nav-link">
            Services
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </nav>
        <div className="auth-buttons">
          <button className="login-btn">Connexion</button>
          <button className="signup-btn">Inscription</button>
        </div>
      </header>

      {/* Hero section */}
      <section className={`hero-section ${isLoaded ? "loaded" : ""}`}>
        <h1 className="hero-title">
       
          <span>Bienvenue sur IT BAFA</span>
        </h1>
        <p className="hero-subtitle">Découvrez notre plateforme de gestion d'événements et de services</p>
        <div className="hero-cta">
          <button className="cta-button primary" onClick={() => navigate("/events-client")}>
            Explorer les événements
          </button>
          <button className="cta-button secondary">En savoir plus</button>
        </div>
      </section>

      {/* Section des services */}
      <section className="services-section">
        <h2 className="section-title">Nos Services</h2>
        <p className="section-subtitle">Découvrez tout ce que nous avons à vous offrir</p>

        <div className="services-grid">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`service-card ${activeIndex === index ? "active" : ""} ${isLoaded ? "loaded" : ""}`}
              style={{
                background: section.gradient,
                animationDelay: `${section.delay}s`,
              }}
              onClick={() => navigate(section.path)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-content">
                <div className="icon-circle">
                  <span className="service-icon">{section.icon}</span>
                </div>
                <div className="text-content">
                  <h3 className="service-title">{section.title}</h3>
                  <p className="service-description">{section.description}</p>
                </div>
                <div className="card-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="card-overlay"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Section des fonctionnalités */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Pourquoi choisir IT BAFA ?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Rapide et Efficace</h3>
              <p className="feature-description">Gestion simplifiée de tous vos services en un seul endroit</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Sécurisé</h3>
              <p className="feature-description">Protection de vos données avec les dernières technologies</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Responsive</h3>
              <p className="feature-description">Accessible sur tous vos appareils, où que vous soyez</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Mises à jour régulières</h3>
              <p className="feature-description">Nouvelles fonctionnalités et améliorations constantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Prêt à commencer ?</h2>
          <p className="cta-description">Rejoignez-nous dès aujourd'hui et découvrez toutes nos fonctionnalités</p>
          <button className="cta-button primary">S'inscrire maintenant</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🌟</span>
            <span className="logo-text">IT BAFA</span>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-list">
                <li>
                  <a href="#">Événements</a>
                </li>
                <li>
                  <a href="#">Menus</a>
                </li>
                <li>
                  <a href="#">Boissons</a>
                </li>
                <li>
                  <a href="#">Présentations</a>
                </li>
                <li>
                  <a href="#">Offres Spéciales</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">À propos</h4>
              <ul className="footer-list">
                <li>
                  <a href="#">Notre équipe</a>
                </li>
                <li>
                  <a href="#">Histoire</a>
                </li>
                <li>
                  <a href="#">Carrières</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-list">
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Aide</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Légal</h4>
              <ul className="footer-list">
                <li>
                  <a href="#">Conditions d'utilisation</a>
                </li>
                <li>
                  <a href="#">Politique de confidentialité</a>
                </li>
                <li>
                  <a href="#">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} IT BAFA. Tous droits réservés.</p>
          <div className="social-links">
            <a href="#" className="social-link">
              Facebook
            </a>
            <a href="#" className="social-link">
              Twitter
            </a>
            <a href="#" className="social-link">
              Instagram
            </a>
            <a href="#" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
