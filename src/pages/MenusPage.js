"use client"

import { useState, useEffect } from "react"
import API from "../services/api"
import jsPDF from "jspdf"
import "./MenusPage.css"

const MenusPage = () => {
  const [menus, setMenus] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, alphabetical
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    items: [{ name: "", description: "", price: "" }],
  })
  const [editId, setEditId] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid, list

  const fetchMenus = async () => {
    setIsLoading(true)
    try {
      const res = await API.get("/menus")
      setMenus(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des menus:", error)
      alert("Impossible de charger les menus")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", description: "", price: "" }],
    }))
  }

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("items", JSON.stringify(formData.items))
      if (formData.image) form.append("image", formData.image)

      if (editId) {
        await API.put(`/menus/${editId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Menu modifié avec succès")
      } else {
        await API.post("/menus", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Menu créé avec succès")
      }

      resetForm()
      fetchMenus()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      alert(editId ? "Échec de la modification" : "Échec de la création")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image: null,
      items: [{ name: "", description: "", price: "" }],
    })
    setEditId(null)
    setShowForm(false)
    setPreviewImage(null)
    setIsLoading(false)
  }

  const handleEdit = (menu) => {
    setFormData({
      title: menu.title,
      image: null,
      items: menu.items,
    })
    setEditId(menu._id)
    setShowForm(true)

    // Set preview image if available
    if (menu.image) {
      setPreviewImage(`${menu.image}`)
    } else {
      setPreviewImage(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) {
        setIsLoading(true)
        await API.delete(`/menus/${id}`)
        alert("Menu supprimé avec succès")
        fetchMenus()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Échec de la suppression")
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = (menu) => {
    try {
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(menu.title, 20, 30)

      // Add separator line
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 35, 190, 35)

      // Add items
      let y = 50
      menu.items.forEach((item, idx) => {
        // Item name and price
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(`${item.name}`, 20, y)

        // Price on the right
        const priceText = `${item.price} TND`
        const priceWidth = (doc.getStringUnitWidth(priceText) * 14) / doc.internal.scaleFactor
        doc.text(priceText, 190 - priceWidth, y)

        // Description
        if (item.description) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "normal")
          doc.text(item.description, 20, y + 10)
          y += 20
        } else {
          y += 15
        }

        // Add separator between items
        if (idx < menu.items.length - 1) {
          doc.setDrawColor(230, 230, 230)
          doc.line(20, y - 5, 190, y - 5)
        }
      })

      // Add footer
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Menu généré le ${new Date().toLocaleDateString()}`, 20, 280)

      doc.save(`${menu.title}_menu.pdf`)
      alert("Menu téléchargé avec succès")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Échec du téléchargement")
    }
  }

  // Filtrer et trier les menus
  const filteredAndSortedMenus = menus
    .filter((menu) => {
      // Filtre par recherche
      return (
        menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.items.some(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      )
    })
    .sort((a, b) => {
      // Tri
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  return (
    <div className="menus-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="emoji">📋</span> Menus
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

            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
              <h2 className="form-title">
                <span className="form-emoji">🧾</span> {editId ? "Modifier le menu" : "Créer un menu"}
              </h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Titre du menu
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Titre du menu"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Image du menu
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
                      <img src={previewImage || "/placeholder.svg"} alt="Aperçu" className="image-preview" />
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

              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="section-emoji">🍽️</span> Items du menu
                  </h3>
                  <button type="button" onClick={addItem} className="add-item-btn">
                    <span className="btn-icon">➕</span> Ajouter un item
                  </button>
                </div>

                <div className="items-container">
                  {formData.items.map((item, index) => (
                    <div key={index} className="menu-item-block">
                      <div className="item-header">
                        <span className="item-number">Item #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="remove-item-btn"
                          disabled={formData.items.length === 1}
                        >
                          <span className="btn-icon">❌</span>
                        </button>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor={`item-name-${index}`} className="form-label">
                            Nom
                          </label>
                          <input
                            id={`item-name-${index}`}
                            type="text"
                            placeholder="Nom de l'item"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`item-price-${index}`} className="form-label">
                            Prix (TND)
                          </label>
                          <input
                            id={`item-price-${index}`}
                            type="number"
                            step="0.01"
                            placeholder="Prix"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor={`item-desc-${index}`} className="form-label">
                          Description
                        </label>
                        <textarea
                          id={`item-desc-${index}`}
                          placeholder="Description de l'item"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          className="form-textarea"
                        />
                      </div>
                    </div>
                  ))}
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
          <p>Chargement des menus...</p>
        </div>
      ) : (
        <>
          {filteredAndSortedMenus.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Aucun menu trouvé</h3>
              <p>Commencez par créer un nouveau menu</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Créer un menu
              </button>
            </div>
          ) : (
            <div className={`menus-container ${viewMode === "list" ? "list-view" : "grid-view"}`}>
              {filteredAndSortedMenus.map((menu) => (
                <div key={menu._id} className="menu-card">
                  <div className="card-image-container">
                    <img
                      src={menu.image ? `${menu.image}` : "/images/placeholder.png"}
                      alt={menu.title}
                      className="card-image"
                      onError={(e) => (e.target.src = "/images/placeholder.png")}
                    />
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit-btn"
                        onClick={() => handleEdit(menu)}
                        aria-label="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => handleDelete(menu._id)}
                        aria-label="Supprimer"
                      >
                        🗑️
                      </button>
                      <button
                        className="card-action-btn download-btn"
                        onClick={() => handleDownloadPDF(menu)}
                        aria-label="Télécharger PDF"
                      >
                        📄
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{menu.title}</h3>
                    <div className="menu-items">
                      {menu.items.map((item, i) => (
                        <div key={i} className="menu-item">
                          <div className="item-header">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">{item.price} TND</span>
                          </div>
                          {item.description && <p className="item-description">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nouveau bouton Modifier plus visible */}
                  <button className="modify-button" onClick={() => handleEdit(menu)} aria-label="Modifier ce menu">
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button className="floating-action-btn" onClick={() => setShowForm(true)} aria-label="Créer un menu">
        <span className="btn-icon">➕</span>
        <span className="btn-text">Créer un menu</span>
      </button>
    </div>
  )
}

export default MenusPage
