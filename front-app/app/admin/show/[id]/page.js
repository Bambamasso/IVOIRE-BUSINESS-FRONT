"use client";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEditBoxLine,
  RiPriceTag3Line,
  RiStackLine,
  RiCheckboxCircleLine,
  RiImage2Line,
  RiListSettingsLine,
  RiBox3Line,
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
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const media = product.media ?? [];
  const variants = product.variants ?? [];
  const totalStock =
    product.stock_quantity ??
    variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
  const statusName = product.status?.name || "Non défini";
  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n || 0);

  const labelCls =
    "text-[10px] font-bold uppercase tracking-widest text-gray-400";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Barre d'actions (tout à gauche) */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            <RiArrowLeftLine size={18} /> Retour aux produits
          </Link>
          <span className="mx-1 h-4 w-px bg-gray-200" />
          <button
            onClick={() => setOpenEditModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#93b86a] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#93b86a]/20 transition-all hover:bg-[#7fa359]"
          >
            <RiEditBoxLine size={16} /> Modifier le produit
          </button>
        </div>

        {/* Bandeau produit — large, aligné à gauche */}
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#7fa359] to-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20">
          <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
            {/* Visuel principal */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10">
              {media[0] ? (
                <img
                  src={`${baseUrl}/storage/${media[0].file_path}`}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/50">
                  <RiBox3Line size={40} />
                </div>
              )}
            </div>

            {/* Identité */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                {product.categorie?.name || "Sans catégorie"}
              </span>
              <h1 className="mt-1 text-3xl font-black leading-tight">
                {product.title}
              </h1>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <RiCheckboxCircleLine size={13} />
                {statusName}
              </span>
            </div>

            {/* Faits clés */}
            <div className="flex flex-wrap gap-6 border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Fact
                icon={RiPriceTag3Line}
                label="Prix de base"
                value={
                  <>
                    {fmt(product.price)}
                    <span className="ml-1 text-xs font-medium text-white/60">
                      FCFA
                    </span>
                  </>
                }
              />
              <Fact
                icon={RiStackLine}
                label="Stock total"
                value={
                  <>
                    {totalStock}
                    <span className="ml-1 text-xs font-medium text-white/60">
                      u.
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Bande de statistiques */}
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <Kpi icon={RiImage2Line} value={media.length} label="Images" />
          <Kpi
            icon={RiListSettingsLine}
            value={variants.length}
            label="Variantes"
          />
          <Kpi icon={RiStackLine} value={totalStock} label="Stock total" />
        </div>

        {/* Description */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className={`${labelCls} mb-4`}>Description</h2>
          {product.description ? (
            <p className="max-w-4xl whitespace-pre-line wrap-break-word text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          ) : (
            <p className="text-sm italic text-gray-300">Aucune description.</p>
          )}
        </section>

        {/* Galerie */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={labelCls}>Galerie photos</h2>
            <span className="text-xs font-bold text-gray-400">
              {media.length} image{media.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {media.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
              >
                <img
                  src={`${baseUrl}/storage/${img.file_path}`}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => {
                    setOpenDeleteMediaModal(true);
                    setSelectedMediaId(img.id);
                  }}
                  className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-500 opacity-0 shadow-md backdrop-blur transition-opacity group-hover:opacity-100"
                  title="Supprimer l'image"
                >
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setOpenAddMediaModal(true)}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition-colors hover:border-[#93b86a] hover:text-[#93b86a]"
            >
              <RiAddLine size={26} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Ajouter
              </span>
            </button>
          </div>
        </section>

        {/* Variantes */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={labelCls}>Variantes</h2>
            <span className="rounded-full bg-[#93b86a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#93b86a]">
              {variants.length} combinaison{variants.length > 1 ? "s" : ""}
            </span>
          </div>

          {variants.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-10 text-center text-sm text-gray-400">
              Aucune variante — le stock est géré sur le produit principal.
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-colors hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {(v.attribut_values ?? []).map((av) => (
                      <div key={av.id} className="flex items-center gap-3">
                        {av["hex-code"] && av["hex-code"] !== "#00000000" && (
                          <span
                            className="h-7 w-7 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: av["hex-code"] }}
                            title={av.value}
                          />
                        )}
                        <div>
                          <p className={labelCls}>
                            {av.attribute?.name || "Option"}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {av.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0">
                    <div>
                      <p className={labelCls}>Stock</p>
                      <span
                        className={`text-sm font-bold ${
                          v.stock_quantity > 0
                            ? "text-gray-900"
                            : "text-red-500"
                        }`}
                      >
                        {v.stock_quantity || 0} u.
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div>
                      <p className={labelCls}>Prix</p>
                      <span className="text-sm font-bold text-gray-900">
                        {fmt(v.price || product.price)}
                        <span className="ml-1 text-xs font-medium text-gray-400">
                          FCFA
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modales */}
        <DeleteMedia
          isOpen={openDeleteMediaModal}
          onClose={() => setOpenDeleteMediaModal(false)}
          media_id={selectedMediaId}
          product_id={product?.id}
        />
        <CreateMedia
          isOpen={openAddMediaModal}
          onClose={() => setOpenAddMediaModal(false)}
          product_id={product?.id}
        />
        <EditProduct
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          product={product}
        />
      </div>
    </AdminLayout>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          {label}
        </p>
        <p className="text-lg font-black leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#93b86a]/10 text-[#93b86a]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}
