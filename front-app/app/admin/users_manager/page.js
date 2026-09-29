"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import AdminLayout, { useAdminAuth } from "../layaut";
import AddUser from "@/components/modal/add_user";
import EditUser from "@/components/modal/edit_user";
import DeleteUser from "@/components/modal/delete_user";
import {
  RiAddLine,
  RiSearchLine,
  RiKeyLine,
  RiPencilLine,
  RiDeleteBinLine,
} from "react-icons/ri";

const ROLE_LABELS = {
  "super-admin": "Super Administrateur",
  admin: "Administrateur",
  manager: "Superviseur",
};

// Rôles à accès complet dont le compte ne doit pas être modifiable/supprimable
// depuis cette page, quelles que soient les permissions de la personne connectée.
const FULL_ACCESS_ROLES = ["admin", "super-admin"];

export default function UsersManagerPage() {
  const { hasPermission } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resettingId, setResettingId] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/admin/users-manager`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          ...(search ? { search } : {}),
          ...(role ? { role } : {}),
        },
      });

      if (response.data.status === "success") {
        const data = response.data.data;
        setUsers(data.data || []);
        setLastPage(data.last_page || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, page, search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleResetPassword = async (user) => {
    setResettingId(user.id);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.patch(
        `${baseUrl}/api/admin/users-manager/${user.id}/reset-password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.status === "success") {
        toast.success(response.data.message || "Mot de passe réinitialisé");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe",
      );
    } finally {
      setResettingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Utilisateurs
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Gère les comptes administrateurs et superviseurs
            </p>
          </div>
          {hasPermission("create-user") && (
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-transform"
            >
              <RiAddLine size={18} />
              Ajouter
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Rechercher par nom, identifiant ou email..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:border-[#93b86a]/20 transition-all"
            />
          </div>
          <select
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
            className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:border-[#93b86a]/20 transition-all cursor-pointer"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="manager">Superviseur</option>
            <option value="super-admin">Super Administrateur</option>
          </select>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Utilisateur</th>
                  <th className="px-6 py-4 text-left">Identifiant</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Téléphone</th>
                  <th className="px-6 py-4 text-left">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-gray-400 font-bold"
                    >
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                       {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {user.number || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#93b86a]/10 text-[#93b86a]">
                          {ROLE_LABELS[user.roles?.[0]?.name] ||
                            user.roles?.[0]?.name ||
                            "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!FULL_ACCESS_ROLES.includes(user.roles?.[0]?.name) && (
                          <div className="flex items-center justify-end gap-2">
                            {hasPermission("edit-user") && (
                              <button
                                onClick={() => handleResetPassword(user)}
                                disabled={resettingId === user.id}
                                title="Réinitialiser le mot de passe"
                                className="p-2 text-gray-400 hover:text-[#93b86a] hover:bg-[#93b86a]/10 rounded-xl transition-colors disabled:opacity-50"
                              >
                                <RiKeyLine size={18} />
                              </button>
                            )}
                            {hasPermission("edit-user") && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenEdit(true);
                                }}
                                title="Modifier"
                                className="p-2 text-gray-400 hover:text-[#93b86a] hover:bg-[#93b86a]/10 rounded-xl transition-colors"
                              >
                                <RiPencilLine size={18} />
                              </button>
                            )}
                            {hasPermission("delete-user") && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenDelete(true);
                                }}
                                title="Supprimer"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <RiDeleteBinLine size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-bold">
                Page {page} sur {lastPage}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddUser
        openCreate={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefresh={fetchUsers}
      />
      <EditUser
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        onRefresh={fetchUsers}
      />
      <DeleteUser
        openDelete={openDelete}
        onClose={() => setOpenDelete(false)}
        user={selectedUser}
        onRefresh={fetchUsers}
      />
    </AdminLayout>
  );
}
