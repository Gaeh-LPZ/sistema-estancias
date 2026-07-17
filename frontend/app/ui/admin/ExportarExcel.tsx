'use client'
import { API_BASE_URL } from "@/app/lib/config";

export default function BotonExportar() {
    
    const handleExportar = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/estudiantes/exportar-excel`);
            
            if (!response.ok) throw new Error('Error al generar el archivo');

            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte_estudiantes.xlsx';
            document.body.appendChild(a);
            a.click();
            
            a.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error al exportar los estudiantes:", error);
            alert("Hubo un problema al exportar el archivo.");
        }
    };

    return (
        <button 
            onClick={handleExportar}
            className="hidden bg-white md:flex items-center gap-1 border border-gray-300 py-2 px-6 rounded-md font-medium text-xs hover:bg-[#f2f4f6] transition-colors shadow-sm cursor-pointer"
        >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar Estudiantes
        </button>
    );
}