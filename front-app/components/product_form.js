'use client'
import { useState } from 'react';


export default function ProductForm({
  editingId,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  handleCloseModal
}) {
  const [activeTab, setActiveTab] = useState('info');
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: '', price: '' });

  const handleAddVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.stock !== '' && newVariant.price !== '') {
      const variants = formData.variants || [];
      setFormData(prev => ({
        ...prev,
        variants: [...variants, { ...newVariant, id: Date.now() }]
      }));
      setNewVariant({ size: '', color: '', stock: '', price: '' });
    }
  };

  const handleRemoveVariant = (id) => {
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter(v => v.id !== id)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = formData.images || [];
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file: file
    }));
    setFormData(prev => ({
      ...prev,
      images: [...images, ...newImages]
    }));
  };

  const handleRemoveImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img.id !== id)
    }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0"
        onClick={handleCloseModal}
      />
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-4 p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-600 hover:text-gray-800 transition"
          >
          
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-4 border-b px-6 pt-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 px-4 font-semibold border-b-2 transition ${
              activeTab === 'info'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-2 px-4 font-semibold border-b-2 transition ${
              activeTab === 'images'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab('variants')}
            className={`pb-2 px-4 font-semibold border-b-2 transition ${
              activeTab === 'variants'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Variantes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TAB: INFORMATIONS */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Entrez le nom du produit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Catégorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    value={formData.status || 'Actif'}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows="4"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantité Totale
                  </label>
                  <input
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => handleFormChange('quantity', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Prix de base *
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    required
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Télécharger des images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Vous pouvez sélectionner plusieurs images</p>
              </div>

              {(formData.images || []).length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Images ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img) => (
                      <div key={img.id} className="relative bg-gray-100 rounded-lg p-2">
                        <img
                          src={URL.createObjectURL(img.file)}
                          alt={img.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        >
                          
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{img.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: VARIANTES */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Ajouter une variante (Taille/Couleur)</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Taille (S, M, L, XL...)"
                    value={newVariant.size}
                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Couleur (Rouge, Bleu...)"
                    value={newVariant.color}
                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Prix"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.01"
                    min="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  
                  Ajouter cette variante
                </button>
              </div>

              {(formData.variants || []).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Variantes ajoutées ({formData.variants.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.variants.map((variant, idx) => (
                      <div key={variant.id} className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800">
                            {variant.size} - {variant.color}
                          </p>
                          <p className="text-gray-600">
                            Stock: {variant.stock} | Prix: {variant.price}€
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                        >
                          
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {editingId ? "Modifier le produit" : "Ajouter le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
