"use client"

import React, { useState, useEffect, useActionState } from "react";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useProjectContext, ProjectInterface } from "@/context/modules/ProjectsContext";
import { Dropdown } from "primereact/dropdown";
import { useDataContext } from "@/context/modules/DataContext";

export default function CreateProject() {

  const router = useRouter();

  const [ creatingProject, setCreatingProject ] = useState<ProjectInterface>({
    name: "",
    language_id: ""
  });

  const { createProject, setProjectLocal, loadProject } = useProjectContext();
  const { languages, getLanguages } = useDataContext();

  const { t } = useTranslation();
  
  useEffect(() => {
    if (languages.length === 0) {
      getLanguages();
    }
  }, [  ]);

  const setProjectData = async function (field: 'name' | 'language_id', value: string) {
    let assignProject = {...creatingProject};
    assignProject[field] = value;
    setCreatingProject(assignProject);
  }

  const addProject = async function (prevState: FormState, data: FormData): Promise<FormState> {
    let insertData = {...creatingProject};
    const response = await createProject(insertData);
    if (response && response._id) {
      await loadProject(response._id);
      setProjectLocal(response._id);
    }
    router.push('/words');
    return prevState;
  }

  type FormState = {
    message?: ''
  };

  const [ state, formAction, pending ] = useActionState<FormState, FormData>(addProject, {});

  return (
    <div className="word-form project-form">
       <form action={formAction}>
        <div className="form-fields">
          <div className="form-row -cols-2">
            <div className="form-field">
              <div className="field-label">{ t('title') }</div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <input name="name" value={creatingProject.name} onChange={(e) => setProjectData('name', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="form-field">
              <div className="field-label">
                { t('language') }
              </div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <Dropdown value={creatingProject.language_id} options={languages} optionLabel="name" optionValue="_id" onChange={(e) => setProjectData('language_id', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="form-row -cols-6">
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field">
              <button type="submit" className="button -primary" disabled={ pending }>
                { pending ? t('saving') : t('save') }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}