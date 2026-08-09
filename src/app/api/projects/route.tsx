"use server"

import dbConnect from "@/lib/mongodb";
import Projects from '@/models/Projects';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }
  await dbConnect();
  const user_id = session.user.id;
  const list = await Projects.getList({ user_id: user_id });
  return new Response(JSON.stringify(list), { status: 200 });
}