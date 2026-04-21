"use client";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import AdminLayout from "../layaut";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteService from "@/components/modal/delete_service";
import EditeService from "@/components/modal/edite_service";
import CreateService from "@/components/modal/add_service";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Récupération des données
  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/admin/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Services chargés :", response.data?.data || []);
      setServices(response.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8 bg-white rounded-[32px] shadow-sm border border-gray-50">
        {/* Header du tableau */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des Services
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
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

        {/* Le Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Prix (FCFA)</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    Chargement des services...
                  </td>
                </tr>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                  >
                    {/* NOM */}
                    <td className="px-6 py-5 rounded-l-2xl">
                      <span className="text-sm font-black text-gray-800">
                        {service.name}
                      </span>
                    </td>

                    {/* PRIX */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-[#93b86a]">
                        {new Intl.NumberFormat("fr-FR").format(service.price)}
                      </span>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-5">
                      <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs">
                        {service.description || "Aucune description fournie."}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5 rounded-r-2xl text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setOpenEdit(true);
                            setSelectedService(service);
                          }}
                          className="p-2 bg-white text-gray-400 hover:text-[#93b86a] rounded-xl border border-gray-100 shadow-sm transition-colors"
                          title="Modifier"
                        >
                          <IoPencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setOpenDelete(true);
                          }}
                          className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 shadow-sm transition-colors"
                          title="Supprimer"
                        >
                          <IoTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    Aucun service trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}

      <CreateService
        openCreate={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefresh={fetchServices}
      />

      <DeleteService
        openDelete={openDelete}
        onClose={() => setOpenDelete(false)}
        serviceId={selectedServiceId}
        serviceData={selectedService}
        onRefresh={fetchServices}
      />

      <EditeService
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        serviceId={selectedServiceId}
        serviceData={selectedService}
        onRefresh={fetchServices}
      />
    </AdminLayout>
  );
}
