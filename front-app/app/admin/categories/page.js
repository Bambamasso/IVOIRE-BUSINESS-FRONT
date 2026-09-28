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
import { IoPencil } from "react-icons/io5";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectCategorie, setSelectedCategorie] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectcategorieId, setCategorieId] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (page = 1) => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/admin/categories?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = Array.isArray(response.data.data)
        ? response.data
        : response.data.data.data || [];
      setCategories(data);
      setPagination(response.data.data || {});
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER STYLE SERVICE REQUEST */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des Catégories
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Organisation du catalogue •{" "}
              {pagination.total ?? categories.length} catégories
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <IoIosAddCircle size={20} /> AJOUTER
          </button>
        </div>

        {/* TABLEAU DESIGN UNIFIÉ */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <th className="px-8 py-6">Aperçu</th>
                  <th className="px-6 py-6 text-center">Nom</th>
                  <th className="px-8 py-6">Catégorie parente</th>
                  <th className="px-8 py-6">Description</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && !categories.length ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Chargement des catégories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Aucune catégorie trouvée.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="group hover:bg-[#93b86a]/5 transition-colors"
                    >
                      {/* APERÇU ET NOM */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={`${baseUrl}/storage/${cat.image}`}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-tight">
                              {cat.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TYPE (PARENT OU SOUS-CATÉGORIE) */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            !cat.parent_id
                              ? " border border-[#e8d393]"
                              : "bg-[#93b86a]/10 text-[#93b86a] border border-[#93b86a]/20"
                          }`}
                        >
                          {!cat.parent_id
                            ? "aucune"
                            : cat.parent?.name || "—"}
                        </span>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-8 py-5">
                        <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs italic">
                          {cat.description || "Aucune description rédigée."}
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setCategorieId(cat.id);
                              setSelectedCategorie(cat);
                              setEditOpen(true);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                            title="Modifier"
                          >
                            <IoPencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setCategorieId(cat.id);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                            title="Supprimer"
                          >
                            <MdOutlineDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINATION STYLE SERVICE REQUEST */}
          {pagination.last_page > 1 && (
            <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchCategories(p)}
                  className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all ${
                    pagination.current_page === p
                      ? "bg-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20"
                      : "bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#e8d393]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MODALS */}
        <EditCategorie
          editOpen={editOpen}
          onClose={() => setEditOpen(false)}
          categorie={selectCategorie}
          refresh={fetchCategories}
        />
        <DeleteCategorie
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          categorie_id={selectcategorieId}
          refresh={fetchCategories}
        />
        <CreatCategorie
          addOpen={addOpen}
          onClose={() => setAddOpen(false)}
          refresh={fetchCategories}
        />
      </div>
    </AdminLayout>
  );
}
