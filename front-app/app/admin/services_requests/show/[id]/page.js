"use client";
import AdminLayout from "@/app/admin/layaut";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as React from "react";
import {
  RiArrowLeftLine,
  RiFileList3Line,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
  RiPriceTag3Line,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { MdOutlineAttachFile, MdOutlineFileUpload } from "react-icons/md";
import {
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileAudio,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
} from "react-icons/fa";
import RejectRequest from "@/components/modal/reject_Request";
import ValidateServiceRequest from "@/components/modal/validate_service_request";
import Link from "next/link";

const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400";

const STATUS_LABELS = {
  pending: "En attente",
  validated: "Validée",
  "in-progress": "En cours",
  completed: "Terminée",
  cancelled: "Refusée",
};

export default function ServiceRequestDetailPage({ params }) {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openReject, setOpenReject] = useState(false);
  const [openValidate, setOpenValidate] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { id } = React.use(params);

  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n || 0);

  const fetchDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(
        `${baseUrl}/api/admin/service-requests/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRequest(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAction = async (endpoint, payload = {}) => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.patch(
        `${baseUrl}/api/admin/service-requests/${endpoint}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === "success") {
        toast.success(response.data.message);
        fetchDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
        </div>
      </AdminLayout>
    );

  if (!request)
    return (
      <AdminLayout>
        <div className="p-20 text-center text-red-500 font-bold">
          Demande introuvable ou erreur de chargement.
        </div>
      </AdminLayout>
    );

  const statusCode = request.status?.code;
  const clientFiles = request.media || [];
  const statusLabel = STATUS_LABELS[statusCode] || request.status?.name;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Barre retour */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            <RiArrowLeftLine size={18} /> Retour aux demandes
          </button>
        </div>

        {/* Bandeau demande */}
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#7fa359] to-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20">
          <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center text-white/50">
              <RiFileList3Line size={40} />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                {request.created_at
                  ? new Date(request.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date inconnue"}
              </span>
              <h1 className="mt-1 text-3xl font-black leading-tight">
                Demande {request.request_number}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  <RiCheckboxCircleLine size={13} />
                  {statusLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {request.service?.name}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Fact
                icon={RiPriceTag3Line}
                label="Prix final"
                value={
                  request.final_price ? (
                    <>
                      {fmt(request.final_price)}
                      <span className="ml-1 text-xs font-medium text-white/60">
                        FCFA
                      </span>
                    </>
                  ) : (
                    "À définir"
                  )
                }
              />
              <Fact
                icon={MdOutlineAttachFile}
                label="Documents"
                value={
                  <>
                    {clientFiles.length}
                    <span className="ml-1 text-xs font-medium text-white/60">
                      fichier{clientFiles.length > 1 ? "s" : ""}
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Bande de statistiques */}
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <Kpi
            icon={RiPriceTag3Line}
            value={
              request.propose_price ? `${fmt(request.propose_price)} F` : "Aucun"
            }
            label="Budget proposé"
          />
          <Kpi icon={RiPhoneLine} value={request.phone_number || "—"} label="Téléphone" />
          <Kpi icon={RiMailLine} value={request.email || "—"} label="Email" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${labelCls} mb-6`}>Informations client</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem
                  icon={<RiUserLine />}
                  label="Nom complet"
                  value={request.full_name}
                />
                <DetailItem
                  icon={<RiMailLine />}
                  label="Email"
                  value={request.email}
                />
                <DetailItem
                  icon={<RiPhoneLine />}
                  label="Téléphone"
                  value={request.phone_number}
                />
                <DetailItem
                  icon={<RiMapPinLine />}
                  label="Adresse"
                  value={request.address}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${labelCls} mb-4`}>Description du besoin</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {request.details || "Aucun détail supplémentaire fourni."}
              </p>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${labelCls} mb-6`}>Tarification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className={labelCls}>Budget estimé par le client</p>
                  <p className="mt-2 text-xl font-black text-gray-900">
                    {request.propose_price
                      ? `${fmt(request.propose_price)} FCFA`
                      : "Aucun"}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className={labelCls}>Prix final du service</p>
                  <p className="mt-2 text-xl font-black text-[#93b86a]">
                    {request.final_price
                      ? `${fmt(request.final_price)} FCFA`
                      : "En attente"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className={labelCls}>Documents fournis</h2>
                <span className="rounded-full bg-[#93b86a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#93b86a]">
                  {clientFiles.length}
                </span>
              </div>

              {clientFiles.length > 0 ? (
                <div className="space-y-3">
                  {clientFiles.map((file, index) => (
                    <div
                      key={file.id || index}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <FileTypeIcon file={file} />
                      <Link
                        href={`${baseUrl}/storage/${file.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 truncate text-sm font-semibold text-gray-800"
                      >
                        {file.name || file.file_name || `Document ${index + 1}`}
                      </Link>
                      <a
                        href={`${baseUrl}/storage/${file.file_path}`}
                        download={
                          file.file_name || file.name || `Document_${index + 1}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#93b86a] hover:text-[#6f8f4e] transition-colors"
                        title="Télécharger le document"
                      >
                        <MdOutlineFileUpload
                          className="rounded-xl bg-[#93b86a]/10 p-1"
                          size={28}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-300">
                  Aucun document fourni.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
              <h2 className={labelCls}>Actions de gestion</h2>

              {(statusCode === "pending" || statusCode === "validated") && (
                <div className="flex flex-col gap-3">
                  {statusCode === "pending" && (
                    <button
                      onClick={() => setOpenValidate(true)}
                      className="w-full py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-all"
                    >
                      Valider la demande
                    </button>
                  )}
                  {statusCode === "validated" && (
                    <button
                      onClick={() => handleAction("start-processing")}
                      className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all"
                    >
                      Mettre en cours de traitement
                    </button>
                  )}
                  <button
                    onClick={() => setOpenReject(true)}
                    className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-red-50 transition-all"
                  >
                    Refuser la demande
                  </button>
                </div>
              )}

              {statusCode === "in-progress" && (
                <button
                  onClick={() => handleAction("complete")}
                  className="w-full py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#93b86a]/20 hover:scale-[1.02] transition-all"
                >
                  Marquer comme terminée
                </button>
              )}

              {(statusCode === "completed" || statusCode === "cancelled") && (
                <div
                  className={`p-6 rounded-2xl text-center border-2 ${statusCode === "completed" ? "bg-[#93b86a]/10 border-[#93b86a]/20" : "bg-red-50 border-red-100"}`}
                >
                  <p
                    className={`font-black text-sm uppercase ${statusCode === "completed" ? "text-[#93b86a]" : "text-red-500"}`}
                  >
                    {statusCode === "completed"
                      ? "Demande Terminée"
                      : "Demande Refusée"}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <ValidateServiceRequest
        openValidate={openValidate}
        onClose={() => setOpenValidate(false)}
        requestId={request.id}
        onRefresh={fetchDetails}
      />
      <RejectRequest
        openReject={openReject}
        onClose={() => setOpenReject(false)}
        requestId={request.id}
        onRefresh={fetchDetails}
      />
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
      <div className="min-w-0">
        <p className="truncate text-lg font-black text-gray-900 leading-tight">
          {value}
        </p>
        <p className={labelCls}>{label}</p>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f7f0] text-[#93b86a]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className={labelCls}>{label}</p>
        <p className="text-sm font-bold text-gray-800 wrap-break-word">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function getFileExtension(file) {
  const fileName = file.file_name || file.name || file.file_path || "";
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return ext;
}

function FileTypeIcon({ file }) {
  const ext = getFileExtension(file);
  const iconProps = {
    className: "text-2xl shrink-0",
  };

  if (["pdf"].includes(ext)) {
    return <FaFilePdf {...iconProps} />;
  }
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "heic"].includes(
      ext,
    )
  ) {
    return <FaFileImage {...iconProps} />;
  }
  if (["doc", "docx", "odt", "rtf", "txt", "md"].includes(ext)) {
    return <FaFileWord {...iconProps} />;
  }
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) {
    return <FaFileExcel {...iconProps} />;
  }
  if (["ppt", "pptx", "odp"].includes(ext)) {
    return <FaFilePowerpoint {...iconProps} />;
  }
  if (["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(ext)) {
    return <FaFileArchive {...iconProps} />;
  }
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"].includes(ext)) {
    return <FaFileAudio {...iconProps} />;
  }
  if (["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v"].includes(ext)) {
    return <FaFileVideo {...iconProps} />;
  }
  if (
    [
      "js", "jsx", "ts", "tsx", "html", "css", "json", "php", "py", "java",
      "c", "cpp", "h", "rb", "go", "rs", "sql", "sh", "yml", "yaml", "xml",
    ].includes(ext)
  ) {
    return <FaFileCode {...iconProps} />;
  }
  if (["txt", "md", "log"].includes(ext)) {
    return <FaFileAlt {...iconProps} />;
  }
  return <FaFile {...iconProps} />;
}
