"use server"

import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Word from '@/models/Word';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextRequest, { params }: any) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  let id = (await params).id;
  await dbConnect();
  const words = await Word.get(id);
  return new Response(JSON.stringify(words), { status: 200 });
}

export async function POST(req: NextRequest, { params }: any) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  //const list = await Company.create(session.user.roles.includes('admin') ? null : session.user.id);
  const id = (await params).id;
  let requestData = await req.json();
  //requestData.user_id = session.user.id;
  const word = await Word.setAudio(id, requestData.hasOwnProperty('form_idx') ? requestData.form_idx : null);
  return new Response(JSON.stringify(word), { status: 200 });
}