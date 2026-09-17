"use client";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import AdminLayout from "../layaut";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteService from "@/components/modal/delete_service";
import EditeService from "@/components/modal/edite_service";
import CreateService from "@/components/modal/add_service";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [pagination, setPagination] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Récupération des données
  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/services?page=${page}&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setServices(response.data?.data?.data || []);
      setPagination(response.data?.data || {});
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du chargement des services.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
  <AdminLayout>
    <div className="space-y-6">
      {/* HEADER SIMPLE */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Gestion des Services
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Catalogue des prestations
          </p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
        >
          <IoAdd size={18} /> AJOUTER UN SERVICE
        </button>
      </div>

      {/* TABLEAU AVEC LE DESIGN SERVICE REQUEST */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <th className="px-8 py-6">Nom du service</th>
                <th className="px-6 py-6 text-center">Prix Standard</th>
                <th className="px-8 py-6">Description</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                    Chargement du catalogue...
                  </td>
                </tr>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="group hover:bg-[#93b86a]/5 transition-colors"
                  >
                    {/* NOM */}
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-900 leading-tight">
                        {service.name}
                      </p>
                      
                    </td>

                    {/* PRIX */}
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#93b86a]/10 text-[#93b86a] text-sm font-black">
                        {new Intl.NumberFormat("fr-FR").format(service.price)} 
                        <span className="ml-1 text-[10px]">FCFA</span>
                      </span>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-8 py-5">
                      <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs italic">
                        {service.description || "Aucune description."}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setSelectedService(service);
                            setOpenEdit(true);
                          }}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                          title="Modifier"
                        >
                          <IoPencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setSelectedService(service);
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
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                    Aucun service trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION STYLE SERVICE REQUEST */}
        {pagination.last_page > 1 && (
          <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchServices(p)}
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
      <CreateService openCreate={openCreate} onClose={() => setOpenCreate(false)} onRefresh={fetchServices} />
      <DeleteService openDelete={openDelete} onClose={() => setOpenDelete(false)} serviceId={selectedServiceId} serviceData={selectedService} onRefresh={fetchServices} />
      <EditeService openEdit={openEdit} onClose={() => setOpenEdit(false)} serviceId={selectedServiceId} serviceData={selectedService} onRefresh={fetchServices} />
    </div>
  </AdminLayout>
);
}
