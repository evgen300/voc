'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { useTranslation } from "react-i18next";

import { useProjectContext } from "@/context/modules/ProjectsContext";

export default function HeaderPage() {

  const { currentProject } = useProjectContext();
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="header-components">
        <div className="header-item">
          <Link href={"/"}>
            <h1 className={"ext-base sm:text-lg textGradient "}>
              <i className="fa-solid fa-house"></i>
            </h1>
          </Link>
        </div>
        <div className="header-item">
          { currentProject && currentProject._id ? (
            <span>{ currentProject.name }
            <img src={"/icons/flags/" + currentProject.language?.code + ".png"} /></span>
          ) : '' }
        </div>
        <div className="header-item">
          <Link href="/manual" title={t('manual_link')}>
            <i className="fa-solid fa-circle-question"></i> { t('manual_link') }
          </Link>
        </div>
      </div>
      <div className="breadcrumbs">
      </div>
    </div>
  )
}