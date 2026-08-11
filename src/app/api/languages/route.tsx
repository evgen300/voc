"use server"

import dbConnect from "@/lib/mongodb";
import Languages from "@/models/Languages";

export async function GET() {
  await dbConnect();
  const list = await Languages.getList();
  return new Response(JSON.stringify(list), { status: 200 });
}