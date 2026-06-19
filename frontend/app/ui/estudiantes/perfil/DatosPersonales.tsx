"use client";
import { useState } from "react";
import { toast } from "sonner";
import { EstudianteInfo } from "@/app/types/estudiantes/types";
import { useRouter } from "next/navigation";
import { extraerDatosCurp } from "@/app/lib/actions";

export default function DatosPersonales({ isEditing, correoEstudiante, datosIniciales }: { isEditing: boolean, correoEstudiante: string, datosIniciales: EstudianteInfo }) {
  const [campoExitoso, setCampoExitoso] = useState<string>("");
  const [datosEstudiante, setDatosEstudiante] = useState<EstudianteInfo>(datosIniciales);
  const router = useRouter();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setDatosEstudiante(prev => {
      const nuevosDatos = { ...prev, [name]: value };

      if (name === "curp") {
        nuevosDatos[name] = value.toUpperCase();
        if (value.length === 18) {
          const extraidos = extraerDatosCurp(value);
          if (extraidos) {
            nuevosDatos.fecha_nacimiento = extraidos.fechaNacimiento;
            toast.success("¡Fecha de nacimiento extraída de la CURP!");
          }
        }
      }

      return nuevosDatos;
    });
  };

  const manejarGuardado = async (nombreCampo: string, valor: string, datosAdicionales: Record<string, any> = {}) => {
    if (valor.trim() === "") {
      toast.error("El campo no puede estar vacío");
      return;
    }

    const toastId = toast.loading(`Guardando...`);

    try {
      const datosAEnviar = { [nombreCampo]: valor, ...datosAdicionales };

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
              name="apellidos"
              placeholder="Morales Díaz"
              className={getInputClass("apellidos")}
            />
          </label>
        </div>
        <label className="flex flex-col w-full text-xs gap-1.5">CURP
          <input
            onChange={manejarCambio}
            onBlur={(e) => {
              const curpVal = e.target.value.toUpperCase();
              let extras = {};
              if (curpVal.length === 18) {
                const extraidos = extraerDatosCurp(curpVal);
                if (extraidos) {
                  extras = {
                    fecha_nacimiento: extraidos.fechaNacimiento,
                    lugar_nacimiento: extraidos.estadoOrigen
                  };
                }
              }
              manejarGuardado(e.target.name, curpVal, extras);
            }}
            value={datosEstudiante.curp || ""}
            disabled={!isEditing}
            type="text"
            name="curp"
            maxLength={18}
            placeholder="MODA000815MOXRRRA1"
            className={getInputClass("curp")}
          />
        </label>
        <div className="flex flex-row w-full justify-between gap-3">
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Fecha de nacimiento
            <input
              onChange={manejarCambio}
              value={datosEstudiante.fecha_nacimiento || ""}
              disabled
              type="date"
              name="fecha_nacimiento"
              className={getInputClass("fecha_nacimiento")}
            />
          </label>
          <label className="flex flex-col w-1/2 text-xs gap-1.5">Género
            <select
              name="genero"
              value={datosEstudiante.genero || ""}
              onChange={manejarCambio}
              onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
              disabled={!isEditing}
              className={getInputClass("genero")}
            >
              <option value="" disabled>Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No Binario">No Binario</option>
              <option value="Otro">Otro</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col w-full text-xs gap-1.5">NSS (Número de Seguridad Social)
          <input
            onChange={manejarCambio}
            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
            value={datosEstudiante.nss || ""}
            disabled={!isEditing}
            type="text"
            name="nss"
            placeholder="78945612301"
            className={getInputClass("nss")}
          />
        </label>
      </div>
    </div>
  );
}