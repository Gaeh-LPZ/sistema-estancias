"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IFormEstudiantes } from "@/app/types/estudiantes/types";

interface FormProps {
    correoUsuario: string;
    datosIniciales: IFormEstudiantes;
}

export default function FormEstudiantes({ correoUsuario, datosIniciales }: FormProps) {
    const [campoExitoso, setCampoExitoso] = useState<string>("");
    const [datosFormulario, setDatosFormulario] = useState<Record<string, any>>(() => {
        return {
            // Aplanamos todo lo que no choca
            ...(datosIniciales?.estudiante || {}),
            ...(datosIniciales?.datos_personales || {}),
            ...(datosIniciales?.contacto || {}),
            ...(datosIniciales?.domicilio_local || {}),
            ...(datosIniciales?.informacion_demografica || {}),
            ...(datosIniciales?.detalles_estancia || {}),
            
            // Declaramos las de procedencia directamente aquí, evitando el "if"
            procedencia_calle: datosIniciales?.domicilio_procedencia?.calle || "",
            procedencia_colonia: datosIniciales?.domicilio_procedencia?.colonia || "",
            procedencia_ciudad: datosIniciales?.domicilio_procedencia?.ciudad || "",
            procedencia_codigo_postal: datosIniciales?.domicilio_procedencia?.codigo_postal || "",
            procedencia_municipio: datosIniciales?.domicilio_procedencia?.municipio || "",
            procedencia_estado: datosIniciales?.domicilio_procedencia?.estado || ""
        };
    });
    
    const router = useRouter();

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosFormulario(prev => ({ ...prev, [name]: value }));
    };

    const manejarGuardado = async (nombreCampo: string, valor: string) => {
        if (valor.trim() === "") {
            toast.error("El campo no puede estar vacío");
            return;
        }

        const toastId = toast.loading(`Guardando...`);

        try {
            const datosAEnviar = { [nombreCampo]: valor };

            const response = await fetch(`http://localhost:8000/api/estudiantes/estancias/${correoUsuario}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosAEnviar),
            });

            if (!response.ok) throw new Error("Error en el servidor");

            toast.success("¡Guardado correctamente!", { id: toastId });

            setCampoExitoso(nombreCampo);
            setTimeout(() => setCampoExitoso(""), 2000);
            router.refresh();

        } catch (error) {
            toast.error("Hubo un problema al guardar", { id: toastId });
        }
    };

    const baseInputClass = 'h-10 px-3 rounded-lg border outline-none transition-colors w-full';
    const getInputClass = (nombreCampo: string) => {
        return `${baseInputClass} ${campoExitoso === nombreCampo
            ? "border-green-500 bg-green-50 ring-2 ring-green-200"
            : "border-gray-400 bg-[#f7f9fb] focus:border-[#1e3a8a]"
            }`;
    };

    const input_style = 'h-10 px-3 rounded-lg border border-gray-400 bg-[#f7f9fb] focus:border-[#1e3a8a] outline-none';

    return (
        <form className="bg-white h-full p-6 md:p-6 flex flex-col gap-6">
            <div>
                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-300">
                    Datos Personales
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Nombre(s)</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.nombre || ""}
                            className={getInputClass("nombre")}
                            placeholder="Ej. Juan"
                            type="text"
                            name="nombre"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Apellidos</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.apellidos || ""}
                            className={getInputClass("apellidos")}
                            placeholder="Ej. Pérez García"
                            type="text"
                            name="apellidos"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Fecha de Nacimiento</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.fecha_nacimiento || ""}
                            type="date"
                            name="fecha_nacimiento"
                            className={getInputClass("fecha_nacimiento")}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Lugar de Nacimiento</label>
                        <input
                            onChange={manejarCambio}
                            className={input_style}
                            type="text"
                            name=""
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Número de Seguro Social</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.nss || ""}
                            className={getInputClass("nss")}
                            type="text"
                            name="nss"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Matrícula UMAR</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.matricula || ""}
                            className={getInputClass("matricula")}
                            type="text"
                            name="matricula"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Grupo</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.grupo || ""}
                            className={getInputClass("grupo")}
                            placeholder="Ej. 604"
                            type="text"
                            name="grupo"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Porcentaje de créditos</label>
                        <input
                            className={input_style}
                            placeholder="Ej. 85%"
                            type="text"
                            name="creditos"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Contacto */}
            <div className="mt-6">
                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-300">Contacto</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Correo electrónico alternativo</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.correo_alternativo || ""}
                            className={getInputClass("correo_alternativo")}
                            type="email"
                            name="correo_alternativo"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Número de teléfono personal</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.telefono || ""}
                            className={getInputClass("telefono")}
                            type="tel"
                            name="telefono"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Número de teléfono alternativo</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.telefono_emergencia || ""}
                            className={getInputClass("telefono_emergencia")}
                            type="tel"
                            name="telefono_emergencia"
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Domicilios */}
            <div className="mt-6">
                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400">Domicilio Local</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1 lg:col-span-2">
                        <label className="text-sm font-semibold">Calle y número</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.calle || ""}
                            className={getInputClass("calle")}
                            type="text"
                            name="calle"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Colonia</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.colonia || ""}
                            className={getInputClass("colonia")}
                            type="text"
                            name="colonia"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Ciudad</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.ciudad || ""}
                            className={getInputClass("ciudad")}
                            type="text"
                            name="ciudad"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Municipio</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.municipio || ""}
                            className={getInputClass("municipio")}
                            type="text"
                            name="municipio"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Código Postal</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.codigo_postal || ""}
                            className={getInputClass("codigo_postal")}
                            type="text"
                            name="codigo_postal"
                        />
                    </div>
                </div>

                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400 mt-6">
                    Domicilio de Procedencia
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1 lg:col-span-2">
                        <label className="text-sm font-semibold">Calle y número</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_calle || ""}
                            className={getInputClass("procedencia_calle")}
                            type="text"
                            name="procedencia_calle"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Colonia</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_colonia || ""}
                            className={getInputClass("procedencia_colonia")}
                            type="text"
                            name="procedencia_colonia"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Ciudad</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_ciudad || ""}
                            className={getInputClass("procedencia_ciudad")}
                            type="text"
                            name="procedencia_ciudad"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">C.P.</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_codigo_postal || ""}
                            className={getInputClass("procedencia_codigo_postal")}
                            type="text"
                            name="procedencia_codigo_postal"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Municipio</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_municipio || ""}
                            className={getInputClass("procedencia_municipio")}
                            type="text"
                            name="procedencia_municipio"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Estado</label>
                        <input
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.procedencia_estado || ""}
                            className={getInputClass("procedencia_estado")}
                            type="text"
                            name="procedencia_estado"
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Sociodemográfica */}
            <div className="mt-6">
                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400 mt-6">
                    Información Sociodemográfica
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">¿Tienes alguna discapacidad?</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.discapacidad || ""}
                            name="discapacidad"
                            className={getInputClass("discapacidad")}
                        >
                            <option value="" disabled>Seleccionar</option>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">¿Eres hablante de lengua indígena?</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.lengua_indigena || ""}
                            name="lengua_indigena"
                            className={getInputClass("lengua_indigena")}>
                            <option value="" disabled>Seleccionar</option>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">¿Tienes hijos?</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.hijos || ""}
                            name="hijos"
                            className={getInputClass("hijos")}>
                            <option value="" disabled>Seleccionar</option>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 5: Detalles de la Estancia */}
            <div className="mt-6">
                <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400">
                    Detalles de la Estancia
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Período</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.periodo || ""}
                            name="periodo"
                            className={getInputClass("periodo")}
                        >
                            <option value="" disabled>Seleccionar</option>
                            <option value="primero">Primer periodo</option>
                            <option value="segundo">Segundo periodo</option>
                            <option value="unico">Periodo único</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Tipo de Estancia</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.tipo_estancia || ""}
                            name="tipo_estancia"
                            className={getInputClass("tipo_estancia")}
                        >
                            <option value="" disabled>Seleccionar</option>
                            <option value="verano">Verano</option>
                            <option value="dual">Dual</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">Mínimo de horas</label>
                        <select
                            onChange={manejarCambio}
                            onBlur={(e) => manejarGuardado(e.target.name, e.target.value)}
                            value={datosFormulario.minimo_horas || ""}
                            name="minimo_horas"
                            className={getInputClass("minimo_horas")}>
                            <option value="" disabled>Seleccionar</option>
                            <option value="280">280 horas</option>
                            <option value="560">560 horas</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-[#d0e1fb]/30 border border-[#d0e1fb] rounded-lg p-3 flex items-start gap-3 mt-6">
                <span className="material-symbols-outlined mt-0.5">info</span>
                <p className="font-medium">
                    Asegúrese de que todos sus datos sean correctos, ya que estos se imprimirán en los documentos oficiales de su convenio.
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="px-6 py-2 rounded-lg bg-[#1e3a8a] text-white text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2"
                    type="button"
                >
                    Continuar a Empresa <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
            </div>
        </form>
    );
}