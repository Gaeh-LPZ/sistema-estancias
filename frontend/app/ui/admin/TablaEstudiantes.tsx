import { Estudiantes } from "@/app/types/admin/types";

export default async function TablaEstudiantes({
    query = '',
    carrera = '',
    estado = ''
}: {
    query?: string;
    carrera?: string;
    estado?: string;
}) {
    const rawData = await fetch('http://api:8000/api/estudiantes/obtener-estudiantes', {
        cache: 'no-store'
    });
    let data: Estudiantes[] = await rawData.json();

    if (!Array.isArray(data)) {
        return <div className="text-red-500 p-4">Error al cargar datos.</div>;
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        data = data.filter((estudiante) =>
            String(estudiante.nombre).toLowerCase().includes(lowerQuery) || 
            String(estudiante.matricula).toLowerCase().includes(lowerQuery)
        );
    }

    if (carrera && carrera !== 'Todas las Carreras') {
        data = data.filter((estudiante) => estudiante.carrera === carrera);
    }

    if (estado && estado !== 'Cualquier Estado') {
        data = data.filter((estudiante) => estudiante.status === estado);
    }

    return (
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-225">
                <thead className="sticky top-0 bg-[#f2f4f6] border-b border-gray-300 z-10">
                    <tr>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Nombre del Estudiante</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Grupo</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Carrera</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Matrícula</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Estado Global</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600">Documentos</th>
                        <th className="py-3 px-6 font-bold text-xs text-gray-600 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                No se encontraron estudiantes con esos filtros.
                            </td>
                        </tr>
                    ) : (data.map((estudiante) => {
                            const totalDocumentos = 13;
                            const documentosEntregados = estudiante.documentos ? estudiante.documentos.filter((doc: any) => doc.url_archivo !== null).length : 0;
                            const porcentajeProgreso = (documentosEntregados / totalDocumentos) * 100;
                        return (
                        <tr key={estudiante.id} className="hover:bg-white hover:shadow-[inset_2px_0_0_0_#1e3a8a] transition-all group">
                            <td className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#d3e4fe] text-blue-950 flex items-center justify-center font-bold shrink-0">
                                        {estudiante.nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-medium">{estudiante.nombre}</p>
                                        <p className="font-medium text-xs">{estudiante.correo}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-6 text-[14px]">{estudiante.grupo}</td>
                            <td className="py-3 px-6 text-[14px]">{estudiante.matricula}</td>
                            <td className="py-3 px-6 text-[14px]">{estudiante.carrera}</td>
                            <td className="py-3 px-6">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#d0e1fb] text-[14px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#54647a]"></span>
                                    {estudiante.status}
                                </span>
                            </td>
                            <td className="py-3 px-6">
                                <div className="flex items-center gap-3 w-32">
                                    <div className="flex-1 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1e3a8a] transition-all duration-300" style={{ width: `${porcentajeProgreso}%` }}></div>
                                    </div>
                                    <span className="text-[14px]">{documentosEntregados}/{totalDocumentos}</span>
                                </div>
                            </td>
                            <td className="py-3 px-6 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-3 py-1.5 rounded text-gray-600 hover:bg-surface-[#e6e8ea] text-[14px] transition-colors border border-[#c5c5d3] cursor-pointer">Ver detalle</button>
                                    <button className="px-3 py-1.5 rounded bg-[#1e3a8a] text-white hover:bg-[#00236f] text-[14px] transition-colors shadow-sm cursor-pointer">Validar</button>
                                </div>
                            </td>
                        </tr>
                        );
                    }))}
                </tbody>
            </table>
        </div>
    );
}