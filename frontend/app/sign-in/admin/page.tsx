"use client";

import { inter } from "../../lib/fonts";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Ejecutamos el inicio de sesión de NextAuth
            const result = await signIn("credentials", {
                correo,
                password,
                redirect: false, // Controlamos la redirección manualmente para atrapar errores limpios
            });

            if (result?.error) {
                setError("Credenciales incorrectas o cuenta de administrador inactiva.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("Ocurrió un error inesperado. Inténtelo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`${inter.className} h-screen w-screen flex`}>
            <section className="h-full w-1/3 flex flex-col items-center justify-center p-20 gap-7">
                <Image src={'/estancias/umar-logo.webp'} alt="Logo de la universidad del mar" width={90} height={90} />
                <header className="w-full">
                    <h1 className="text-3xl font-bold">Gestión de Estancias</h1>
                    <p className="text-gray-500">Universidad del Mar</p>
                </header>

                {error && (
                    <div className="w-full p-3 bg-red-100 text-red-700 text-xs rounded border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
                    <label className="flex flex-col text-xs gap-1">Correo electrónico
                        <input 
                            type="email" 
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="umar@gs.aulavirtual.mx" 
                            className="p-2.5 bg-gray-100 border border-gray-300 placeholder:text-sm"
                            required
                        />
                    </label>
                    <label className="flex flex-col text-xs gap-1">Contraseña
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="∙∙∙∙∙∙" 
                            className="p-2.5 bg-gray-100 border border-gray-300 placeholder:text-sm"
                            required
                        />
                    </label>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-[#1e3a8a] text-white hover:scale-105 transition-all transform w-full disabled:opacity-50"
                    >
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </section>
            <aside className="h-full w-2/3 relative overflow-hidden">
                <Image src={'/estancias/CPA-2023.jpg'} loading="eager" alt="fondo decorativo de la umar" width={1018} height={398} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md rounded-xl flex items-start gap-3 p-6">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[32px]">campaign</span>
                    <div>
                        <h3 className="font-semibold text-[18px] mb-1">Periodo de Validación Abierto</h3>
                        <p className="text-sm">El sistema de carga de documentos se encuentra activo. Recuerde verificar los convenios antes del cierre administrative.</p>
                    </div>
                </div>
            </aside>
        </main>
    );
}