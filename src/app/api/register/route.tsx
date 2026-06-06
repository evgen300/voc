"use server"

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
//import { getServerSession } from 'next-auth/next';
//import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function POST(req: NextRequest) {
  /*const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify([]), { status: 401 });
  }*/
  await dbConnect();
  //const list = await Company.create(session.user.roles.includes('admin') ? null : session.user.id);
  let requestData = await req.json();
  const {name, email, password} = requestData;
  
  const user = await User.register({
    name: name,
    password: password,
    email: email
  });

  return new Response(JSON.stringify({ success: !user.hasOwnProperty('error'), data: user }), { status: 200 });
}