import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.ID_GOOGLE_AUTH as string,
      clientSecret: process.env.SECRETO_GOOGLE_AUTH as string,
      authorization: {
        params: {
          hd: "aulavirtual.umar.mx", 
        }
      }
    }),
    // Conservamos e integramos el nuevo login para administradores
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.password) return null;
        
        try {
          // Aseguramos usar el nombre exacto del contenedor para la red de Docker
          const res = await fetch("http://umar_api:8000/api/admin/login", {
            method: 'POST',
            body: JSON.stringify({
              correo: credentials.correo,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" }
          });
          
          if (res.ok) {
            const user = await res.json();
            return user;
          }
          // Si el backend dice "Credenciales incorrectas", imprimimos para saberlo
          console.log("Login rechazado por el backend con status:", res.status);
          return null;
        } catch (error) {
          console.error("Fallo brutal conectando al backend (umar_api):", error);
          return null;
        }
      }
    })
  ],
  basePath: "/estancias/api/auth",
  trustHost: true,
  cookies: {
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/", // Sigue siendo clave para que funcione en todo el sitio
        secure: true,
      },
    },
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/", // Sigue siendo clave para que funcione en todo el sitio
        secure: true,
      },
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in/admin',
    error: '/sign-in/admin',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (email && email.endsWith("@aulavirtual.umar.mx")) {
          return true;
        } else {
          return false;
        }
      }
      return true; // Permitir el acceso para el proveedor de credenciales (Admin)
    },
  }
});