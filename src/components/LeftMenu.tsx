'use client'

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function LeftMenuPage() {

  const router = useRouter();
  const pathname = usePathname();

  const links = {
    'projects': {
      title: 'Projects',
      icon: 'fa-solid fa-shield'
    },
    'words': {
      title: 'Words',
      icon: 'fa-solid fa-font'
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
                { links[link].title }
              </Link>
            </div>
          )
        }) }
      </div>
    </div>
  )
}