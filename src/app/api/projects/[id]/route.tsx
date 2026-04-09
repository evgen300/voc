"use server"

import type { NextApiRequest, NextApiResponse } from 'next';
//import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Projects from '@/models/Projects';

export async function GET(req: NextApiRequest, { params }: any) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  const id = (await params).id;
  const project = await Projects.getFullProjectInfo(id);
  return new Response(JSON.stringify(project), { status: 200 });
}