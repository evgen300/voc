"use client"

import React, { useEffect } from "react";
import { useCookies } from 'next-client-cookies';
import { useRouter, usePathname } from "next/navigation";

import { useProjectContext } from "@/context/modules/ProjectsContext";

export default function ProjectsPage() {

  const cookies = useCookies();
  const { projects, getList, loadProject } = useProjectContext();

  const router = useRouter();

  useEffect(() => {
    getList();
  }, [  ]);

  const setCurrentProject = async function (project_id: string) {
    await loadProject(project_id);
    await cookies.set('project_id', project_id);
    router.push(`/words`);
  }

  return (
    <div className="projects-list">
      { projects.map((project, idx) => {
        return (
          <div key={idx} className="project" onClick={() => {
            setCurrentProject(project._id || "");
          }}>
            <div className="title">{project.name}</div>
            <div className="lang">{project.language?.name}</div>
          </div>
        )
      }) }
    </div>
  )
}