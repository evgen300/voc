"use client"

import React, { useEffect } from "react";

import { useProjectContext } from "@/context/modules/ProjectsContext";
import ProjectsPage from "@/components/projects/Projects";

interface MainPageProps {
  project_id: string
};

export default function MainContainer({ project_id, children = (<div></div>) }: Readonly<{
  children?: React.ReactNode,
  project_id: string
}>) {

  const { loadProject } = useProjectContext();

  useEffect(() => {
    if (project_id) {
      loadProject(project_id);
    }
  }, [ project_id ])

  if (!project_id) {
    return (
      <ProjectsPage></ProjectsPage>
    )
  }
  return (
    <div className="voc-main">{ children }</div>
  )
}