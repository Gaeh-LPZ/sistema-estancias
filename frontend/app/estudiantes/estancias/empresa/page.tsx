import { auth } from "@/auth";
import FormEmpresa from "@/app/ui/estudiantes/estancia/empresa/FormEmpresa"; // Asegúrate de crear este archivo

async function obtenerDatosEmpresa(correo: string) {
    try {
        // Ajusta la URL si tu endpoint GET para la empresa es diferente
        const res = await fetch(`http://umar_api:8000/api/estudiantes/empresa/${correo}`, {
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
                <p>Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }
    
    const datosIniciales = await obtenerDatosEmpresa(correoUsuario);
    
    return (
        <FormEmpresa correoUsuario={correoUsuario} datosIniciales={datosIniciales} />
    );
}