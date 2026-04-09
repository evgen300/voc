"use server"

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Word from '@/models/Word';
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextRequest, res: NextApiResponse) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  let project_id = req.nextUrl.searchParams.get('project_id');
  let search = req.nextUrl.searchParams.get('search');
  let word = req.nextUrl.searchParams.get('word');
  let tarnscription = req.nextUrl.searchParams.get('transcription');
  let translation = req.nextUrl.searchParams.get('translation');
  let notes = req.nextUrl.searchParams.get('notes');
  let type_id = req.nextUrl.searchParams.get('type_id');
  let categoriesRequest = req.nextUrl.searchParams.get('categories');
  let categories = categoriesRequest && categoriesRequest.length > 0 ? categoriesRequest.split(',') : [];
  await dbConnect();
  const words = await Word.getList({ project_id: project_id || "", search: search || "", word: word || "", transcription: tarnscription || "", translation: translation || "", notes: notes || "", type_id: type_id || "", categories: categories || [] });
  return new Response(JSON.stringify(words), { status: 200 });
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
  const word = await Word.create(requestData);
  return new Response(JSON.stringify(word), { status: 200 });
}