"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminLayout from "../layaut";
import { IoAdd, IoPencil, IoTrash, IoLocationOutline } from "react-icons/io5";
import AddCity from "@/components/modal/add_city";
import EditCity from "@/components/modal/edit_city";
import DeleteCity from "@/components/modal/delete_city";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCities = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/admin/cities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCities(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les villes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des Villes
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Catalogue des villes et de leurs communes
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <IoAdd size={18} /> AJOUTER
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <th className="px-8 py-6">Nom</th>
                  <th className="px-8 py-6">Communes</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Chargement ...
                    </td>
                  </tr>
                ) : cities.length > 0 ? (
                  cities.map((city) => (
                    <tr
                      key={city.id}
                      className="group hover:bg-[#93b86a]/5 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <Link
                          href={`/admin/cities/${city.id}`}
                          className="text-sm font-black text-gray-900 leading-tight hover:text-[#93b86a] transition-colors"
                        >
                          {city.name}
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <Link
                          href={`/admin/cities/${city.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#93b86a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#93b86a] hover:bg-[#93b86a]/20 transition-colors"
                        >
                          <IoLocationOutline size={13} />
                          {city.municipalities_count ?? 0} commune
                          {(city.municipalities_count ?? 0) > 1 ? "s" : ""}
                        </Link>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedCity(city);
                              setOpenEdit(true);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                            title="Modifier"
                          >
                            <IoPencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCity(city);
                              setOpenDelete(true);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                            title="Supprimer"
                          >
                            <IoTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Aucune ville trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddCity
        openCreate={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefresh={fetchCities}
      />
      <EditCity
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        city={selectedCity}
        onRefresh={fetchCities}
      />
      <DeleteCity
        openDelete={openDelete}
        onClose={() => setOpenDelete(false)}
        city={selectedCity}
        onRefresh={fetchCities}
      />
    </AdminLayout>
  );
}
