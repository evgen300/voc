"use server"

import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Phrase from '@/models/Phrase';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextRequest, { params }: any) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  let id = (await params).id;
  await dbConnect();
  const phrase = await Phrase.get(id);
  return new Response(JSON.stringify(phrase), { status: 200 });
}

export async function POST(req: NextRequest, { params }: any) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  //const list = await Company.create(session.user.roles.includes('admin') ? null : session.user.id);
  const id = (await params).id;
  //requestData.user_id = session.user.id;
  const phrase = await Phrase.setAudio(id);
  return new Response(JSON.stringify(phrase), { status: 200 });
}