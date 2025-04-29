import { Session } from "inspector/promises";
import GoogleProvider from "next-auth/providers/google";

// import bcrypt from "bcrypt";
// import { prisma } from "@repo/db";

export const authOptions = {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
  ],
  secret: process.env.JWT_SECRET,
  callback: {
    session({token, session}: any){
      console.log(session);
      session.user.id = token.sub;
      return session;
    }

  }
};
