"use client";

import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layaut";
import CreateProject from "@/components/modal/add_project";
import EditProject from "@/components/modal/edit_project";
import DeleteProject from "@/components/modal/delete_project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/projects?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProjects(response.data?.data?.data || []);
      setPagination(response.data?.data || {});
    } catch (error) {
      console.error("Erreur projets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des projets
            </h1>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <IoAdd size={18} /> AJOUTER UN PROJET
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <th className="px-8 py-6">Localisation</th>
                  <th className="px-6 py-6 text-center">Tâche réalisé</th>
                  <th className="px-8 py-6">Année de réalisation</th>
                  <th className="px-8 py-6 text-right">Client</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Chargement ...
                    </td>
                  </tr>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <tr
                      key={project.id}
                      className="group hover:bg-[#93b86a]/5 transition-colors"
                    >
                      {/* NOM */}
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-gray-900 leading-tight">
                          {project.location}
                        </p>
                      </td>

                      {/* PRIX */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#93b86a]/10 text-[#93b86a] text-sm font-black">
                          {project.task}
                        </span>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-8 py-5">
                        <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs italic">
                          {project.year || "Pas d'année défini pour ce projet."}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs text-gray-500 font-medium line-clamp-1 max-w-xs italic">
                          {project.client ||
                            "Pas de client défini pour ce projet."}
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              // setSelectedProjectId(project.id);
                              setSelectedProject(project);
                              setOpenEdit(true);
                            }}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                            title="Modifier"
                          >
                            <IoPencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(project);
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Aucun projet trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION STYLE PROJECT REQUEST */}
          {pagination.last_page > 1 && (
            <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProjects(p)}
                  className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all ${
                    pagination.current_page === p
                      ? "bg-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20"
                      : "bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#e8d393]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        <CreateProject
          onClose={() => setOpenCreate(false)}
          openCreate={openCreate}
          refresh={fetchProjects}
        />
        <EditProject
          onClose={() => setOpenEdit(false)}
          openEdit={openEdit}
          refresh={fetchProjects}
          project={selectedProject}
        />
        <DeleteProject
          onClose={() => setOpenDelete(false)}
          openDelete={openDelete}
          refresh={fetchProjects}
          project={selectedProject}
        />
      </div>
    </AdminLayout>
  );
}
