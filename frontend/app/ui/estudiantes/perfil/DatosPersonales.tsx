"use client";
import { useState } from "react";
import { toast } from "sonner";
import { EstudianteInfo } from "@/app/types/estudiantes/types";
import { useRouter } from "next/navigation";

export default function DatosPersonales({isEditing, correoEstudiante, datosIniciales }: {isEditing: boolean, correoEstudiante: string, datosIniciales: EstudianteInfo }) {
  const [campoExitoso, setCampoExitoso] = useState<string>("");
  const [datosEstudiante, setDatosEstudiante] = useState<EstudianteInfo>(datosIniciales);
  const router = useRouter();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosEstudiante(prev => ({ ...prev, [name]: value }));
  };

  const manejarGuardado = async (nombreCampo: string, valor: string) => {
    if (valor.trim() === "") {
      toast.error("El campo no puede estar vacío");
      return;
    }

    const toastId = toast.loading(`Guardando...`);

    try {
      const datosAEnviar = { [nombreCampo]: valor };

      const response = await fetch(`http://localhost:8000/api/estudiantes/perfil/${correoEstudiante}`, {
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
    <div className="col-span-2 row-span-2 outline outline-gray-300 rounded-md">
      <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
        <span className="material-symbols-outlined text-secondary">person</span>
        <h3 className="text-xl font-semibold">Datos Personales</h3>
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex flex-row w-full justify-between gap-3">
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Nombre(s)
            <input 
              onChange={manejarCambio} 
              onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
              value={datosEstudiante.nombre || ""} 
              disabled={!isEditing} 
              type="text" 
              name="nombre" 
              placeholder="Ana Laura" 
              className={getInputClass("nombre")}
            />
          </label>
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Apellidos
            <input 
              onChange={manejarCambio} 
              onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
              value={datosEstudiante.apellidos || ""} 
              disabled={!isEditing} 
              type="text" 
              name="apellidos" // Corregido: minúscula
              placeholder="Morales Díaz" 
              className={getInputClass("apellidos")} // Corregido: apuntando a apellidos
            />
          </label>
        </div>
        <div className="flex flex-row w-full justify-between gap-3">
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Fecha de nacimiento
            <input 
              onChange={manejarCambio} 
              onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
              value={datosEstudiante.fecha_nacimiento || ""} 
              disabled={!isEditing} 
              type="date" 
              name="fecha_nacimiento" 
              className={getInputClass("fecha_nacimiento")} // Corregido
            />
          </label>
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Género
            <input 
              onChange={manejarCambio} 
              onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
              value={datosEstudiante.genero || ""} 
              disabled={!isEditing} 
              type="text" 
              name="genero" 
              placeholder="Femenino" 
              className={getInputClass("genero")} // Corregido
            />
          </label>
        </div>
        <label className="flex flex-col w-full text-xs gap-1.5">CURP
          <input 
            onChange={manejarCambio} 
            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
            value={datosEstudiante.curp || ""} 
            disabled={!isEditing} 
            type="text" 
            name="curp" 
            placeholder="MODA000815MOXRRRA1" 
            className={getInputClass("curp")} // Corregido
          />
        </label>
        <label className="flex flex-col w-full text-xs gap-1.5">NSS (Número de Seguridad Social)
          <input 
            onChange={manejarCambio} 
            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)} 
            value={datosEstudiante.nss || ""} 
            disabled={!isEditing} 
            type="text" 
            name="nss" 
            placeholder="78945612301" 
            className={getInputClass("nss")} // Corregido
          />
        </label>
      </div>
    </div>
  );
}