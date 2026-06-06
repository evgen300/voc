"use client"

import React, { useEffect } from "react";

import { useProjectContext } from "@/context/modules/ProjectsContext";
import { useAuthContext } from "@/context/modules/AuthContext";
import ProjectsPage from "@/components/projects/Projects";
import LoaderMain from "@/components/LoaderMain";
import Login from "@/components/auth/Login";

interface MainPageProps {
  project_id: string
};

export default function MainContainer({ project_id, children = (<div></div>) }: Readonly<{
  children?: React.ReactNode,
  project_id: string
}>) {

  const { status } = useAuthContext();
  const { loadProject } = useProjectContext();

  useEffect(() => {
    if (project_id) {
      loadProject(project_id);
    }
  }, [ project_id ])

  if (status === "loading") {
    return (
      <LoaderMain></LoaderMain>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Login></Login>
    )
  }

  if (!project_id) {
    return (
      <ProjectsPage></ProjectsPage>
    )
  }
  return (
    <div className="voc-main">{ children }</div>
  )
}