import { inter } from "../lib/fonts";
import NavBarAdmin from "../ui/admin/NavBar";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata : Metadata = {
    title: 'administración'
}

export default async function Layout({children,}:Readonly<{children: React.ReactNode;}>){
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/sign-in/admin');
    }

    try {
        const res = await fetch(`http://api:8000/api/usuarios/rol?correo=${session.user.email}`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.rol !== 'Administrador') {
                redirect('/estudiantes/perfil'); 
            }
        } else {
            redirect('/sign-in/admin');
        }
    } catch (error) {
        console.error("Error validando el rol:", error);
        redirect('/sign-in/admin');
    }

    return (
        <main className={`${inter.className} h-screen w-screen flex flex-row`}>
            <NavBarAdmin/>
            {children}
        </main>
    );
}