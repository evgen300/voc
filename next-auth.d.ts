import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
      lang: string,
      roles: Array<string>
    } & DefaultSession["user"];
  }
}