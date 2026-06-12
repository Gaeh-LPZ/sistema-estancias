import { auth } from "@/auth";
import FormUI from "@/app/ui/estudiantes/estancia/FormUI";

async function obtenerDatosPerfil(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/estancias/${correo}`, {
            cache: "no-cache"
        })
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
                <p>Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }
    
    const datosIniciales = await obtenerDatosPerfil(correoUsuario);
    
    return (
        <FormUI correoUsuario={correoUsuario} datosIniciales={datosIniciales}/>
    );
}
