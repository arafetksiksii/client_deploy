"use client"

import { useState, useEffect } from "react"
import API from "../services/api"
import "./OffresPage.css"

const OffresPage = () => {
  const [offres, setOffres] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date") // date, discount, title
  const [filterActive, setFilterActive] = useState("all") // all, active, inactive
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    active: true,
  })
  const [editId, setEditId] = useState(null)

  const fetchOffres = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/offres")
      setOffres(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error)
      alert("Impossible de charger les offres")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOffres()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = { ...formData }

      if (editId) {
        await API.put(`/offres/${editId}`, data)
        alert("Offre modifiée avec succès")
      } else {
        await API.post("/offres", data)
        alert("Offre créée avec succès")
      }

      resetForm()
      fetchOffres()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercentage: "",
      startDate: "",
      endDate: "",
      active: true,
    })
    setEditId(null)
    setShowForm(false)
    setIsLoading(false)
  }

  const handleEdit = (offre) => {
    setFormData({
      title: offre.title,
      description: offre.description || "",
      discountPercentage: offre.discountPercentage,
      startDate: offre.startDate.split("T")[0],
      endDate: offre.endDate.split("T")[0],
      active: offre.active,
    })
    setEditId(offre._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
        setIsLoading(true)
        await API.delete(`/offres/${id}`)
        alert("Offre supprimée avec succès")
        fetchOffres()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Échec de la suppression")
      setIsLoading(false)
    }
  }

  // Filtrer et trier les offres
  const filteredAndSortedOffres = offres
    .filter((offre) => {
      // Filtre par recherche
      const matchesSearch =
        offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtre par statut
      const matchesStatus =
        filterActive === "all" ||
        (filterActive === "active" && offre.active) ||
        (filterActive === "inactive" && !offre.active)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Tri
      if (sortBy === "date") {
        return new Date(b.startDate) - new Date(a.startDate)
      } else if (sortBy === "discount") {
        return b.discountPercentage - a.discountPercentage
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  // Vérifier si une offre est expirée
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  // Vérifier si une offre est à venir
  const isUpcoming = (startDate) => {
    return new Date(startDate) > new Date()
  }

  // Obtenir le statut d'une offre
  const getOfferStatus = (offre) => {
    if (!offre.active) return { label: "Inactive", color: "var(--color-inactive)" }
    if (isExpired(offre.endDate)) return { label: "Expirée", color: "var(--color-expired)" }
    if (isUpcoming(offre.startDate)) return { label: "À venir", color: "var(--color-upcoming)" }
    return { label: "Active", color: "var(--color-active)" }
  }

  return (
    <div className="offres-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="emoji">🎁</span> Offres Spéciales
        </h1>

        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-sort-container">
            <select className="filter-select" value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>

            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Trier par date</option>
              <option value="discount">Trier par remise</option>
              <option value="title">Trier par titre</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form-title">{editId ? "Modifier" : "Créer"} une offre spéciale</h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Titre
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Titre de l'offre"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description de l'offre"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discountPercentage" className="form-label">
                  Pourcentage de remise
                </label>
                <input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="% de remise"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Date de début
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    Date de fin
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span>Offre active</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Chargement..." : editId ? "✅ Modifier" : "✅ Créer"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={isLoading}>
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && !showForm ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des offres...</p>
        </div>
      ) : (
        <>
          {filteredAndSortedOffres.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎁</div>
              <h3>Aucune offre trouvée</h3>
              <p>Commencez par créer une nouvelle offre spéciale</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Créer une offre
              </button>
            </div>
          ) : (
            <div className="offres-grid">
              {filteredAndSortedOffres.map((offre) => {
                const status = getOfferStatus(offre)
                return (
                  <div key={offre._id} className="offre-card">
                    <div className="card-header">
                      <h3 className="card-title">{offre.title}</h3>
                      <div className="status-badge" style={{ backgroundColor: status.color }}>
                        {status.label}
                      </div>
                    </div>

                    <div className="discount-badge">-{offre.discountPercentage}%</div>

                    <div className="card-content">
                      <p className="card-description">{offre.description || "Aucune description"}</p>

                      <div className="date-container">
                        <div className="date-item">
                          <span className="date-label">Début:</span>
                          <span className="date-value">{new Date(offre.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Fin:</span>
                          <span className="date-value">{new Date(offre.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(offre)} aria-label="Modifier">
                        <span className="btn-icon">✏️</span>
                        <span className="btn-text">Modifier</span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(offre._id)}
                        aria-label="Supprimer"
                      >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-text">Supprimer</span>
                      </button>
                    </div>

                    {/* Nouveau bouton Modifier plus visible */}
                    <button
                      className="modify-button"
                      onClick={() => handleEdit(offre)}
                      aria-label="Modifier cette offre"
                    >
                      Modifier
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <button className="floating-action-btn" onClick={() => setShowForm(true)} aria-label="Créer une offre">
        <span className="btn-icon">➕</span>
        <span className="btn-text">Créer une offre</span>
      </button>
    </div>
  )
}

export default OffresPage
