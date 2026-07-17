"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IContacto } from "@/app/types/estudiantes/types";
import { API_BASE_URL } from "@/app/lib/config";

interface ContactoProps {
    isEditing: boolean;
    correoUsuario: string;
    datosPerfil: IContacto;
}

export default function Contacto({ isEditing, correoUsuario, datosPerfil }: ContactoProps) {
    const [contactoEstudiante, setContactoEstudiante] = useState<IContacto>(datosPerfil)
    const [campoExitoso, setCampoExitoso] = useState<string>("");
    const router = useRouter();

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setContactoEstudiante(prev => ({ ...prev, [name]: value }));
    };

    const manejarGuardado = async (nombreCampo: string, valor: string) => {
        if (valor.trim() === "") {
            toast.error("El campo no puede estar vacío");
            return;
        }

        const toastId = toast.loading(`Guardando...`);

        try {
            const datosAEnviar = { [nombreCampo]: valor };

            const response = await fetch(`${API_BASE_URL}/api/estudiantes/perfil/${correoUsuario}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosAEnviar),
            });

            if (!response.ok) {
                throw new Error("Error en el servidor");
            }

            toast.success("¡Guardado correctamente!", { id: toastId });

            setCampoExitoso(nombreCampo);
            setTimeout(() => {
                setCampoExitoso("");
            }, 2000);

            router.refresh();

        } catch (error) {
            toast.error("Hubo un problema al guardar", { id: toastId });
        }
    };

    const baseInputClass = "w-full border p-2 outline-none rounded transition-colors shadow-sm";

    const getInputClass = (nombreCampo: string) => {
        return `${baseInputClass} ${campoExitoso === nombreCampo
            ? "border-green-500 bg-green-50 ring-2 ring-green-200"
            : "border-gray-300 focus:border-blue-500"
            }`;
    };

    return (
        <div className="row-span-2 outline outline-gray-300 rounded-md">
            <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                <span className="material-symbols-outlined text-secondary">contact_phone</span>
                <h3 className="text-xl font-semibold">Contacto</h3>
            </div>
            <div className="flex flex-col p-4 gap-1.5">
                <label className="flex flex-col text-xs gap-1.5 w-full">Correo Institucional
                    <input
                        value={correoUsuario}
                        disabled
                        type="email"
                        name="correo"
                        placeholder="amorales@gs.aulavirtual.mx"
                        className={getInputClass("correo")}
                    />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Correo Alternativo
                    <input
                        onChange={manejarCambio}
                        onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                        value={contactoEstudiante.correo_alternativo || ""}
                        disabled={!isEditing}
                        type="email"
                        name="correo_alternativo"
                        placeholder="ana.laura.99@gmail.com"
                        className={getInputClass("correo_alternativo")}
                    />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Teléfono Móvil
                    <input
                        onChange={manejarCambio}
                        onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                        value={contactoEstudiante.telefono || ""}
                        disabled={!isEditing}
                        type="tel"
                        name="telefono"
                        placeholder="958 123 4567"
                        className={getInputClass("telefono")} />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Teléfono de Emergencia
                    <input
                        onChange={manejarCambio}
                        onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                        value={contactoEstudiante.telefono_emergencia || ""}
                        disabled={!isEditing}
                        type="tel"
                        name="telefono_emergencia"
                        placeholder="958 765 4328"
                        className={getInputClass("telefono_emergencia")} />
                </label>
            </div>
        </div>
    );
}