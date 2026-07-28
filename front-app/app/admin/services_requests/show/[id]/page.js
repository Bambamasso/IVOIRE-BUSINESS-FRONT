"use client";
import AdminLayout from "@/app/admin/layaut";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as React from "react";
import {
  RiArrowLeftLine,
  RiFileList3Line,
  RiMailLine,
  RiMapPin2Line,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from "react-icons/ri";
import RejectRequest from "@/components/modal/reject_Request";

export default function ServiceRequestDetailPage({ params }) {
  // Vérifie que l'ID est bien reçu
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openReject, setOpenReject] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { id } = React.use(params);
  const fetchDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/service-requests/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRequest(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const validatedRequest = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.patch(
        `${baseUrl}/api/admin/service-requests/completed/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response.data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        fetchDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-20 text-center">Chargement...</div>
      </AdminLayout>
    );
  const isPending =
    request.status?.code === "pending" || request.status_id === "id_pending";
  const isCompleted = request.status?.code === "completed";
  const isRejected = request.status?.code === "rejected";
  return (
    <AdminLayout>
      {/* Bouton retour */}

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-bold text-sm transition-all"
      >
        <RiArrowLeftLine className="text-lg" /> Retour
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : Détails de la demande */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Demande {request.request_number}
                </h2>
                <p className="text-gray-400 text-sm font-bold">
                  Détails complets de la sollicitation
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#e8d393]/10 text-[#ceb56b] font-black text-xs uppercase">
                {request.service?.name}
              </span>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Infos Client */}
              <div className="space-y-6">
                <h3 className="text-[#93b86a] font-black text-xs uppercase tracking-widest">
                  Informations Client
                </h3>
                <div className="space-y-4">
                  <DetailItem
                    icon={<RiUserLine />}
                    label="Nom complet"
                    value={request.full_name}
                  />
                  <DetailItem
                    icon={<RiMailLine />}
                    label="Email"
                    value={request.email}
                  />
                  <DetailItem
                    icon={<RiPhoneLine />}
                    label="Téléphone"
                    value={request.phone_number}
                  />
                  <DetailItem
                    icon={<RiMapPinLine />}
                    label="Adresse"
                    value={request.address}
                  />
                </div>
              </div>

              {/* Infos Financières */}
              <div className="space-y-6">
                <h3 className="text-[#93b86a] font-black text-xs uppercase tracking-widest">
                  Négociation & Prix
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Budget estimé par le client
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {request.propose_price
                        ? `${request.propose_price} `
                        : "Aucun"}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Prix Négocié (Final)
                    </p>
                    <p className="text-xl font-black text-[#93b86a]">
                      {request.negotiated_price
                        ? `${request.negotiated_price} €`
                        : "En attente"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails du projet */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              <h3 className="flex items-center gap-2 text-[#93b86a] font-black text-xs uppercase tracking-widest mb-4">
                <RiFileList3Line /> Description du besoin
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {request.details || "Aucun détail supplémentaire fourni."}
              </p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Actions & Statut */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
            <h3 className="text-gray-900 font-black text-lg mb-6">
              Actions de gestion
            </h3>

            {isPending ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => validatedRequest()}
                  className="w-full py-4 bg-[#93b86a] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-all"
                >
                  Valider la demande
                </button>
                <button
                  onClick={() => {
                    setSelectedRequestId(request.id);
                    setOpenReject(true);
                  }}
                  className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-red-50 transition-all"
                >
                  Refuser
                </button>
              </div>
            ) : (
              <div
                className={`p-6 rounded-2xl text-center border-2 ${isCompleted ? "bg-[#93b86a]/10 border-[#93b86a]/20" : "bg-red-50 border-red-100"}`}
              >
                <p
                  className={`font-black text-sm uppercase ${isCompleted ? "text-[#93b86a]" : "text-red-500"}`}
                >
                  {isCompleted ? "Demande Validée" : "Demande Refusée"}
                </p>
                {/* <p className="text-[10px] text-gray-400 mt-1 font-bold">
                  Le statut ne peut plus être modifié.
                </p> */}
              </div>
            )}
          </div>
          <RejectRequest
            openReject={openReject}
            onClose={() => setOpenReject(false)}
            requestId={selectedRequestId}
            onRefresh={fetchDetails}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-[#e8d393]">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
          {label}
        </p>
        <p className="text-sm font-black text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}
