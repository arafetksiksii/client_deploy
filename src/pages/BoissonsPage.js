"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./BoissonsPage.css"

const BoissonsPage = () => {
  const [boissons, setBoissons] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  })
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid") // grid, list

  const fetchBoissons = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/boissons")
      setBoissons(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des boissons:", error)
      alert("Impossible de charger les boissons")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoissons()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      if (files && files[0]) {
        setFormData((prev) => ({ ...prev, image: files[0] }))

        // Create preview URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(files[0])
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      for (const key in formData) {
        form.append(key, formData[key])
      }

      if (editId) {
        await API.put(`/boissons/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Boisson modifiée avec succès")
      } else {
        await API.post("/boissons", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Boisson créée avec succès")
      }

      resetForm()
      fetchBoissons()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", price: "", quantity: "", description: "", image: null })
    setEditId(null)
    setShowForm(false)
    setPreviewImage(null)
    setIsLoading(false)
  }

  const handleEdit = (boisson) => {
    setFormData({
      title: boisson.title,
      price: boisson.price,
      quantity: boisson.quantity,
      description: boisson.description || "",
      image: null,
    })
    setEditId(boisson._id)
    setShowForm(true)

    // Set preview image if available
    if (boisson.image) {
      setPreviewImage(boisson.image);
    } else {
      setPreviewImage(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette boisson ?")) {
        setIsLoading(true)
        await API.delete(`/boissons/${id}`)
        alert("Boisson supprimée avec succès")
        fetchBoissons()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Échec de la suppression")
      setIsLoading(false)
    }
  }

  const filteredBoissons = boissons
    .filter(
      (b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
      } else if (sortOrder === "price-high") {
        return Number.parseFloat(b.price) - Number.parseFloat(a.price)
      } else if (sortOrder === "price-low") {
        return Number.parseFloat(a.price) - Number.parseFloat(b.price)
      }
      return 0
    })

  return (
    <div className="boissons-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="emoji">🥤</span> Boissons
        </h1>

        <div className="search-sort-container">
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

          <div className="view-sort-container">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Vue en grille"
              >
                <span className="view-icon">▦</span>
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="Vue en liste"
              >
                <span className="view-icon">☰</span>
              </button>
            </div>

            <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="alphabetical">Alphabétique</option>
              <option value="price-high">Prix décroissant</option>
              <option value="price-low">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form-title">{editId ? "Modifier" : "Créer"} une boisson</h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Nom
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Nom de la boisson"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Prix
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Prix"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">
                    Quantité
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Quantité"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description de la boisson"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Image
                </label>
                <div className="image-upload-container">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="form-file-input"
                  />
                  {previewImage && (
                    <div className="image-preview-container">
                      <img src={previewImage || "/images/placeholder.png"} alt="Aperçu" className="image-preview" />
                      <button
                        type="button"
                        className="remove-preview-btn"
                        onClick={() => {
                          setPreviewImage(null)
                          setFormData((prev) => ({ ...prev, image: null }))
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
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
          <p>Chargement des boissons...</p>
        </div>
      ) : (
        <>
          {filteredBoissons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🥤</div>
              <h3>Aucune boisson trouvée</h3>
              <p>Commencez par créer une nouvelle boisson</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Créer une boisson
              </button>
            </div>
          ) : (
            <div className={`boissons-container ${viewMode === "list" ? "list-view" : "grid-view"}`}>
              {filteredBoissons.map((boisson) => (
                <div key={boisson._id} className="boisson-card">
                  <div className="card-image-container">
                    <img
src={boisson.image ? boisson.image : "/images/placeholder.png"}
alt={boisson.title}
                      className="card-image"
                      onError={(e) => (e.target.src = "/images/placeholder.png")}
                    />
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => handleEdit(boisson)}
                        aria-label="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => handleDelete(boisson._id)}
                        aria-label="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="price-badge">{boisson.price} TND</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{boisson.title}</h3>
                    <div className="card-details">
                      <span className="card-quantity">Quantité: {boisson.quantity}</span>
                    </div>
                    <p className="card-description">{boisson.description}</p>
                  </div>

                  {/* Nouveau bouton Modifier plus visible */}
                  <button
                    className="modify-button"
                    onClick={() => handleEdit(boisson)}
                    aria-label="Modifier cette boisson"
                  >
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button className="floating-action-btn" onClick={() => setShowForm(true)} aria-label="Créer une boisson">
        <span className="btn-icon">➕</span>
        <span className="btn-text">Créer une boisson</span>
      </button>
    </div>
  )
}

export default BoissonsPage
