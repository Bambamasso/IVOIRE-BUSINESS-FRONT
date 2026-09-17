"use client";
import AdminLayout from "@/app/admin/layaut";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as React from "react";
import {
  IoArrowBack,
  IoAdd,
  IoPencil,
  IoTrash,
  IoLocationOutline,
} from "react-icons/io5";
import AddMunicipality from "@/components/modal/add_municipality";
import EditMunicipality from "@/components/modal/edit_municipality";
import DeleteMunicipality from "@/components/modal/delete_municipality";

const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400";

export default function CityDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [municipalities, setMunicipalities] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n || 0);

  const fetchCity = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/admin/cities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCity(response.data?.data || null);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger cette ville.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMunicipalities = async (page = 1) => {
    try {
      setLoadingMunicipalities(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/municipalities?city_id=${id}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMunicipalities(response.data?.data?.data || []);
      setPagination(response.data?.data || {});
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les communes.");
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchCity(), fetchMunicipalities(pagination.current_page || 1)]);
  };

  useEffect(() => {
    if (id) {
      fetchCity();
      fetchMunicipalities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
        </div>
      </AdminLayout>
    );

  if (!city)
    return (
      <AdminLayout>
        <div className="p-20 text-center text-red-500 font-bold">
          Ville introuvable.
        </div>
      </AdminLayout>
    );

  const communesCount = city.municipalities_count ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/admin/cities")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            <IoArrowBack size={18} /> Retour aux villes
          </button>
        </div>

        {/* Bandeau ville */}
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#7fa359] to-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20">
          <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center text-white/50">
              <IoLocationOutline size={40} />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                Ville
              </span>
              <h1 className="mt-1 text-3xl font-black leading-tight">
                {city.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Fact
                icon={IoLocationOutline}
                label="Communes"
                value={
                  <>
                    {communesCount}
                    <span className="ml-1 text-xs font-medium text-white/60">
                      commune{communesCount > 1 ? "s" : ""}
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Communes */}
        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 pb-6 flex items-center justify-between">
            <h2 className={labelCls}>Communes de {city.name}</h2>
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 bg-[#93b86a] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-transform"
            >
              <IoAdd size={16} /> AJOUTER UNE COMMUNE
            </button>
          </div>

          <div className="px-8 pb-8">
            {loadingMunicipalities ? (
              <div className="py-10 text-center text-sm text-gray-400 font-bold italic">
                Chargement...
              </div>
            ) : municipalities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                      <th className="pb-4">Nom</th>
                      <th className="pb-4 text-right">Frais de livraison</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {municipalities.map((m) => (
                      <tr key={m.id} className="group">
                        <td className="py-5 font-bold text-gray-900">
                          {m.name}
                        </td>
                        <td className="py-5 text-right text-gray-600">
                          {m.shipping_fee
                            ? `${fmt(m.shipping_fee)} FCFA`
                            : "—"}
                        </td>
                        <td className="py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedMunicipality(m);
                                setOpenEdit(true);
                              }}
                              className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                              title="Modifier"
                            >
                              <IoPencil size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMunicipality(m);
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-10 text-center text-sm text-gray-400">
                Aucune commune pour cette ville.
              </div>
            )}
          </div>

          {pagination.last_page > 1 && (
            <div className="p-6 border-t border-gray-100 flex items-center justify-center gap-4 bg-gray-50/30">
              <button
                onClick={() => fetchMunicipalities(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-wider bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#93b86a] hover:text-[#93b86a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Précédent
              </button>
              <span className="text-[10px] font-black text-gray-500 tracking-wider">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => fetchMunicipalities(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 h-9 rounded-xl font-black text-[10px] uppercase tracking-wider bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#93b86a] hover:text-[#93b86a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Suivant
              </button>
            </div>
          )}
        </section>
      </div>

      <AddMunicipality
        openCreate={openCreate}
        onClose={() => setOpenCreate(false)}
        cityId={city.id}
        onRefresh={refreshAll}
      />
      <EditMunicipality
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        municipality={selectedMunicipality}
        onRefresh={refreshAll}
      />
      <DeleteMunicipality
        openDelete={openDelete}
        onClose={() => setOpenDelete(false)}
        municipality={selectedMunicipality}
        onRefresh={refreshAll}
      />
    </AdminLayout>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          {label}
        </p>
        <p className="text-lg font-black leading-tight">{value}</p>
      </div>
    </div>
  );
}
