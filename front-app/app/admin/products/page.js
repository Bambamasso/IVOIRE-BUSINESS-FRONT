'use client'
import { useState, useEffect } from "react";
import AdminLayout from "../layaut";
import ProductForm from "@/components/product_form";


export default function ProductsPage() {
    const [products, setProducts] = useState([
        // Données d'exemple
        { id: 1, name: "Produit 1", category: "Électronique", price: 299.99, status: "Actif" },
        { id: 2, name: "Produit 2", category: "Vêtements", price: 49.99, status: "Actif" },
        { id: 3, name: "Produit 3", category: "Livres", price: 19.99, status: "Inactif" },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        status: "Actif"
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingId(product.id);
            setFormData(product);
        } else {
            setEditingId(null);
            setFormData({ name: "", category: "", price: "", status: "Actif" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ name: "", category: "", price: "", status: "Actif" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
        } else {
            setProducts([...products, { ...formData, id: Date.now() }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleView = (product) => {
        alert(`Détails du produit:\n\nNom: ${product.name}\nCatégorie: ${product.category}\nPrix: ${product.price}€\nStatut: ${product.status}`);
    };

    return (
        <>
            <AdminLayout>
                <div className="p-6">
                    {/* En-tête avec titre et bouton Ajouter */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Gestion des produits</h1>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            
                            Ajouter un produit
                        </button>
                    </div>

                    {/* Tableau des produits */}
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">Nom</th>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">Catégorie</th>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">Prix</th>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">Statut</th>
                                    <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="border border-gray-300 px-6 py-4 text-gray-800">{product.name}</td>
                                        <td className="border border-gray-300 px-6 py-4 text-gray-800">{product.category}</td>
                                        <td className="border border-gray-300 px-6 py-4 text-gray-800">{product.price}€</td>
                                        <td className="border border-gray-300 px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                product.status === "Actif" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                                                    title="Voir"
                                                >
                                                   
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition"
                                                    title="Modifier"
                                                >
                                                   
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                                                    title="Supprimer"
                                                >
                                                    
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal d'ajout/modification */}
                    {showModal && (
                        <ProductForm
                            editingId={editingId}
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            handleCloseModal={handleCloseModal}
                        />
                    )}
                </div>
            </AdminLayout>
        </>
    );
}