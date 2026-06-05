'use client'

import Link from "next/link";

import { useProjectContext } from "@/context/modules/ProjectsContext";

export default function SelectPractice() {

  const { currentProject } = useProjectContext();

  return (
    <div>
      { currentProject._id ? (
        <>
          <Link href={'/practice/translate_from'} className="button -additional">Translate from { currentProject.language?.name }</Link>
          <Link href={'/practice/translate_to'} className="button -additional">Translate to { currentProject.language?.name }</Link>
        </>
      ) : '' }
    </div>
  )
}