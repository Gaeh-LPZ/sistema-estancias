"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
// IMPORTAMOS TU COMPONENTE DE DETALLES
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
    datosEstudiante: any; // Recibimos los datos para el componente Detalles
}

export default function PanelValidacion({ correoEstudiante, nombreEstudiante, documentos, datosEstudiante }: PanelValidacionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const docQuery = searchParams.get("doc");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState("");

    const docsSeguros = documentos || [];

    // Creamos un "Documento Falso" que representará la pestaña de Detalles
    const tabDetalles = {
        id: "detalles_formulario",
        nombre: "Información de Estancia",
        estado: datosEstudiante?.estudiante?.status || "Pendiente",
        url: ""
    };

    // Unimos los detalles con los documentos para la lista lateral
    const menuLateral = [tabDetalles, ...docsSeguros];

    const [docSeleccionado, setDocSeleccionado] = useState<Documento | null>(
        menuLateral.find(d => d.id === docQuery) || menuLateral[0]
    );

    useEffect(() => {
        if (docQuery) {
            const docEncontrado = menuLateral.find(d => d.id === docQuery);
            if (docEncontrado) setDocSeleccionado(docEncontrado);
        }
    }, [docQuery]);

    const actualizarEstado = async (nuevoEstado: string, motivo: string | null = null) => {
        if (!docSeleccionado) return;

        // Si el administrador hizo clic en "Rechazar" pero el modal aún no se abre
        if (nuevoEstado === "En Revisión" && modalAbierto === false) {
            setMotivoRechazo(""); // Limpiamos el texto
            setModalAbierto(true); // Abrimos la pestañita
            return; // Detenemos la ejecución aquí
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
                // AHORA ENVIAMOS EL MOTIVO EN EL JSON
                body: JSON.stringify({ estado: nuevoEstado, motivo: motivo }),
            });

            if (!res.ok) throw new Error("Error del servidor");

            toast.success(`Marcado como ${nuevoEstado.toLowerCase()}`, { id: toastId });
            setModalAbierto(false); // Cerramos el modal si estaba abierto
            router.refresh();
            setDocSeleccionado(prev => prev ? { ...prev, estado: nuevoEstado } : null);

        } catch (error) {
            toast.error("Hubo un problema al actualizar el estado", { id: toastId });
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-80px)] gap-4 p-4 md:p-6 bg-gray-50">

            {/* PANEL IZQUIERDO: Menú Lateral */}
            <div className="w-1/3 xl:w-1/4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-100 flex items-center gap-3">
                    <Link href="/admin/estudiantes" className="p-1 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600">arrow_back</span>
                    </Link>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-800 truncate" title={nombreEstudiante}>
                            {nombreEstudiante}
                        </h3>
                        <p className="text-xs text-gray-500">Expediente Digital</p>
                    </div>
                </div>

                <ul className="overflow-y-auto flex-1 divide-y divide-gray-100">
                    {menuLateral.map((doc) => (
                        <li
                            key={doc.id}
                            onClick={() => setDocSeleccionado(doc)}
                            className={`p-4 cursor-pointer transition-colors flex justify-between items-center border-l-4 ${docSeleccionado?.id === doc.id
                                    ? "bg-blue-50 border-blue-600"
                                    : "hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {/* Ponemos un icono distinto para el formulario */}
                                {doc.id === "detalles_formulario" && (
                                    <span className="material-symbols-outlined text-[18px] text-blue-800">assignment_ind</span>
                                )}
                                <span className={`font-medium text-sm truncate ${docSeleccionado?.id === doc.id ? "text-blue-900" : "text-gray-700"}`}>
                                    {doc.nombre}
                                </span>
                            </div>

                            {/* Indicadores Visuales */}
                            {doc.estado === "Pendiente" && <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" title="Pendiente"></span>}
                            {doc.estado === "Cargado" || doc.estado === "En Proceso" ? <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse shrink-0" title="Requiere Validación"></span> : null}
                            {(doc.estado === "Aprobado" || doc.estado === "Validado") && <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" title="Aprobado"></span>}
                            {doc.estado === "En Revisión" && <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" title="Rechazado"></span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* PANEL DERECHO: El Visor Dinámico */}
            <div className="w-2/3 xl:w-3/4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                {docSeleccionado ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-3 bg-white z-10 shadow-sm">
                            <div>
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                    {docSeleccionado.nombre}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Estado: <span className="font-semibold text-gray-700">{docSeleccionado.estado}</span>
                                </p>
                            </div>

                            <div className="flex gap-2">
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
                                    disabled={docSeleccionado.estado === "Aprobado" || docSeleccionado.estado === "Validado"}
                                    className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Aprobar
                                </button>
                            </div>
                        </div>

                        {/* RENDERIZADO CONDICIONAL: Detalles vs PDF */}
                        <div className="flex-1 overflow-hidden relative bg-[#525659]">
                            {docSeleccionado.id === "detalles_formulario" ? (
                                <div className="w-full h-full overflow-y-auto bg-[#f2f4f6] p-6">
                                    {/* Aquí inyectamos tu componente original intacto */}
                                    <Detalles datos={datosEstudiante} />
                                </div>
                            ) : docSeleccionado.estado !== "Pendiente" ? (
                                <iframe
                                    src={`http://localhost:8000/api/estudiantes/documentos/${correoEstudiante}/${docSeleccionado.id}`}
                                    className="w-full h-full border-none"
                                    title={`Visor de ${docSeleccionado.nombre}`}
                                />
                            ) : (
                                <div className="flex w-full h-full flex-col items-center justify-center text-gray-300 bg-gray-50">
                                    <span className="material-symbols-outlined text-6xl mb-4">find_in_page</span>
                                    <p className="text-lg font-medium text-gray-500">Documento no disponible</p>
                                    <p className="text-sm text-gray-400">El estudiante aún no ha subido este archivo.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>

            {modalAbierto && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                                Motivo de Rechazo
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Escribe por qué estás rechazando <strong>{docSeleccionado?.nombre}</strong>. El estudiante verá este mensaje.
                            </p>
                        </div>

                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            placeholder="Ej. El documento está borroso, te faltó la firma en la página 2..."
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => actualizarEstado("En Revisión", motivoRechazo)}
                                disabled={motivoRechazo.trim() === ""}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}