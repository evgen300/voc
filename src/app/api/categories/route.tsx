"use server"

import dbConnect from "@/lib/mongodb";
import Categories from '@/models/Categories';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET() {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  const list = await Categories.getList();
  return new Response(JSON.stringify(list), { status: 200 });
}