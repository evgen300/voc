'use client'

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LeftMenuPage() {

  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const links: any = {
    'projects': {
      icon: 'fa-solid fa-shield'
    },
    'words': {
      icon: 'fa-solid fa-font'
    },
    'phrases': {
      icon: 'fa-solid fa-comment'
    },
    'practice': {
      icon: 'fa-solid fa-dumbbell'
    }
  };

  useEffect(() => {
    //if (links.hasOwnProperty(`${pathname.replace(/^\//, '')}`)) {
      //setBreadcrumbs([]);
    //}
  } , [ pathname ]);

  const handleSignOut = async function () {
    //await signOut({ redirect: false });
    //router.push('/');
  }

  return (
    <div className="left-menu">
      <div>
        { Object.keys(links).map((link, linkIndex) => {
          return (
            <div key={linkIndex} className={"menu-item " + (pathname.indexOf(link) === 1 ? " -selected" : "")}>
              <Link href={"/" + link}>
              <i className={links[link].icon}></i>&nbsp;
                { t(link) }
              </Link>
            </div>
          )
        }) }
      </div>
    </div>
  )
}