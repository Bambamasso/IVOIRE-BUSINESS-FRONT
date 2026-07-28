"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../layaut";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import CreateSlider from "@/components/modal/add_slider";

export default function Silder() {
  const [slides, setSlides] = useState([]);
  const [pagination, setPagination] = useState({});
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getSlides = async (page = 1) => {
    
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/slides?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data.data.data || [];
      setSlides(data);
      setPagination(response.data?.data || {});
      //  console.log("Slides récupérés:", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des slides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSlides();
  }, []);

  const  enableSlide = async (id) => {
//   console.log("ID du slide à activer:", id);

  try{
    const token = JSON.parse(localStorage.getItem("admin_token"));
    console.log("Token d'authentification:", token);
    const response= await axios.patch(`${baseUrl}/api/admin/slides/enable/${id}`,{},{
       
        headers: {
            Authorization: `Bearer ${token}`,
        } 

    })
    if(response.status === 200) {
      getSlides();
      toast.success('Slide activé avec succès!');
    }
  }catch(error) {
    console.error("Erreur lors de l'activation du slide:", error);
  }finally{
    setLoading(false);
  }
  }

  const disableSlide= async(id)=>{
 try{
    const token = JSON.parse(localStorage.getItem("admin_token"));
    const response= await axios.patch(`${baseUrl}/api/admin/slides/disable/${id}`,{},{
        headers: {
            Authorization: `Bearer ${token}`,
        } 

    })
    if(response.status === 200) {
        getSlides();
        toast.success('Slide désactivé avec succès!');
    }
  }catch(error) {
    console.error("Erreur lors de la désactivation du slide:", error);
  }finally{
    setLoading(false);
  }
  }
  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* En-tête Responsive (S'empile sur mobile, côte à côte sur PC) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">
              Gestion de la Bannière
            </h1>
          </div>
          <button
            onClick={() => setOpenCreate(true)} // Correction ici : openCreate était une variable, pas la fonction setOpenCreate
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <IoAdd size={18} /> AJOUTER UNE BANNIÈRE
          </button>
        </div>

        {/* loader pendant le chargement des données */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            Chargement des bannières...
          </div>
        ) : (
          /* Grille Ultra-Responsive 
             1 colonne sur mobile, 2 sur tablette, 3 sur petit écran PC, 4 sur grand écran PC */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {slides.map((slide) => {
              // Sécurité : On vérifie si la valeur est 1 (ou "1") pour l'activer
              const isActive = Number(slide.is_active) === 1;

              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full"
                >
                  {/* Zone de l'image */}
                  <div className="bg-[#f5f4ee] h-48 flex items-center justify-center relative w-full overflow-hidden">
                    {slide.media ? (
                      <img
                        src={`${baseUrl}/storage/${slide.media[0].file_path}`}
                        alt={slide.file_name || "Slide"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Zone d'informations et boutons */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                    {/* Statut et Nom du fichier */}
                    <div className="space-y-2">
                      <div>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 bg-[#edf7ed] text-[#2e7d32] text-xs font-medium px-2.5 py-1 rounded-full border border-[#c3e6cb]">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#fdf2f2] text-[#c81e1e] text-xs font-medium px-2.5 py-1 rounded-full border border-[#fbd5d5]">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772m0 0a10.451 10.451 0 0 1-5.772 1.728c-4.756 0-8.773-3.162-10.065-7.498a10.522 10.522 0 0 1 4.293-5.774M17.772 17.772l1.356 1.357"
                              />
                            </svg>
                            Inactif
                          </span>
                        )}
                      </div>

                      <p
                        className="text-gray-600 font-medium text-sm truncate"
                        title={slide.title}
                      >
                        {slide.title}
                      </p>
                    </div>

                    {/* Les Boutons d'actions */}
                    <div className="flex gap-2 mt-auto">
                      {isActive ? (
                        <button onClick={() => disableSlide(slide.id)} className="flex-grow flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 px-3 text-xs md:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772m0 0a10.451 10.451 0 0 1-5.772 1.728c-4.756 0-8.773-3.162-10.065-7.498a10.522 10.522 0 0 1 4.293-5.774M17.772 17.772l1.356 1.357"
                            />
                          </svg>
                          Désactiver
                        </button>
                      ) : (
                        <button onClick={() => enableSlide(slide.id)} className="flex-grow flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 px-3 text-xs md:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          Activer
                        </button>
                      )}

                      {/* <button className="border border-gray-300 rounded-xl p-2.5 bg-white hover:bg-gray-50 text-gray-600 hover:text-red-600 active:bg-gray-100 transition-colors flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          {pagination.last_page > 1 && (
          <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() =>getSlides(p)}
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
        {/* Modal de création */}
        <CreateSlider
         isOpen={openCreate}
         onClose={() => setOpenCreate(false)}
         refreshSlides={getSlides}
        />

    </AdminLayout>
  );
}
