"use client"

import React, { useState, useEffect, useActionState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import lodash from "lodash";

import { usePhraseContext, PhraseInterface } from "@/context/modules/PhrasesContext";
import { useDataContext, DataInterface } from "@/context/modules/DataContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";

interface PhrasesFormProps {
  phraseData: PhraseInterface,
  action: Function
}

type FormState = {
  message?: ''
};

export default function PhrasesForm(props: PhrasesFormProps) {
  const { phraseData, action } = props;

  const [ editPhrase, setEditPhrase ] = useState<PhraseInterface>({phrase: "", translation: "", notes: "", categories: []});

  const { setPhraseAudio } = usePhraseContext();
  const { categories, getCategories, types, getTypes } = useDataContext();
  const { currentProject } = useProjectContext();

  useEffect(() => {
    setEditPhrase(phraseData);
  }, [ phraseData ]);

  useEffect(() => {
    getTypes();
    getCategories();
  }, [ ]);

  const handleSubmitForm = async function(prevState: FormState, data: FormData): Promise<FormState> {
    let insertData = {...editPhrase};
    insertData.project_id = currentProject._id;
    await action(insertData);
    return prevState;
  }

  const setPhraseValue = function(field: 'phrase' | 'translation' | 'notes', value: string) {
    let phraseData = {...editPhrase};
    phraseData[field] = value;
    setEditPhrase({...phraseData});
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const createAudio = async function (word_id: string) {
    const response = await setPhraseAudio(word_id);
    console.log(response);
    editPhrase.audio = response.audio;
    setEditPhrase({...editPhrase});
  }

  const setCategories = function(categories: Array<string>) {
    editPhrase.categories = categories;
    setEditPhrase({...editPhrase});
  }

  const [ state, formAction, pending ] = useActionState<FormState, FormData>(handleSubmitForm, {});

  return (
    <div className="phrase-form">
      <form action={formAction}>
        <div className="form-fields">
          <div className="form-row -cols-2">
            <div className="field-label">Phrase</div>
            <div className="field-value">
              <textarea name="phrase" value={editPhrase.phrase} onChange={(e) => setPhraseValue('phrase', e.target.value)} rows={3} cols={60}></textarea>
              { editPhrase.audio ? (
                <i className="fa-solid fa-play" onClick={() => playAudio(editPhrase.audio || "")}></i>
              ) : '' }
              <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(phraseData._id || "")}></i>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="field-label">Translation</div>
            <div className="field-value">
              <textarea name="translation" value={editPhrase.translation} onChange={(e) => setPhraseValue('translation', e.target.value)} rows={3} cols={60}></textarea>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="field-label">Notes</div>
            <div className="field-value">
              <textarea name="notes" value={editPhrase.notes} rows={3} cols={60} onChange={(e) => setPhraseValue('notes', e.target.value)}></textarea>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="field-label">Category</div>
            <div className="field-value">
              <MultiSelect value={editPhrase.categories} options={categories} onChange={(e: MultiSelectChangeEvent) => setCategories(e.value)} optionLabel="name" optionValue="_id" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field"></div>
            <div className="form-field">
              <button type="submit" className="button -primary" disabled={ pending }>
                { pending ? 'Saving' : 'Save' }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}