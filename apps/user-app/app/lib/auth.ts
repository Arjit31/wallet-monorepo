import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import { prisma } from "@repo/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@provider.xyz",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.phone || !credentials.password)
          return null;
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number,
            };
          }
          return null;
        }

        try {
          const user = await prisma.$transaction(async(tx:any) => {
            
            const user = await tx.user.create({
              data: {
                number: credentials.phone,
                password: hashedPassword,
                email: credentials.email
              },
            });
            await tx.balance.create({
              data: {
                userId: user.id,
                amount: 0,
                locked: 0,
              }
            })
            return user;
          })
          return {
            id: user.id.toString() || "",
            name: user.name,
            email: user.number,
          };
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ token, session}: any) {
      console.log(token);
      session.user.id = token.sub;

      return session;
    },
  },
};

