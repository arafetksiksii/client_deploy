"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import "./PresentationsPage.css"

const PresentationsPage = () => {
  const [presentations, setPresentations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  })
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState("grid") // grid, list

  const fetchPresentations = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/presentations")
      setPresentations(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des présentations:", error)
      alert("Impossible de charger les présentations")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPresentations()
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
      form.append("title", formData.title)
      form.append("content", formData.content)
      if (formData.image) form.append("image", formData.image)

      if (editId) {
        await API.put(`/presentations/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Présentation modifiée avec succès")
      } else {
        await API.post("/presentations", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Présentation créée avec succès")
      }

      resetForm()
      fetchPresentations()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", content: "", image: null })
    setEditId(null)
    setShowForm(false)
    setPreviewImage(null)
    setIsLoading(false)
  }

  const handleEdit = (presentation) => {
    setFormData({
      title: presentation.title,
      content: presentation.content,
      image: null,
    })
    setEditId(presentation._id)
    setShowForm(true)

    // Set preview image if available
    if (presentation.image) {
      setPreviewImage(`${presentation.image}`)
    } else {
      setPreviewImage(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette présentation ?")) {
        setIsLoading(true)
        await API.delete(`/presentations/${id}`)
        alert("Présentation supprimée avec succès")
        fetchPresentations()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Échec de la suppression")
      setIsLoading(false)
    }
  }

  const filteredPresentations = presentations
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  return (
    <div className="presentations-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="emoji">📝</span> Présentations
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
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form-title">{editId ? "Modifier" : "Créer"} une présentation</h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Titre
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Titre de la présentation"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Contenu
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Contenu de la présentation"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-textarea"
                  required
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
          <p>Chargement des présentations...</p>
        </div>
      ) : (
        <>
          {filteredPresentations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Aucune présentation trouvée</h3>
              <p>Commencez par créer une nouvelle présentation</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Créer une présentation
              </button>
            </div>
          ) : (
            <div className={`presentations-container ${viewMode === "list" ? "list-view" : "grid-view"}`}>
              {filteredPresentations.map((presentation) => (
                <div key={presentation._id} className="presentation-card">
                  <div className="card-image-container">
                    <img
                      src={
                        presentation.image ? `${presentation.image}` : "/images/placeholder.png"
                      }
                      alt={presentation.title}
                      className="card-image"
                      onError={(e) => (e.target.src = "/images/placeholder.png")}
                    />
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => handleEdit(presentation)}
                        aria-label="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => handleDelete(presentation._id)}
                        aria-label="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{presentation.title}</h3>
                    <p className="card-description">{presentation.content}</p>
                    <div className="card-meta">
                      {presentation.createdAt && (
                        <span className="card-date">{new Date(presentation.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Nouveau bouton Modifier plus visible */}
                  <button
                    className="modify-button"
                    onClick={() => handleEdit(presentation)}
                    aria-label="Modifier cette présentation"
                  >
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button className="floating-action-btn" onClick={() => setShowForm(true)} aria-label="Créer une présentation">
        <span className="btn-icon">➕</span>
        <span className="btn-text">Créer une présentation</span>
      </button>
    </div>
  )
}

export default PresentationsPage
