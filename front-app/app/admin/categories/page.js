"use client";
import AdminLayout from "../layaut";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import DeleteCategorie from "@/components/modal/categorie_delete";
import CreatCategorie from "@/components/modal/add_categorie";
import EditCategorie from "@/components/modal/edit_categorie";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectcategorieId, setCategorieId] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    let token;

    try {
      token = JSON.parse(stored);
      //
    } catch {
      token = stored;
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Catégories
            </h1>
            <button
              onClick={() => {
                setAddOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <IoIosAddCircle size={20} />
              Ajouter une catégorie
            </button>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            {loading && !categories.length ? (
              <div className="p-6 text-center text-gray-600 dark:text-gray-300">
                Chargement...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-6 text-center text-gray-600 dark:text-gray-300">
                Aucune catégorie trouvée
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-600">
                  {categories.map((categorie) => (
                    <tr
                      key={categorie.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        0
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {categorie.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {categorie.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCategorieId(categorie.id); setEditOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition"
                            title="Modifier"
                          >
                            <FaRegEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setCategorieId(categorie.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition"
                            title="Supprimer"
                          >
                            <MdOutlineDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <EditCategorie 
          editOpen={editOpen}
          onClose={()=>setEditOpen(false)}
          categorie_id={selectcategorieId}
          onConfirm={fetchCategories}
          />
          <DeleteCategorie
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={fetchCategories}
            categorie_id={selectcategorieId}
          />
          <CreatCategorie addOpen={addOpen} onClose={() => setAddOpen(false)} onConfirm={fetchCategories} />
        </div>
      </AdminLayout>
    </>
  );
}
