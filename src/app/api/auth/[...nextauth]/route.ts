/*import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserSchema from "@/models/schemas/UserSchema";
import dbConnect from "@/lib/mongodb";

interface AuthorizeCredentials {
  email?: string,
  password: string
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      //id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: AuthorizeCredentials | undefined) {
        await dbConnect();
        if (credentials === null) return null;
        
        try {
          const user = await UserSchema.findOne({
            email: credentials?.email
          });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials ? credentials.password : "",
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              throw new Error("email_or_password");
            }
          } else {
            throw new Error("user_not_found");
          }
        } catch (error) {
          console.log("HERE123")
          console.log(error);
          throw new Error(error);
        }
      }
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt(params) {
      const { token, user, account, isNewUser, trigger, session } = params;
      if (user) {
        token.uid = user.id;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
      }
      if (token.uid) {
        const userDb = await UserSchema.findOne({ _id: token.uid });
        token.lang = userDb.lang;
        token.roles = userDb.roles || [];
        token.fullName = `${userDb.last_name} ${userDb.first_name} ${userDb.middle_name}`.trim();
      }
      return Promise.resolve(token);
    },
    async session({ session, token, trigger }) {
      session.user.id = token.sub;
      if (token.lang) {
        session.user.lang = token.lang;
      }
      session.user.roles = token.roles || [];
      session.user.fullName = token.fullName || '';
      //console.log("SET ID", session.user.id);
      //console.log(session);
      return Promise.resolve(session);
    },
    async redirect({ url, baseUrl }) {
      console.log("REDIRECT", url, baseUrl);
      return baseUrl;
    }
  },

  events: {
    async updateUser(message) {
      console.log("UPDATE event", message);
    }
  },
}
export default NextAuth(authOptions);*/

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Best practice: define options in a separate file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };