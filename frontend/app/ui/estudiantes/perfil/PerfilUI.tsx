"use client";

import { useState } from "react";
import DatosPersonales from "@/app/ui/estudiantes/perfil/DatosPersonales";
import Contacto from "@/app/ui/estudiantes/perfil/Contacto";
import InformacionAcademica from "@/app/ui/estudiantes/perfil/InformacionAcademica";
import Domicilio from "@/app/ui/estudiantes/perfil/Domicilio";
import { PerfilUIProps } from "@/app/types/estudiantes/types";

export default function PerfilUI({ correoUsuario, datosPerfil }: PerfilUIProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { estudiante, datos_personales, contacto, domicilio } = datosPerfil;

    return (
        <section className="w-screen xl:max-w-5/6 overflow-y-auto">
            <header className="flex flex-row p-10 items-center justify-between border-b border-gray-400">
                <div className="flex flex-row gap-5 items-center">
                    <p className="text-4xl font-bold w-20 h-20 md:w-24 md:h-24 rounded-md bg-[#b6c4ff] border-4 border-[#f7f9fb] flex items-center justify-center shadow-sm">
                        {estudiante?.nombre?.substring(0, 2).toUpperCase() || "ST"}
                    </p>
                    <div className="flex flex-col gap-0.5">
                        <h1 className="font-semibold text-2xl md:text-[28px] mb-1">
                            {estudiante?.nombre} {estudiante?.apellidos || ""}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">badge</span>{estudiante?.matricula || "Sin Matrícula"}</span>
                            <span className="hidden sm:inline text-outline">•</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">mail</span> {correoUsuario}</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => setIsEditing(!isEditing)} className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-[#90a8ff] px-4 py-2 rounded-lg font-medium text-xs hover:bg-[#00236f] transition-colors shadow-sm self-start md:self-auto w-full md:w-auto">
                    <span className="material-symbols-outlined text-xs">edit</span>
                    {isEditing ? "Guardar Cambios" : "Editar Perfil"}
                </button>
            </header>

            <div className="grid grid-cols-3 grid-rows-4 p-7 gap-3">
                <DatosPersonales correoEstudiante={correoUsuario} isEditing={isEditing} datosIniciales={{
                    nombre: estudiante?.nombre || "",
                    apellidos: estudiante?.apellidos || "",
                    fecha_nacimiento: datos_personales?.fecha_nacimiento || "",
                    genero: datos_personales?.genero || "",
                    curp: datos_personales?.curp || "",
                    nss: datos_personales?.nss || ""
                }} />
                <Contacto correoUsuario={correoUsuario} isEditing={isEditing} datosPerfil={{
                    correo_alternativo: contacto?.correo_alternativo || "",
                    telefono: contacto?.telefono || "",
                    telefono_emergencia: contacto?.telefono_emergencia || ""
                }} />
                <InformacionAcademica matricula={estudiante.matricula} grupo={estudiante.grupo} carrera={estudiante.carrera}/>
                <Domicilio isEditing={isEditing} />
            </div>
        </section>
    );
}