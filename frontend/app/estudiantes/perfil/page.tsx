import { auth } from "@/auth";
import PerfilUI from "@/app/ui/estudiantes/perfil/PerfilUI";

async function obtenerDatosPerfil(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/perfil/${correo}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
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
                <p>Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }

    // Llamamos a la API usando el correo de la sesión
    const datosPerfil = await obtenerDatosPerfil(correoUsuario);

    if (!datosPerfil) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-600 font-bold text-xl">Error de conexión</p>
                <p>No pudimos obtener la información de tu perfil de la base de datos.</p>
            </div>
        );
    }

    console.log(datosPerfil)
    
    // Le pasamos el JSON completo a PerfilUI como prop
    return <PerfilUI correoUsuario={correoUsuario} datosPerfil={datosPerfil} />;
}