"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../layaut";
import {
  IoAdd,
  IoPencil,
  IoTrash,
  IoChevronDown,
  IoChevronForward,
} from "react-icons/io5";
import AddAttribute from "@/components/modal/add_attribute";
import EditAttribute from "@/components/modal/edit_attribute";
import DeleteAttribute from "@/components/modal/delete_attribute";
import AddAttributeValue from "@/components/modal/add_attribute_value";
import EditAttributeValue from "@/components/modal/edit_attribute_value";
import DeleteAttributeValue from "@/components/modal/delete_attribute_value";

export default function AttributesPage() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [selectedValue, setSelectedValue] = useState(null);
  const [openValueCreate, setOpenValueCreate] = useState(false);
  const [openValueEdit, setOpenValueEdit] = useState(false);
  const [openValueDelete, setOpenValueDelete] = useState(false);
  const [valueAttributeId, setValueAttributeId] = useState(null);
  const [isCollor, setIsCollor] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/settings/attributes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttributes(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les caractéristiques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Gestion des Caractéristiques
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Couleurs, tailles et autres caractéristiques de produits
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <IoAdd size={18} /> AJOUTER
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 text-center text-gray-400 font-bold italic">
            Chargement ...
          </div>
        ) : attributes.length > 0 ? (
          <div className="space-y-4">
            {attributes.map((attribute) => {
              const values = attribute.values || [];
              const isOpen = expandedId === attribute.id;
              return (
                <div
                  key={attribute.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpand(attribute.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleExpand(attribute.id);
                      }
                    }}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#93b86a]/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {isOpen ? (
                        <IoChevronDown className="text-gray-400" size={18} />
                      ) : (
                        <IoChevronForward
                          className="text-gray-400"
                          size={18}
                        />
                      )}
                      <div>
                        <p className="text-sm font-black text-gray-900">
                          {attribute.name}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                          {values.length} valeur{values.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setSelectedAttribute(attribute);
                          setOpenEdit(true);
                        }}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                        title="Modifier"
                      >
                        <IoPencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAttribute(attribute);
                          setOpenDelete(true);
                        }}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                        title="Supprimer"
                      >
                        <IoTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/40 p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Valeurs de {attribute.name}
                        </p>
                        <button
                          onClick={() => {
                            setValueAttributeId(attribute.id);
                            setOpenValueCreate(true);
                            setIsCollor(attribute.name)
                          }}
                          className="flex items-center gap-1.5 bg-[#93b86a] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-[1.02] transition-transform"
                        >
                          <IoAdd size={14} /> Ajouter une valeur
                        </button>
                      </div>

                      {values.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {values.map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between gap-2 bg-white rounded-xl border border-gray-100 px-4 py-3"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {v["hex-code"] && (
                                  <span
                                    className="h-5 w-5 shrink-0 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: v["hex-code"] }}
                                  />
                                )}
                                <span className="text-sm font-bold text-gray-800 truncate">
                                  {v.value}
                                </span>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedValue(v);
                                    setIsCollor(attribute.name);
                                    setOpenValueEdit(true);
                                  }}
                                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-[#93b86a] hover:bg-[#93b86a]/10 transition-all"
                                  title="Modifier"
                                >
                                  <IoPencil size={15} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedValue(v);
                                    setOpenValueDelete(true);
                                  }}
                                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                  title="Supprimer"
                                >
                                  <IoTrash size={15} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
                          Aucune valeur pour cette caractéristique.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 text-center text-gray-400 font-bold italic">
            Aucune caractéristique trouvée.
          </div>
        )}
      </div>

      <AddAttribute
        openCreate={openCreate}
        onClose={() => setOpenCreate(false)}
        onRefresh={fetchAttributes}
      />
      <EditAttribute
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        attribute={selectedAttribute}
        onRefresh={fetchAttributes}
      />
      <DeleteAttribute
        openDelete={openDelete}
        onClose={() => setOpenDelete(false)}
        attribute={selectedAttribute}
        onRefresh={fetchAttributes}
      />

      <AddAttributeValue
        openCreate={openValueCreate}
        onClose={() => setOpenValueCreate(false)}
        attributeId={valueAttributeId}
        collor={isCollor}
        onRefresh={fetchAttributes}
      />
      <EditAttributeValue
        openEdit={openValueEdit}
        onClose={() => setOpenValueEdit(false)}
        attributeValue={selectedValue}
        collor={isCollor}
        onRefresh={fetchAttributes}
      />
      <DeleteAttributeValue
        openDelete={openValueDelete}
        onClose={() => setOpenValueDelete(false)}
        attributeValue={selectedValue}
        onRefresh={fetchAttributes}
      />
    </AdminLayout>
  );
}
