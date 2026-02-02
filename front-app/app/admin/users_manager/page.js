"use client";

import AdminLayout from "../layaut";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modale";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = baseUrl + "/api/user-manager/all-user";
  const [token, setToken] = useState("token");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
 
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    let token;
    try {
      token = JSON.parse(stored);
    } catch {
      token = stored;
    }
    const allUsers = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Erreur réseau:", error);
        // localStorage.removeItem("admin_token");
        // router.push("/admin/login");
      }
    };
    allUsers();
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="p-4">
          <h1 className="text-xl font-bold">Gestion des Utilisateurs</h1>
        </div>

        <div className="text-gray-900 bg-gray-200">
          <div className="px-3 py-4 flex justify-center">
            {users.length === 0 ? (
              <div className="w-full text-center py-8 bg-white shadow-md rounded">
                <p className="text-gray-500 text-lg">Aucun utilisateur disponible pour le moment</p>
              </div>
            ) : (
            <table className="w-full text-md bg-white shadow-md rounded mb-4">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Name</th>
                  <th className="text-left p-3 px-5">Email</th>
                  <th className="text-left p-3 px-5">Role</th>
                  <th>Action</th>
                </tr>
                {users.map((user) => (
                  <tr key={user.id} className="border-b bg-gray-100">
                    <td className="p-3 px-5">{user.name}</td>
                    <td className="p-3 px-5">{user.email}</td>
                    <td className="p-3 px-5 text-green-300">
                      {user.roles[0].name}
                    </td>
                    <td className="p-3 px-5 flex justify-end">
                      {((user?.roles?.[0]?.name || "").toLowerCase() !== "admin") && (
                        <>
                          <button
                            type="button"
                            className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                          >
                            Éditer
                          </button>
                          <button
                            type="button"
                            className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => { setSelectedUserId(user.id); setIsOpen(true); }}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                <Modal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onConfirm={() => {
                    console.log("delete user");
                    setIsOpen(false);
                  }}
                  user_id={selectedUserId}
                />
              </tbody>
            </table>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
