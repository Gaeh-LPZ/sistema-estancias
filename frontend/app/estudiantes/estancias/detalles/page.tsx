import { auth } from "@/auth";
import { redirect } from "next/navigation"; // 1. Importamos la función redirect
import DetallesUI from "@/app/ui/estudiantes/estancia/detalles/DetallesUI";

async function obtenerDetallesResumen(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/detalles/${correo}`, {
            cache: "no-cache"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al conectar con el backend: ", error);
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
                <p>Por favor, inicia sesión para ver los detalles de tu estancia.</p>
            </div>
        );
    }
    
    const datosDetalles = await obtenerDetallesResumen(correoUsuario);
    
    const faltanDatosEstudiante = !datosDetalles || !datosDetalles.estudiante.matricula || datosDetalles.estancia.proyecto === "Sin registrar";
    
    const faltanDatosEmpresa = !datosDetalles || datosDetalles.empresa.nombre === "Sin registrar";

    if (faltanDatosEstudiante) {
        redirect("/estudiantes/estancias");
    } else if (faltanDatosEmpresa) {
        redirect("/estudiantes/estancias/empresa");
    }
    
    return (
        <DetallesUI correoUsuario={correoUsuario} datos={datosDetalles} />
    );
}