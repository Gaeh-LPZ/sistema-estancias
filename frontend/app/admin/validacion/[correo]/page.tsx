import Detalles from "@/app/ui/estudiantes/estancia/detalles/Detalles";
import PanelValidacion from "@/app/ui/admin/PanelValidacion";

async function obtenerDetallesEstudiante(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/detalles/${correo}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al obtener detalles para admin: ", error);
        return null;
    }
}

export default async function Page({ params }: { params: Promise<{ correo: string }> }) {
    const { correo } = await params;
    const correoEstudiante = decodeURIComponent(correo);
    const datosEstudiante = await obtenerDetallesEstudiante(correoEstudiante);

    const iniciales = datosEstudiante?.estudiante?.nombre_completo
        ? `${datosEstudiante.estudiante.nombre_completo.charAt(0)}` 
        : "N/A";
    
    // Obtenemos los strings limpios para pasarlos al panel
    const nombre = datosEstudiante?.estudiante?.nombre_completo || "Cargando...";
    const matricula = datosEstudiante?.estudiante?.matricula || "Sin matrícula";

    return (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* LADO IZQUIERDO: Usamos el componente interactivo nuevo */}
            <PanelValidacion 
                correo={correoEstudiante} 
                iniciales={iniciales} 
                nombre={nombre} 
                matricula={matricula} 
            />

            {/* LADO DERECHO: Tu componente Detalles intacto */}
            <div className="flex-1 bg-[#f2f4f6] overflow-y-auto p-6 md:p-10">
                <Detalles datos={datosEstudiante} />
            </div>
            
        </div>
    );
}