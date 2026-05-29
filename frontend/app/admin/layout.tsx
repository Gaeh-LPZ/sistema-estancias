import { inter } from "../lib/fonts";
import NavBarAdmin from "../ui/admin/NavBar";
import type { Metadata } from "next";

export const metadata : Metadata = {
    title: 'administración'
}

export default function Layout({children,}:Readonly<{children: React.ReactNode;}>){
    return (
        <main className={`${inter.className} h-screen w-screen flex flex-row`}>
            <NavBarAdmin/>
            {children}
        </main>
    );
}