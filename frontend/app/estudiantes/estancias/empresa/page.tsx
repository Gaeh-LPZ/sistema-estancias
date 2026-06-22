import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormEmpresa from "@/app/ui/estudiantes/estancia/empresa/FormEmpresa";

async function obtenerDetallesValidacion(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/detalles/${correo}`, {
            cache: "no-cache"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al validar paso 1: ", error);
        return null;
    }
}

async function obtenerDatosEmpresa(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/empresa/${correo}`, {
            cache: "no-cache"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al traer datos de empresa: ", error);
        return null;
    }
}

export default async function Page() {
    const session = await auth();
    const correoUsuario = session?.user?.email;
    
    if (!correoUsuario) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-600 font-bold text-xl">No estás autenticado.</p>
                <p>Por favor, inicia sesión para continuar.</p>
            </div>
        );
    }
    

    const datosValidacion = await obtenerDetallesValidacion(correoUsuario);
    
    const faltanDatosEstudiante = !datosValidacion || 
                                  !datosValidacion.estudiante.matricula || 
                                  datosValidacion.estancia.proyecto === "Sin registrar";

    if (faltanDatosEstudiante) {
        redirect("/estudiantes/estancias");
    }
    const datosIniciales = await obtenerDatosEmpresa(correoUsuario);
    
    return (
        <FormEmpresa correoUsuario={correoUsuario} datosIniciales={datosIniciales} />
    );
}