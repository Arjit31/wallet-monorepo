import {authOptions} from "../../../lib/auth"
import NextAuth from "next-auth";

const authHandler = NextAuth(authOptions);

export {authHandler as GET, authHandler as POST}