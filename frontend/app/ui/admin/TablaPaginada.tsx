"use client";

import Link from "next/link";
import { Estudiantes } from "@/app/types/admin/types";
import { useState } from "react";

export default function TablaPaginada({ data }: { data: Estudiantes[] }) {
    const [paginaActual, setPaginaActual] = useState(1)
    const registrosPorPagina = 3;

    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const registrosActuales = data.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(data.length / registrosPorPagina);

    const irPaginaSiguiente = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
    const irPaginaAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1))

    if (data.length === 0)
        return <div className="py-8 text-center text-gray-500 bg-white rounded-b-md">No se encontraron estudiantes con esos filtros.</div>
    return (
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-225">
                <thead className="sticky top-0 bg-[#f2f4f6] border-b border-gray-300 z-10">
                    <tr>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Nombre del Estudiante</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Grupo</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Matrícula</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Carrera</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Estado Global</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Documentos</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {registrosActuales.map((estudiante) => {
                        const totalDocumentos = 13;
                        const documentosEntregados = estudiante.documentos ? estudiante.documentos.filter((doc: any) => doc.url_archivo !== null).length : 0;
                        const porcentajeProgreso = (documentosEntregados / totalDocumentos) * 100;
                        return (
                            <tr key={estudiante.id} className="hover:bg-gray-50 hover:shadow-[inset_2px_0_0_0_#1e3a8a] transition-all group bg-white">
                                <td className="py-3 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#d3e4fe] text-blue-950 flex items-center justify-center font-bold shrink-0">
                                            {estudiante.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium">{estudiante.nombre} {estudiante.apellidos}</p>
                                            <p className="font-medium text-xs text-gray-500">{estudiante.correo}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-[14px] text-gray-700">{estudiante.grupo}</td>
                                <td className="py-3 px-6 text-[14px] text-gray-700">{estudiante.matricula}</td>
                                <td className="py-3 px-6 text-[14px] text-gray-700">{estudiante.carrera}</td>
                                <td className="py-3 px-6">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#d0e1fb] text-[14px] font-bold text-blue-900">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#54647a]"></span>
                                        {estudiante.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6">
                                    <div className="flex items-center gap-3 w-32">
                                        <div className="flex-1 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1e3a8a] transition-all duration-300" style={{ width: `${porcentajeProgreso}%` }}></div>
                                        </div>
                                        <span className="text-[14px] text-gray-600">{documentosEntregados}/{totalDocumentos}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">

                                        {/* CORRECCIÓN 1: Convertimos "Ver detalle" en un Link real */}
                                        <Link
                                            href={`/admin/validacion/${encodeURIComponent(estudiante.correo)}`}
                                            className="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-200 text-[14px] transition-colors border border-gray-300 cursor-pointer inline-block"
                                        >
                                            Ver detalle
                                        </Link>

                                        {/* CORRECCIÓN 2: Relajamos la condición. Mientras no esté "Validado", el admin puede entrar a Validar */}
                                        {estudiante.status !== "Validado" ? (
                                            <Link
                                                // Opcional: Le pasamos ?doc=cv para que abra el panel de validación directo en el CV
                                                href={`/admin/validacion/${encodeURIComponent(estudiante.correo)}?doc=cv`}
                                                className="px-3 py-1.5 rounded bg-[#1e3a8a] text-white hover:bg-[#00236f] text-[14px] transition-colors shadow-sm cursor-pointer inline-block"
                                            >
                                                Validar
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                title="Ya ha sido completamente validado"
                                                className="px-3 py-1.5 rounded bg-gray-300 text-gray-500 text-[14px] shadow-sm cursor-not-allowed inline-block"
                                            >
                                                Validar
                                            </button>
                                        )}

                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-[#f8fafc]">
                <span className="text-sm text-gray-600">
                    Mostrando del <span className="font-semibold">{indicePrimerRegistro + 1}</span> al <span className="font-semibold">{Math.min(indiceUltimoRegistro, data.length)}</span> de <span className="font-semibold">{data.length}</span> resultados
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={irPaginaAnterior}
                        disabled={paginaActual === 1}
                        className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${paginaActual === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Anterior
                    </button>
                    <div className="flex items-center px-3 text-sm font-medium text-gray-600">
                        Página {paginaActual} de {totalPaginas}
                    </div>
                    <button
                        onClick={irPaginaSiguiente}
                        disabled={paginaActual === totalPaginas}
                        className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${paginaActual === totalPaginas ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}