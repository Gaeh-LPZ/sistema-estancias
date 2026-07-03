"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 1. Definimos la lista de documentos generales requeridos
const documentosGenerales = [
    { id: "cv", nombre: "CV (Currículum Vitae)", descripcion: "Formato PDF actualizado con tus datos e historial" },
    { id: "credencial", nombre: "Credencial de la Universidad", descripcion: "Identificación oficial UMAR por ambos lados" },
    { id: "seguro", nombre: "Vigencia de Seguro Social", descripcion: "Constancia de vigencia de derechos del IMSS" },
    { id: "aceptacion", nombre: "Carta de Aceptación", descripcion: "Emitida y firmada por la entidad receptora" },
    { id: "informe", nombre: "Informe Final", descripcion: "Reporte global de actividades desarrolladas" },
    { id: "evaluacion", nombre: "Evaluación Control Final", descripcion: "Formato de evaluación firmado por el asesor" },
    { id: "liberacion", nombre: "Carta de Liberación", descripcion: "Documento oficial de conclusión de la empresa" },
];

// 2. Definimos los reportes semanales
const reportesSemanales = [
    { numero: 1, periodo: "01 Oct - 07 Oct", estado: "Pendiente" },
    { numero: 2, periodo: "08 Oct - 14 Oct", estado: "Pendiente" },
    { numero: 3, periodo: "15 Oct - 21 Oct", estado: "Pendiente" },
    { numero: 4, periodo: "22 Oct - 28 Oct", estado: "Pendiente" },
];

interface DocumentosProps {
    correoUsuario: string;
    documentosIniciales: Record<string, { estado: string; url: string }>;
}

export default function Documentos({ correoUsuario, documentosIniciales }: DocumentosProps) {
    const router = useRouter();
    const [subiendo, setSubiendo] = useState<string | null>(null);

    const [estadosDocs, setEstadosDocs] = useState<Record<string, { estado: string; url: string }>>(documentosIniciales);

    const manejarSubida = async (e: React.ChangeEvent<HTMLInputElement>, idDocumento: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("El archivo supera el límite de 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setSubiendo(idDocumento);
        const toastId = toast.loading(`Subiendo documento...`);

        try {
            const res = await fetch(`http://localhost:8000/api/estudiantes/documentos/${correoUsuario}/${idDocumento}`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Error en el servidor");

            const data = await res.json();
            toast.success("¡Documento subido correctamente!", { id: toastId });

            // Actualizamos el estado local
            setEstadosDocs((prev) => ({
                ...prev,
                [idDocumento]: { estado: "Cargado", url: data.url }
            }));

            router.refresh();

        } catch (error) {
            toast.error("Error al subir el documento", { id: toastId });
        } finally {
            setSubiendo(null);
        }
    };

    const abrirCartaPresentacion = () => {
        // Usamos el endpoint de tu backend pasando el correo del usuario actual
        window.open(`http://localhost:8000/api/estudiantes/carta-presentacion/${correoUsuario}`, '_blank');
    };


    return (
        <div className="max-w-300 mx-auto flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
            {/* Cabecera y Barra de Progreso */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <p className="text-xs text-blue-950 mb-1 uppercase tracking-wider font-semibold">Expediente Digital</p>
                    <h2 className="text-2xl font-medium">Documentación del Estudiante</h2>
                </div>
                <div className="bg-white border border-gray-300 rounded-full px-6 py-1.5 flex items-center gap-3 shadow-sm">
                    <span className="text-xs font-medium">Progreso Global:</span>
                    <div className="w-32 h-2 bg-[#eceef0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1e3a8a] w-[0%] rounded-full transition-all duration-500"></div>
                    </div>
                    <span className="text-xs font-bold text-blue-900">0%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* COLUMNA IZQUIERDA (7 cols): Documentos Generales y de Cierre */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden flex flex-col bg-white">
                        <div className="p-6 border-b border-gray-300 bg-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium">Expediente de Documentos Oficiales</h3>
                                <p className="text-sm text-gray-500 mt-1">Sube tus archivos en formato PDF o JPG (Máx. 5MB por archivo).</p>
                            </div>
                            <span className="material-symbols-outlined text-[#757682] text-[28px]">folder_shared</span>
                        </div>
                        
                        <ul className="divide-y divide-gray-200">
                            {documentosGenerales.map((doc) => {
                                const docInfo = estadosDocs[doc.id];
                                const estadoActual = docInfo?.estado || "Pendiente";

                                return (
                                    <li key={doc.id} className="p-4 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors bg-[#f7f9fb]">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#eceef0] flex items-center justify-center text-gray-700 font-bold shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">description</span>
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-semibold text-gray-800">{doc.nombre}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{doc.descripcion}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 shrink-0">
                                            {/* Badge de Estado Dinámico */}
                                            {estadoActual === "Pendiente" && (
                                                <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">pending</span> Pendiente
                                                </span>
                                            )}
                                            {estadoActual === "Cargado" && (
                                                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">hourglass_empty</span> Cargado
                                                </span>
                                            )}
                                            {estadoActual === "Aprobado" && (
                                                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">check_circle</span> Aprobado
                                                </span>
                                            )}
                                            {estadoActual === "En Revisión" && (
                                                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">error</span> Rechazado
                                                </span>
                                            )}

                                            {/* Botón Dinámico: Subir o Visualizar */}
                                            {estadoActual === "Pendiente" || estadoActual === "En Revisión" ? (
                                                <label className={`transition-colors px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm ${subiendo === doc.id ? 'bg-gray-400 text-white' : 'bg-[#1e3a8a] text-white hover:bg-[#00236f]'}`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {subiendo === doc.id ? 'hourglass_empty' : 'upload'}
                                                    </span>
                                                    {estadoActual === "En Revisión" ? "Volver a subir" : "Subir"}
                                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => manejarSubida(e, doc.id)} />
                                                </label>
                                            ) : (
                                                <a
                                                    href={`http://localhost:8000/api/estudiantes/documentos/${correoUsuario}/${doc.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#505f76] hover:text-blue-950 transition-colors p-2 rounded-full hover:bg-[#eceef0] flex items-center justify-center cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* COLUMNA DERECHA (5 cols): Carta de Presentación y Reportes Semanales */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    {/* Tarjeta Azul: Carta de Presentación Generada */}
                    <div className="bg-[#1e3a8a] text-[#90a8ff] rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#90a8ff]/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Carta de Presentación</h3>
                                <span className="px-3 py-0.5 rounded-full bg-white text-[#1e3a8a] text-xs font-bold inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">verified</span> Emitida por UMAR
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-[#90a8ff]/20 flex items-center justify-center backdrop-blur-sm text-white">
                                <span className="material-symbols-outlined text-[28px]">contact_mail</span>
                            </div>
                        </div>
                        <div className="relative z-10 bg-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-md mb-6 text-white">
                            <div className="flex justify-between items-center text-xs">
                                <span>Documento Oficial Generado</span>
                                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                            </div>
                        </div>
                        <button
                            onClick={abrirCartaPresentacion}
                            type="button"
                            className="relative z-10 w-full bg-white text-[#1e3a8a] py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            Descargar / Previsualizar
                        </button>
                    </div>

                    {/* Contenedor de Reportes Semanales */}
                    <div className="rounded-xl border border-gray-300 shadow-sm overflow-hidden flex flex-col bg-white flex-1">
                        <div className="p-6 border-b border-gray-300 bg-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium">Reportes Semanales</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Bitácora de actividades y horas cumplidas.</p>
                            </div>
                            <span className="material-symbols-outlined text-[#757682] text-[24px]">calendar_month</span>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {reportesSemanales.map((rep) => (
                                    <li
                                        key={rep.numero}
                                        className="p-3.5 md:px-6 md:py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors bg-[#f7f9fb]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-lg bg-[#eceef0] flex items-center justify-center font-bold text-sm text-gray-700">
                                                {rep.numero}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-semibold text-gray-800">Semana {rep.numero}</p>
                                                <p className="text-xs text-gray-500">{rep.periodo}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <span className="px-2 py-0.5 rounded-full bg-[#e0e3e5] text-gray-700 text-xs font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">pending</span> Pendiente
                                            </span>

                                            <label className="bg-[#1e3a8a] text-white hover:bg-[#00236f] transition-colors px-3 py-1 rounded text-xs font-medium flex items-center gap-1 cursor-pointer shadow-sm">
                                                <span className="material-symbols-outlined text-[14px]">upload</span> Subir
                                                <input type="file" className="hidden" accept=".pdf" />
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}