"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RiEyeLine, RiUserLine, RiTimeLine } from "react-icons/ri";
import Link from "next/link";
import { IoTrash } from "react-icons/io5";
import DeleteServiceRequest from "./delete_service_request";

export default function ServiceRequestList({ route, statusColor }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}${route}?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.data.data);
      setPagination(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [route]);

   const getStatusStyle = (name) => {
    switch (name) {
      case "En attente":
        
        return "inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-black"
      case "Terminé(e)":
       
       return "inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-black"

      case "Rejeté(e)":
        return "inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-black";
      default:
        return "inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-black";
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center font-black text-gray-400 animate-pulse text-[10px] uppercase tracking-widest">
        Chargement des demande...
      </div>
    );

  return (
  <div className="space-y-6">
    <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <th className="px-8 py-6">Nom du client</th>
              <th className="px-6 py-6">email</th>
              <th className="px-8 py-6 text-right">numéro</th>
              <th className="px-6 py-6">Status</th>
              <th className="px-6 py-6">Date</th>
              <th className="px-6 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{/* Bordures de lignes nettement plus visibles */}{requests.length > 0 ? requests.map((req) => (
            <tr
              key={req.id}
              className="group hover:bg-[#93b86a]/5 transition-colors"
            >
              <td className="px-8 py-5">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  {req.full_name}
                </p>
              </td>
              <td className="px-6 py-5 text-sm font-medium text-gray-500">
                {req.email}
              </td>
              <td className="px-8 py-5 text-right">
                <span className="text-sm font-black text-gray-700">
                  {req.phone_number}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className={getStatusStyle(req.status?.name)}>
                  {req.status?.name}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                  {new Date(req.created_at).toLocaleDateString("fr-FR")}
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`./services_requests/show/${req.id}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                  >
                    <RiEyeLine size={18} />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setOpenDelete(true);
                    }}
                    className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-200 shadow-sm transition-colors"
                    title="Supprimer"
                  >
                    <IoTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (<tr><td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold italic">Aucun dossier trouvé dans cette catégorie.</td></tr>)}</tbody>
        </table>
      </div>

      {/* Pagination Réintégrée */}
      {pagination.last_page > 1 && (
        <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => fetchRequests(p)}
                className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all ${
                  pagination.current_page === p
                    ? "bg-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20"
                    : "bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#e8d393]"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
      )}
    </div>

    {/* Composant de suppression réintégré */}
    <DeleteServiceRequest
      openDelete={openDelete}
      onClose={() => setOpenDelete(false)}
      requestId={selectedRequestId}
      onRefresh={fetchRequests}
    />
  </div>
);
}
