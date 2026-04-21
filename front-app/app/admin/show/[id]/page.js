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

export default function AdminProductShow({ params }) {
  const { id } = React.use(params);
  // console.log(id);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
        .get(`${baseUrl}/api/products/${id}`, {
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
    return <div>Chargement...</div>;
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
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              <RiEditBoxLine size={18} /> Modifier le produit
            </button>
            <button
              onClick={() => {
                setOpenDeleteModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <RiDeleteBinLine size={18} /> Supprimer
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
            <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 p-8">
              <h3 className="text-xl font-black mb-6">Variantes disponibles</h3>
              <div className="space-y-4">
                {(product.variants ?? []).map((v) => (
                  <div
                    key={v.id}
                    className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl"
                  >
                    {(v.attributValues ?? []).map((av) => (
                      <div key={av.id}>
                        <span className="font-bold text-lg">{av.value}</span>

                        <p className="text-sm text-gray-500 font-medium">
                          Référence :
                        </p>
                      </div>
                    ))}
                    <div className="text-right">
                      <span className="block font-black text-[#93b86a]">
                        {v.price || product.price} FCFA
                      </span>
                      <span className="text-xs font-bold px-2 py-1 bg-white rounded-lg border border-gray-200">
                        Stock : {v.stock_quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : Infos clés (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-gray-200 text-white p-10 rounded-[2.5rem] shadow-2xl">
                {/* <span className="text-[#93b86a] font-black uppercase text-xs tracking-[0.2em]">{product.category}</span> */}
                <h1 className="text-4xl font-black mt-2 leading-tight">
                  {product.title}
                </h1>
                <p className="text-gray-400 mt-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                      Prix de base
                    </p>
                    <p className="text-3xl font-black text-[#93b86a] mt-1">
                      {product.price} <span className="text-sm">FCFA</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                      Stock Total
                    </p>
                    <p className="text-3xl font-black text-white mt-1">
                      {product.stock_quantity}{" "}
                      <span className="text-sm text-gray-500">Unités</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Statut rapide */}
            </div>
          </div>
        </div>
        {/* Modal de confirmation de suppression */}
        <DeleteProduct
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          product_id={product?.id}
        />
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
      </div>
    </AdminLayout>
  );
}
