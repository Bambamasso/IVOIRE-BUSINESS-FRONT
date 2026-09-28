"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../layaut";
import { IoCheckmarkCircle, IoLockClosed } from "react-icons/io5";

const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400";

const MODULES = [
  { key: "service-request", label: "Demandes de service" },
  { key: "municipality", label: "Communes" },
  { key: "permission", label: "Permissions" },
  { key: "dashboard", label: "Tableau de bord" },
  { key: "attribute", label: "Caractéristiques" },
  { key: "category", label: "Catégories" },
  { key: "product", label: "Produits" },
  { key: "project", label: "Projets" },
  { key: "service", label: "Services" },
  { key: "slide", label: "Bannières" },
  { key: "order", label: "Commandes" },
  { key: "role", label: "Rôles" },
  { key: "city", label: "Villes" },
  { key: "user", label: "Utilisateurs" },
];

const ROLE_LABELS = {
  "super-admin": "Super Administrateur",
  admin: "Administrateur",
  manager: "Superviseur",
};

// Rôles à accès complet, non modifiables depuis cette page (comme l'admin).
const FULL_ACCESS_ROLES = ["admin", "super-admin"];

function getModuleLabel(permissionName) {
  const found = MODULES.find((m) => permissionName.endsWith(`-${m.key}`));
  return found ? found.label : "Autres";
}

function groupByModule(permissionNames) {
  const groups = {};
  permissionNames.forEach((name) => {
    const label = getModuleLabel(name);
    if (!groups[label]) groups[label] = [];
    groups[label].push(name);
  });
  return groups;
}

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({}); // { [roleId]: Set(permissionNames) }
  const [saving, setSaving] = useState(null); // roleId en cours d'enregistrement
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const headers = { Authorization: `Bearer ${token}` };

      const [rolesRes, permsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/admin/roles`, { headers }),
        axios.get(`${baseUrl}/api/admin/permissions`, { headers }),
      ]);

      const rolesData = (rolesRes.data?.data || []).filter(
        (r) => r.name === "manager" || FULL_ACCESS_ROLES.includes(r.name),
      );
      setRoles(rolesData);
      setAllPermissions(permsRes.data?.data || []);

      const initialSelected = {};
      rolesData.forEach((role) => {
        initialSelected[role.id] = new Set(
          (role.permissions || []).map((p) => p.name),
        );
      });
      setSelected(initialSelected);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les rôles et permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePermission = (roleId, permissionName) => {
    setSelected((prev) => {
      const next = new Set(prev[roleId]);
      if (next.has(permissionName)) {
        next.delete(permissionName);
      } else {
        next.add(permissionName);
      }
      return { ...prev, [roleId]: next };
    });
  };

  const saveRole = async (roleId) => {
    setSaving(roleId);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const permissions = Array.from(selected[roleId] || []);
      const response = await axios.post(
        `${baseUrl}/api/role-permissions/assign-permission/${roleId}`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.status === "success") {
        toast.success(response.data.message || "Permissions mises à jour");
        await fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de l'enregistrement",
      );
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const permissionNames = allPermissions.map((p) => p.name);
  const groups = groupByModule(permissionNames);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Rôles & Permissions
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Définit ce que chaque rôle peut faire dans l&apos;administration
          </p>
        </div>

        {roles.map((role) => {
          const isAdmin = FULL_ACCESS_ROLES.includes(role.name);
          const roleSelected = selected[role.id] || new Set();

          return (
            <section
              key={role.id}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#93b86a]/10 text-[#93b86a]">
                    {isAdmin ? (
                      <IoLockClosed size={20} />
                    ) : (
                      <IoCheckmarkCircle size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      {ROLE_LABELS[role.name] || role.name}
                    </p>
                    <p className={labelCls}>
                      {roleSelected.size} permission
                      {roleSelected.size > 1 ? "s" : ""}
                      {isAdmin ? " — accès complet, non modifiable" : ""}
                    </p>
                  </div>
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => saveRole(role.id)}
                    disabled={saving === role.id}
                    className="bg-[#93b86a] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                  >
                    {saving === role.id ? "Enregistrement..." : "Enregistrer"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groups).map(([moduleLabel, names]) => (
                  <div key={moduleLabel}>
                    <p className={`${labelCls} mb-2`}>{moduleLabel}</p>
                    <div className="space-y-1.5">
                      {names.map((name) => (
                        <label
                          key={name}
                          className={`flex items-center gap-2 text-sm ${isAdmin ? "text-gray-400" : "text-gray-700 cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isAdmin || roleSelected.has(name)}
                            disabled={isAdmin}
                            onChange={() => togglePermission(role.id, name)}
                            className="h-4 w-4 rounded border-gray-300 text-[#93b86a] focus:ring-[#93b86a]/30 disabled:opacity-60"
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AdminLayout>
  );
}
