import { auth } from "@/auth";
import Documentos from "@/app/ui/estudiantes/documentos/Documentos";

async function obtenerEstadosIniciales(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/${correo}/documentos/estados`, {
            cache: "no-store"
        });
        if (!res.ok) return {};
        return await res.json();
    } catch (error) {
        console.error("Error al obtener estados de documentos:", error);
        return {};
    }
}

export default async function Page(){
    const session = await auth();
    const correoUsuario = session?.user?.email;
    
    if (!correoUsuario) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-600 font-bold text-xl">No estás autenticado.</p>
                <p>Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }

    const documentosIniciales = await obtenerEstadosIniciales(correoUsuario);

    return(
        <Documentos correoUsuario={correoUsuario} documentosIniciales={documentosIniciales}/>
    );
}