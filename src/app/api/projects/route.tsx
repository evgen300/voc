"use server"

import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from "@/lib/mongodb";
import Projects from '@/models/Projects';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  const list = await Projects.getList();
  return new Response(JSON.stringify(list), { status: 200 });
}