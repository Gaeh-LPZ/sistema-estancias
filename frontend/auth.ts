import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.ID_GOOGLE_AUTH as string,
      clientSecret: process.env.SECRETO_GOOGLE_AUTH as string,
      authorization: {
        params: {
          hd: "gs.utm.mx", 
        }
      }
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in', 
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (email && email.endsWith("@gs.utm.mx")) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
  }
});