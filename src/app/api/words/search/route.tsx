"use server"

import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Word from '@/models/Word';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  let search = req.nextUrl.searchParams.get('search');
  await dbConnect();
  let request : any = {};
  if (search && search.length) {
    request.search = search;
  }
  const words = await Word.search(request);
  return new Response(JSON.stringify(words), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }
  await dbConnect();
  //const list = await Company.create(session.user.roles.includes('admin') ? null : session.user.id);
  let requestData = await req.json();
  //requestData.user_id = session.user.id;
  const word = await Word.create(requestData);
  return new Response(JSON.stringify(word), { status: 200 });
}