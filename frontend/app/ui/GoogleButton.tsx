"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton() {
    return (
        <button
        onClick={ () => signIn('google', { callbackUrl: '/' }) } 
        className="flex flex-row font-bold gap-1.5 text-sm items-center justify-center w-full p-2.5 border border-gray-400 hover:scale-105 transform transition-all cursor-pointer">
            <svg width={24} height={24} aria-label="Logo de Google"><use xlinkHref="/google-logo.svg"></use></svg>
            Iniciar Sesión con Google
        </button>
    );
}