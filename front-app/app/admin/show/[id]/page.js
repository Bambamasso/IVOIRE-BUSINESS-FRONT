"use client";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEditBoxLine,
} from "react-icons/ri";
import AdminLayout from "../../layaut";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";
import DeleteProduct from "@/components/modal/delete_product";
import DeleteMedia from "@/components/modal/delete_media";
import CreateMedia from "@/components/modal/add_media";
import EditProduct from "@/components/edit_product";

export default function AdminProductShow({ params }) {
  const { id } = React.use(params);
  // console.log(id);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteMediaModal, setOpenDeleteMediaModal] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [openAddMediaModal, setOpenAddMediaModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = JSON.parse(localStorage.getItem("admin_token"));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(`${baseUrl}/api/admin/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setProduct(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  if (!product) {
    return (
      <AdminLayout>
        <div className="p-10 text-center font-bold">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8">
        {/* Barre de navigation haute */}
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-bold"
          >
            <RiArrowLeftLine size={20} /> Retour aux produits
          </Link>
          <div className="flex gap-4">
            <button  onClick={()=>setOpenEditModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              <RiEditBoxLine size={18} /> Modifier le produit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* COLONNE GAUCHE : Médias et Variantes */}
          <div className="lg:col-span-7 space-y-12">
            {/* Section Images */}
            <section>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                Galerie Photos{" "}
                <span className="text-sm text-gray-400 font-medium">
                  ({product?.media?.length || 0})
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.media.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-3xl overflow-hidden group"
                  >
                    <img
                      src={`${baseUrl}/storage/${img.file_path}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setOpenDeleteMediaModal(true);
                        setSelectedMediaId(img.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur shadow-xl rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setOpenAddMediaModal(true);
                  }}
                  className="aspect-square border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-[#93b86a] hover:text-[#93b86a] transition-all bg-gray-50/50"
                >
                  <RiAddLine size={32} />
                  <span className="text-xs font-black uppercase mt-2">
                    Ajouter
                  </span>
                </button>
              </div>
            </section>

            {/* Section Variantes */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900">
                  Variantes du produit
                </h3>
                <div className="px-4 py-1.5 bg-[#93b86a]/10 rounded-xl">
                  <span className="text-[#93b86a] text-[10px] font-black uppercase tracking-widest">
                    {product.variants?.length || 0} Combinaisons
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {(product.variants ?? []).map((v) => (
                  <div
                    key={v.id}
                    className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40 rounded-[2rem] transition-all duration-300 gap-6"
                  >
                    {/* Caractéristiques de la variante */}
                    <div className="flex flex-wrap gap-8">
                      {(v.attribut_values ?? []).map((av) => (
                        <div key={av.id} className="flex items-center gap-4">
                          {/* Affichage de la pastille de couleur si c'est un attribut "Couleur" */}
                          {av["hex-code"] && av["hex-code"] !== "#00000000" && (
                            <div
                              className="w-10 h-10 rounded-full border-4 border-white shadow-md"
                              style={{ backgroundColor: av["hex-code"] }}
                              title={av.value}
                            />
                          )}

                          <div className="flex flex-col">
                            {/* Le nom vient de av.attribute.name (ex: Couleur) */}
                            <p className="text-[10px] text-[#93b86a] font-black uppercase tracking-[0.2em] mb-0.5">
                              {av.attribute?.name || "Option"}
                            </p>
                            <p className="font-black text-gray-900 text-lg leading-tight">
                              {av.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Prix et Stock */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                          Disponibilité
                        </p>
                        <span
                          className={`text-sm font-black px-3 py-1 rounded-lg ${
                            v.stock_quantity > 0
                              ? "bg-white text-gray-900 border border-gray-100"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {v.stock_quantity || 0} unités
                        </span>
                      </div>

                      <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>

                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                          Prix
                        </p>
                        <span className="text-xl font-black text-gray-900">
                          {/* Utilise le prix de la variante, sinon celui du parent */}
                          {new Intl.NumberFormat("fr-FR").format(
                            v.price || product.price || 0,
                          )}
                          <span className="text-xs ml-1 text-gray-400 font-medium">
                            FCFA
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : Infos clés (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              {/* Carte Noire Premium */}
              <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] shadow-2xl shadow-black/10">
                <span className="text-[#93b86a] font-black uppercase text-[10px] tracking-[0.3em]">
                  {product.categorie?.name || "Produit standard"}
                </span>

                <h1 className="text-4xl font-black text-white mt-4 leading-tight">
                  {product.title}
                </h1>

                <p className="text-gray-400 mt-6 leading-relaxed text-sm break-words max-h-40 overflow-auto">
                  {product.description}
                </p>

                <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      Prix de base
                    </p>
                    <p className="text-3xl font-black text-[#93b86a] mt-1">
                      {new Intl.NumberFormat("fr-FR").format(product.price)}{" "}
                      <span className="text-sm font-medium text-gray-500">
                        FCFA
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      Stock Total
                    </p>
                    <p className="text-3xl font-black text-white mt-1">
                      {product.stock_quantity ||
                        (product.variants ?? []).reduce(
                          (acc, v) => acc + (v.stock_quantity || 0),
                          0,
                        )}
                      <span className="text-sm font-medium text-gray-500 ml-2">
                        Unités
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge de statut rapide en dessous */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  État du stock
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    product.stock_quantity > 0 || product.variants?.length > 0
                      ? "bg-[#93b86a]/10 text-[#93b86a]"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.stock_quantity > 0 || product.variants?.length > 0
                    ? "Disponible"
                    : "En rupture"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Modal de confirmation de suppression */}

        <DeleteMedia
          isOpen={openDeleteMediaModal}
          onClose={() => setOpenDeleteMediaModal(false)}
          media_id={selectedMediaId}
          product_id={product?.id}
        />
        {/* Modal d'ajout de média */}
        <CreateMedia
          isOpen={openAddMediaModal}
          onClose={() => setOpenAddMediaModal(false)}
          product_id={product?.id}
        />
         <EditProduct 
         isOpen={openEditModal}
         onClose={()=>setOpenEditModal(false)}
         product={product}
         
         />
      </div>
    </AdminLayout>
  );
}
