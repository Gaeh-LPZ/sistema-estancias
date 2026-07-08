"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Detalles from "@/app/ui/estudiantes/estancia/detalles/Detalles";

interface Documento {
    id: string;
    nombre: string;
    estado: string;
    url: string;
}

interface PanelValidacionProps {
    correoEstudiante: string;
    nombreEstudiante: string;
    documentos: Documento[];
    datosEstudiante: any;
}

export default function PanelValidacion({ correoEstudiante, nombreEstudiante, documentos, datosEstudiante }: PanelValidacionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const docQuery = searchParams.get("doc");

    const docsSeguros = documentos || [];
    const tabDetalles = {
        id: "detalles_formulario",
        nombre: "Información de Estancia",
        estado: datosEstudiante?.estudiante?.status || "Pendiente",
        url: ""
    };
    const menuLateral = [tabDetalles, ...docsSeguros];

    const [docSeleccionado, setDocSeleccionado] = useState<Documento | null>(
        menuLateral.find(d => d.id === docQuery) || menuLateral[0]
    );

    // Estados de Modales
    const [modalRechazoAbierto, setModalRechazoAbierto] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState("");

    // NUEVO ESTADO PARA EL MODAL DE SUBIDA/FÍSICO
    const [modalSubidaAbierto, setModalSubidaAbierto] = useState(false);
    const [archivoAdmin, setArchivoAdmin] = useState<File | null>(null);

    useEffect(() => {
        if (docQuery) {
            const docEncontrado = menuLateral.find(d => d.id === docQuery);
            if (docEncontrado) setDocSeleccionado(docEncontrado);
        }
    }, [docQuery]);

    // Función para APROBAR, RECHAZAR O MARCAR FÍSICO
    const actualizarEstado = async (nuevoEstado: string, motivo: string | null = null) => {
        if (!docSeleccionado) return;

        if (nuevoEstado === "En Revisión" && modalRechazoAbierto === false) {
            setMotivoRechazo("");
            setModalRechazoAbierto(true);
            return;
        }

        const toastId = toast.loading(`Actualizando a ${nuevoEstado}...`);

        try {
            let urlApi = `http://localhost:8000/api/admin/documentos/${correoEstudiante}/${docSeleccionado.id}/estado`;
            if (docSeleccionado.id === "detalles_formulario") {
                urlApi = `http://localhost:8000/api/admin/estudiantes/${correoEstudiante}/estado`;
            }

            const res = await fetch(urlApi, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado, motivo: motivo }),
            });

            if (!res.ok) throw new Error("Error del servidor");

            toast.success(`Marcado como ${nuevoEstado}`, { id: toastId });
            setModalRechazoAbierto(false);
            setModalSubidaAbierto(false);
            router.refresh();
            setDocSeleccionado(prev => prev ? { ...prev, estado: nuevoEstado } : null);

        } catch (error) {
            toast.error("Hubo un problema al actualizar el estado", { id: toastId });
        }
    };

    // NUEVA FUNCIÓN PARA QUE EL ADMIN SUBA EL PDF
    const manejarSubidaAdmin = async () => {
        if (!archivoAdmin || !docSeleccionado) return;
        const toastId = toast.loading("Subiendo documento al servidor...");

        const formData = new FormData();
        formData.append("file", archivoAdmin);

        try {
            const res = await fetch(`http://localhost:8000/api/admin/documentos/${correoEstudiante}/${docSeleccionado.id}`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Error al subir");

            toast.success("Documento subido y aprobado", { id: toastId });
            setModalSubidaAbierto(false);
            setArchivoAdmin(null);
            router.refresh();
            setDocSeleccionado(prev => prev ? { ...prev, estado: "Aprobado" } : null);
        } catch (error) {
            toast.error("Error al subir el archivo", { id: toastId });
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-80px)] gap-4 p-4 md:p-6 bg-gray-50 relative">

            {/* PANEL IZQUIERDO */}
            <div className="w-1/3 xl:w-1/4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden z-10">
                {/* ... (Tu cabecera del panel izquierdo igual que antes) ... */}
                <div className="p-4 border-b border-gray-200 bg-gray-100 flex items-center gap-3">
                    <Link href="/admin/estudiantes" className="p-1 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600">arrow_back</span>
                    </Link>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-800 truncate" title={nombreEstudiante}>{nombreEstudiante}</h3>
                        <p className="text-xs text-gray-500">Expediente Digital</p>
                    </div>
                </div>

                <ul className="overflow-y-auto flex-1 divide-y divide-gray-100">
                    {menuLateral.map((doc) => (
                        <li
                            key={doc.id}
                            onClick={() => setDocSeleccionado(doc)}
                            className={`p-4 cursor-pointer transition-colors flex justify-between items-center border-l-4 ${docSeleccionado?.id === doc.id ? "bg-blue-50 border-blue-600" : "hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {doc.id === "detalles_formulario" && <span className="material-symbols-outlined text-[18px] text-blue-800">assignment_ind</span>}
                                <span className={`font-medium text-sm truncate ${docSeleccionado?.id === doc.id ? "text-blue-900" : "text-gray-700"}`}>
                                    {doc.nombre}
                                </span>
                            </div>

                            {/* Añadimos el color para Entregado en Físico */}
                            {doc.estado === "Pendiente" && <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" title="Pendiente"></span>}
                            {(doc.estado === "Cargado" || doc.estado === "En Proceso") && <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse shrink-0" title="Requiere Validación"></span>}
                            {(doc.estado === "Aprobado" || doc.estado === "Validado") && <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" title="Aprobado"></span>}
                            {doc.estado === "En Revisión" && <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" title="Rechazado"></span>}
                            {doc.estado === "Entregado en Físico" && <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" title="Físico"></span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* PANEL DERECHO */}
            <div className="w-2/3 xl:w-3/4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden z-10">
                {docSeleccionado ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-3 bg-white shadow-sm">
                            <div>
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">{docSeleccionado.nombre}</h4>
                                <p className="text-sm text-gray-500">
                                    Estado: <span className="font-semibold text-gray-700">{docSeleccionado.estado}</span>
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* NUEVO BOTÓN: SUBIR / FÍSICO */}
                                {docSeleccionado.id !== "detalles_formulario" && (
                                    <button
                                        onClick={() => setModalSubidaAbierto(true)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                                        Gestionar
                                    </button>
                                )}

                                <button
                                    onClick={() => actualizarEstado("En Revisión")}
                                    disabled={docSeleccionado.estado === "En Revisión"}
                                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                    Rechazar
                                </button>
                                <button
                                    onClick={() => actualizarEstado("Aprobado")}
                                    disabled={docSeleccionado.estado === "Aprobado" || docSeleccionado.estado === "Entregado en Físico" || docSeleccionado.estado === "Validado"}
                                    className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Aprobar
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative bg-[#525659]">
                            {docSeleccionado.id === "detalles_formulario" ? (
                                <div className="w-full h-full overflow-y-auto bg-[#f2f4f6] p-6">
                                    <Detalles datos={datosEstudiante} />
                                </div>
                            ) : docSeleccionado.estado !== "Pendiente" ? (
                                <iframe
                                    src={`http://localhost:8000/api/estudiantes/documentos/${correoEstudiante}/${docSeleccionado.id}`}
                                    className="w-full h-full border-none"
                                />
                            ) : (
                                <div className="flex w-full h-full flex-col items-center justify-center text-gray-300 bg-gray-50">
                                    <span className="material-symbols-outlined text-6xl mb-4">find_in_page</span>
                                    <p className="text-lg font-medium text-gray-500">Documento no disponible</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>

            {/* MODAL 1: MOTIVO DE RECHAZO (El que ya teníamos) */}
            {modalRechazoAbierto && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                                Motivo de Rechazo
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Escribe por qué rechazas <strong>{docSeleccionado?.nombre}</strong>.</p>
                        </div>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            placeholder="Ej. El documento está borroso..."
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => setModalRechazoAbierto(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancelar</button>
                            <button onClick={() => actualizarEstado("En Revisión", motivoRechazo)} disabled={motivoRechazo.trim() === ""} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1">
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: NUEVA VENTANITA DE GESTIÓN (SUBIR O FÍSICO) */}
            {modalSubidaAbierto && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-5">

                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Gestionar Documento</h3>
                                <p className="text-sm text-gray-500 mt-1">Opciones para <strong>{docSeleccionado?.nombre}</strong></p>
                            </div>
                            <button onClick={() => setModalSubidaAbierto(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Opción A: Subir PDF */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Opción 1: Subir PDF escaneado</p>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setArchivoAdmin(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3 cursor-pointer"
                            />
                            <button
                                onClick={manejarSubidaAdmin}
                                disabled={!archivoAdmin}
                                className="w-full py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#00236f] transition-colors disabled:opacity-50"
                            >
                                Subir y Aprobar
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <hr className="flex-1 border-gray-200" />
                            <span className="text-xs text-gray-400 font-medium uppercase">O</span>
                            <hr className="flex-1 border-gray-200" />
                        </div>

                        {/* Opción B: Entregado en Físico */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-purple-50 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-purple-600 text-3xl mb-2">folder_shared</span>
                            <p className="text-sm font-semibold text-purple-900 mb-1">Opción 2: Entregado en oficina</p>
                            <p className="text-xs text-purple-700 mb-3">El estudiante entregó el documento original físicamente.</p>
                            <button
                                onClick={() => actualizarEstado("Entregado en Físico")}
                                className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                Marcar como Entregado en Físico
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}