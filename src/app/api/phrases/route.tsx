"use server"

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Phrase from '@/models/Phrase';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextRequest, res: NextApiResponse) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  let project_id = req.nextUrl.searchParams.get('project_id');
  let search = req.nextUrl.searchParams.get('search');
  let phrase = req.nextUrl.searchParams.get('phrase');
  let translation = req.nextUrl.searchParams.get('translation');
  let notes = req.nextUrl.searchParams.get('notes');
  await dbConnect();
  const phrases = await Phrase.getList({ project_id: project_id || "", search: search || "", phrase: phrase || "", translation: translation || "", notes: notes || "" });
  return new Response(JSON.stringify(phrases), { status: 200 });
}

export async function POST(req: NextRequest) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  //const list = await Company.create(session.user.roles.includes('admin') ? null : session.user.id);
  let requestData = await req.json();
  //requestData.user_id = session.user.id;
  const phrase = await Phrase.create(requestData);
  return new Response(JSON.stringify(phrase), { status: 200 });
}