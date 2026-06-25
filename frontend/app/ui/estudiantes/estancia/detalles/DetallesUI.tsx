"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HeaderDetalles from "@/app/ui/estudiantes/estancia/detalles/HeaderDetalles";
import Detalles from "@/app/ui/estudiantes/estancia/detalles/Detalles";

interface DetallesUIProps {
    correoUsuario: string;
    datos: any;
}

export default function DetallesUI({ correoUsuario, datos }: DetallesUIProps) {
    const router = useRouter();
    const [enviando, setEnviando] = useState(false);

    // Verificamos si el estado actual ya es "Pendiente" o "Validado" 
    // para deshabilitar el botón y evitar re-envíos
    const yaEnviado = datos?.estudiante?.status === "Pendiente" || datos?.estudiante?.status === "Validado";

    const manejarEnvio = async () => {
        setEnviando(true);
        const toastId = toast.loading("Enviando solicitud para validación...");

        try {
            const response = await fetch(`http://localhost:8000/api/estudiantes/estancias/${correoUsuario}/enviar`, {
                method: "PATCH",
            });

            if (!response.ok) throw new Error("Error en el servidor");

            toast.success("¡Solicitud enviada con éxito!", { id: toastId });
            router.refresh(); // Refresca los datos para que el estado se actualice en la pantalla
        } catch (error) {
            toast.error("Hubo un error al enviar la solicitud", { id: toastId });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto flex-1 p-10 md:p-margin-8 bg-[#f2f4f6] w-5/6">
            <HeaderDetalles />
            
            <Detalles datos={datos} />
            
            <div className="flex flex-row bg-white mt-6 items-center justify-between p-4 rounded-lg border border-[#c5c5d3]">
                <div className="flex flex-row w-1/2 gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#00236f]" data-icon="info">info</span>
                    <p>
                        {yaEnviado 
                            ? "Tu solicitud ya ha sido enviada y está en revisión." 
                            : <>Al confirmar, la solicitud pasará a estado de <strong>Pendiente de validación</strong></>}
                    </p>
                </div>
                <div className="flex flex-row gap-2.5">
                    {/* Ocultamos el botón de editar si ya se envió la solicitud */}
                    {!yaEnviado && (
                        <button className="flex flex-row items-center gap-1 border border-[#c5c5d3] p-2 rounded-md hover:scale-105 transition-all transform cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                            Editar Información
                        </button>
                    )}
                    
                    {/* Botón de Enviar dinámico */}
                    <button 
                        onClick={manejarEnvio}
                        disabled={enviando || yaEnviado}
                        className={`flex flex-row items-center text-white gap-1 p-2 rounded-md transition-all transform ${
                            yaEnviado ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e3a8a] hover:scale-105 cursor-pointer'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]" data-icon="send">send</span>
                        {yaEnviado ? "Solicitud Enviada" : enviando ? "Enviando..." : "Confirmar y enviar"}
                    </button>
                </div>
            </div>
        </div>
    );
}