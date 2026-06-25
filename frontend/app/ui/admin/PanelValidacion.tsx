"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PanelValidacionProps {
    correo: string;
    iniciales: string;
    nombre: string;
    matricula: string;
}

export default function PanelValidacion({ correo, iniciales, nombre, matricula }: PanelValidacionProps) {
    const router = useRouter();
    const [procesando, setProcesando] = useState(false);

    const manejarValidacion = async (accion: 'aprobar' | 'rechazar') => {
        setProcesando(true);
        const toastId = toast.loading(accion === 'aprobar' ? "Aprobando expediente..." : "Rechazando expediente...");

        try {
            const res = await fetch(`http://localhost:8000/api/admin/estudiantes/${correo}/validar`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion })
            });

            if (!res.ok) throw new Error("Error en el servidor");

            toast.success(accion === 'aprobar' ? "¡Expediente aprobado exitosamente!" : "Expediente devuelto para revisión", { id: toastId });
            
            // Regresamos a la tabla de admin
            router.push("/admin/estudiantes");
            router.refresh(); 

        } catch (error) {
            toast.error("Ocurrió un error al procesar la solicitud", { id: toastId });
            setProcesando(false);
        }
    };

    return (
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col border-r border-gray-300 bg-[#f7f9fb] overflow-y-auto relative z-10 shrink-0">
            <div className="p-6 pb-4 sticky top-0 backdrop-blur-sm z-20 border-b border-gray-300">
                <Link href="/admin/estudiantes" className="flex items-center text-xs hover:text-[#00236f] transition-colors mb-4 gap-1">
                    <span className="material-symbols-outlined text-xs" data-icon="arrow_back">arrow_back</span>
                    Volver a lista de validación
                </Link>
                <h2 className="text-[20px] leading-7 font-bold mb-1">Validación de Expediente</h2>
                <p className="text-sm text-gray-500">Revisa los documentos requeridos para aprobar la estancia.</p>
            </div>
            <div className="p-6 pt-4 border-b border-gray-300">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 shrink-0 bg-white/60 flex items-center justify-center">
                        <span className="text-[#00236f] font-bold text-[20px] uppercase">{iniciales}</span>
                    </div>
                    <div className="flex-1">
                         <h3 className="font-semibold text-lg">{nombre}</h3>
                         <p className="text-sm text-gray-600">{matricula}</p>
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <input type="checkbox" className="w-5 h-5 cursor-pointer accent-[#1e3a8a]"/>
                        <label className="text-sm font-medium text-gray-700 flex flex-col cursor-pointer">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-gray-500" data-icon="inventory_2">inventory_2</span>
                                Marcar entrega de documento físico en oficina
                            </span>
                        </label>
                    </div>
                    <div className="flex items-center gap-1 w-full lg:w-auto justify-end mt-4 lg:mt-0">
                        <button 
                            onClick={() => manejarValidacion('rechazar')}
                            disabled={procesando}
                            className="bg-white text-red-600 border border-red-200 font-label-md text-sm font-bold py-2 px-6 rounded-lg hover:bg-red-50 shadow-sm transition-all flex items-center gap-2 h-10 shrink-0 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[16px]" data-icon="close">close</span>
                            Rechazar
                        </button>
                        <div className="w-px h-8 bg-gray-300 mx-1 hidden lg:block"></div>
                        <button 
                            onClick={() => manejarValidacion('aprobar')}
                            disabled={procesando}
                            className="bg-[#1e3a8a] text-white font-label-md text-sm font-bold py-2 px-6 rounded-lg hover:opacity-90 shadow-sm transition-all flex items-center gap-2 h-10 shrink-0 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]" data-icon="check_circle">check_circle</span>
                            Aprobar Documento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}