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
  let limitRequest = req.nextUrl.searchParams.get('limit');
  const limit = parseInt(limitRequest || "") > 0 ? parseInt(limitRequest || "") : null;
  await dbConnect();
  const test = await Word.getTranslateToTest({ project_id: project_id || "", limit: limit });
  return new Response(JSON.stringify(test), { status: 200 });
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
  const result = await Word.validateToTest(requestData.test, requestData.project_id);
  return new Response(JSON.stringify(result), { status: 200 });
}