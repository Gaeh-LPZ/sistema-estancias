import PanelValidacion from "@/app/ui/admin/PanelValidacion";

async function obtenerDetallesEstudiante(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/detalles/${correo}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error al obtener detalles para admin: ", error);
        return null;
    }
}

async function obtenerEstadosDocumentos(correo: string) {
    try {
        const res = await fetch(`http://umar_api:8000/api/estudiantes/${correo}/documentos/estados`, { cache: "no-store" });
        if (!res.ok) return {};
        return await res.json();
    } catch (error) {
        console.error("Error al obtener estados de documentos: ", error);
        return {};
    }
}

export default async function Page({ params }: { params: Promise<{ correo: string }> }) {
    const { correo } = await params;
    const correoEstudiante = decodeURIComponent(correo);
    
    const [datosEstudiante, estadosDesdeDB] = await Promise.all([
        obtenerDetallesEstudiante(correoEstudiante),
        obtenerEstadosDocumentos(correoEstudiante)
    ]);

    const nombre = datosEstudiante?.estudiante?.nombre_completo || "Cargando...";

    const listaOficial = [
        { id: "cv", nombre: "CV (Currículum Vitae)" },
        { id: "credencial", nombre: "Credencial de la Universidad" },
        { id: "seguro", nombre: "Vigencia de Seguro Social" },
        { id: "aceptacion", nombre: "Carta de Aceptación" },
        { id: "informe", nombre: "Informe Final" },
        { id: "evaluacion", nombre: "Evaluación Control Final" },
        { id: "liberacion", nombre: "Carta de Liberación" }
    ];

    const documentosFormateados = listaOficial.map(doc => ({
        id: doc.id,
        nombre: doc.nombre,
        estado: estadosDesdeDB[doc.id]?.estado || "Pendiente",
        url: estadosDesdeDB[doc.id]?.url || ""
    }));

    return (
        <div className="flex-1 flex overflow-hidden relative bg-gray-50">
            {/* Le pasamos todos los documentos Y los datos del estudiante al Panel */}
            <PanelValidacion 
                correoEstudiante={correoEstudiante} 
                nombreEstudiante={nombre} 
                documentos={documentosFormateados} 
                datosEstudiante={datosEstudiante}
            />
        </div>
    );
}