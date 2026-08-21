"use client"

import React from "react";
import { useTranslation } from "react-i18next";

export default function Manual() {
  const { t } = useTranslation();

  return (
    <div className="manual-page">
      <h1>{ t('manual_title') }</h1>
      <p>{ t('manual_intro') }</p>

      <section>
        <h2>{ t('manual_section_word_title') }</h2>
        <p>{ t('manual_section_word_body') }</p>
      </section>

      <section>
        <h2>{ t('manual_section_forms_title') }</h2>
        <p>{ t('manual_section_forms_body') }</p>
        <p className="-note">{ t('manual_section_forms_note') }</p>
      </section>

      <section>
        <h2>{ t('manual_section_verbs_title') }</h2>
        <p>{ t('manual_section_verbs_body') }</p>
      </section>

      <section>
        <h2>{ t('manual_section_save_title') }</h2>
        <p>{ t('manual_section_save_body') }</p>
      </section>
    </div>
  )
}
