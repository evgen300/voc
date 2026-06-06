"use client"

import { useProjectContext } from "@/context/modules/ProjectsContext";
import ProjectsPage from "@/components/projects/Projects";

interface MainPageProps {
  project_id: string
};

export default function MainPage({ project_id, children = (<div></div>) }: Readonly<{
  children?: React.ReactNode,
  project_id: string
}>) {

  if (true || !project_id) {
    return (
      <ProjectsPage></ProjectsPage>
    )
  }
  return (
    <div>IN MAIN{ children }</div>
  )
}