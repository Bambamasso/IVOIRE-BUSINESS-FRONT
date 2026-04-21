'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../layaut";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";

export default function CitiesPage(){
  const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    // Récupération des données
  const fetchCities = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/admin/cities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Villes chargées :", response.data?.data || []);
      setCities(response.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);
     return (
    <AdminLayout>
      <div className="p-8 bg-white rounded-[32px] shadow-sm border border-gray-50">
        {/* Header du tableau */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des Villes
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Catalogue des villes
            </p>
          </div>
          <button 
           onClick={()=>setOpenCreate(true)} 
          className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform">
            <IoAdd size={18} /> AJOUTER UNE VILLE
          </button>
        </div>

        {/* Le Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="px-6 py-4">Nom</th>
                
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    Chargement des villes...
                  </td>
                </tr>
              ) : cities.length > 0 ? (
                cities.map((city) => (
                  <tr
                    key={city.id}
                    className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                  >
                    {/* NOM */}
                    <td className="px-6 py-5 rounded-l-2xl">
                      <span className="text-sm font-black text-gray-800">
                        {city.name}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5 rounded-r-2xl text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setOpenEdit(true);
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
                    Aucune ville trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
    

      {/* <CreateService
      openCreate= {openCreate}
      onClose={()=>setOpenCreate(false)}
      /> */}

      {/* <DeleteService
      openDelete= {openDelete}
      onClose={()=>setOpenDelete(false)}
      serviceId= {selectedServiceId}
      /> */}

      {/* <EditeService
      openEdit= {openEdit}
      onClose={()=>setOpenEdit(false)}
      serviceId= {selectedServiceId}
      /> */}
    </AdminLayout>
  );
}