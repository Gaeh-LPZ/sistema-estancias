"use client";

import { useRef } from "react";
import { useState } from "react";

export default function UploadExcelButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const respuesta = await fetch("http://localhost:8000/api/estudiantes/cargar-excel", {
                method: "POST",
                body: formData,
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                alert(data.mensaje || "Estudiantes cargados correctamente");
                
            } else {
                alert("Hubo un error al cargar el archivo");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error de conexión con el servidor");
        } finally {
            
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="hidden bg-white md:flex items-center gap-1 border border-gray-300 py-2 px-6 rounded-md font-medium text-xs hover:bg-[#f2f4f6] transition-colors shadow-sm cursor-pointer"
            >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Importar Estudiantes
            </button>
        </>
    );
}