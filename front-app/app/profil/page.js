"use client";
import EditProfile from "@/components/modal/edite_profile";
import EditProfileModal from "@/components/modal/edite_profile";
import Navbar from "@/components/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [error, setError] = useState(null);

  // Fonction pour rafraîchir le profil
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = baseUrl + "/api/users/infos/profile";
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${JSON.parse(token)}` : undefined,
          Accept: "application/json",
        },
      });
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(data);
      console.log('PROFILE DATA:', data);
    } catch (err) {
      setError("Erreur lors du chargement du profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Profil</h1>

        {/* Section Informations Personnelles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations Personnelles</h2>
          {loading ? (
            <div className="text-gray-500">Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : profile && profile.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {profile.data.name || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {profile.data.email || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {profile.data.number || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'inscription</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {profile.data.created_at ? new Date(profile.data.created_at).toLocaleDateString() : "-"}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Section Actions */}
        <div className="border-t pt-6">
          <button
            onClick={() => {
              setEditOpen(true);
              setName(profile?.data?.name);
              setEmail(profile?.data?.email);
              setNumber(profile?.data?.number);
            }}
            className="bg-[#93b86a] text-white px-6 py-2 rounded-lg  transition-colors"
          >
            Modifier le profil
          </button>
        </div>
        
      </div>
      <EditProfile
        editOpen={editOpen}
        onClose={() => setEditOpen(false)}
        name={name}
        email={email}
        number={number}
        onSuccess={() => {
          setEditOpen(false);
          fetchProfile();
        }}
      />
    </>
  );
}