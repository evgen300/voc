import { cookies } from "next/headers";

import MainPage from "@/components/Main"

export default async function HomePage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const projectIdCookie = cookieStore.get('project_id');
  const project_id = projectIdCookie?.value;

  return (
    <MainPage project_id={ project_id || "" }>
      <div>{ children }</div>
    </MainPage>
  )
}