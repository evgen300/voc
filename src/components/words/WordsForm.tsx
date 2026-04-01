"use client"

import React, { useState, useEffect, useActionState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import lodash from "lodash";

import { useWordContext, WordInterface, WordFormInterface } from "@/context/modules/WordsContext";
import { useDataContext, DataInterface } from "@/context/modules/DataContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";

interface WordsFormProps {
  wordData: WordInterface,
  action: Function
}

type FormState = {
  message?: ''
};

export default function WordsForm(props: WordsFormProps) {
  const { wordData, action } = props;

  const [ word, setWord ] = useState<string>("");
  const [ transcription, setTranscription ] = useState<string>("");
  const [ translation, setTranslation ] = useState<string>("");
  const [ notes, setNotes ] = useState<string>("");
  const [ type, setType ] = useState<string>("");
  const [ forms, setForms ] = useState<Array<WordFormInterface>>([]);
  const [ category, setCategory ] = useState<Array<string>>([]);
  const [ audio, setAudio ] = useState<string>("");

  const { setWordAudio } = useWordContext();
  const { categories, getCategories, types, getTypes } = useDataContext();
  const { currentProject } = useProjectContext();

  useEffect(() => {
    setWord(wordData.word || "");
    setTranscription(wordData.transcription || "");
    setTranslation(wordData.translation || "");
    setNotes(wordData.notes || "");
    setForms(wordData.forms || []);
    setType(wordData.type_id || "");
    setCategory(wordData.categories || []);
    setAudio(wordData.audio || "");
  }, [ wordData ]);

  useEffect(() => {
    getTypes();
    getCategories();
  }, [ ]);

  const addForm = function () {
    let wordForms = [...forms, {word: "", transcription: "", translation: "", notes: ""}];
    //wordForms.push({word: "", transcription: "", translation: "", notes: ""});
    setForms([...wordForms]);
  }
  
  const insertForm = function (afterIdx: number) {
    /*let wordForms = wordData.forms;
    wordForms.splice(afterIdx + 1, 0, {word: "", transcription: "", translation: "", notes: ""});
    setForms([...wordForms]);
    wordForms.forEach((form, idx) => {
      Object.keys(form).forEach((field) => {
        console.log(idx, field, form[field]);
        setFormValue(idx, field, form[field]);
      });
    });*/
    const nextForms = [
      // Items before the insertion point:
      ...forms.slice(0, afterIdx + 1),
      // New item:
      {...forms[afterIdx- + 1], word: "", transcription: "", translation: "", notes: ""},
      // Items after the insertion point:
      ...forms.slice(afterIdx + 1)
    ];
    setForms(nextForms);
    return;
    let wordForms = lodash.cloneDeep(forms);
    let before = lodash.cloneDeep(wordForms).splice(afterIdx + 1);
    let after = lodash.cloneDeep(wordForms).splice(0, afterIdx + 1);
    const newForms = [...after, {word: "", transcription: "", translation: "", notes: ""}, ...before];
    console.log(newForms);
    setForms([]);
    setTimeout(() => {
      setForms(lodash.cloneDeep(newForms));
    }, 3000);
    newForms.forEach((form, idx) => {
      Object.keys(form).forEach((field) => {
        console.log(idx, field, form[field]);
        //setFormValue(idx, field, form[field]);
      });
    });
    /*const nextForms = forms.map((form, idx) => {
      if (idx <= afterIdx) {
        return form;
      } else if (idx === afterIdx + 1) {
        return {word: "", transcription: "", translation: "", notes: ""};
      } else {
        return wordData.forms[idx - 1];
      }
    });
    setForms(nextForms);*/
  }

  const deleteForm = function (afterIdx: number) {
    let wordForms = wordData.forms;
    wordForms.splice(afterIdx, 1);
    setForms([...wordForms]);
  }

  const moveFormUp = function (idx: number) {
    if (idx === 0) {
      let newWord = forms[0].word;
      let newTranslation = forms[0].translation;
      let newTranscription = forms[0].transcription;
      let newNotes = forms[0].notes;
      let newForms = [...forms];
      newForms[0] = {word: word, translation: translation, transcription: transcription, notes: notes};
      setWord(newWord);
      setTranscription(newTranscription);
      setTranslation(newTranslation);
      setNotes(newNotes);
      setForms(newForms);
      return;
    }
    const newForms = forms.map((form, formIdx) => {
      if (formIdx < idx - 1 || formIdx > idx) {
        return {...form};
      } else if (formIdx === idx - 1) {
        return {...forms[idx]};
      } else if (formIdx === idx) {
        return {...forms[idx - 1]};
      }
    });
    setForms(newForms);
  }

  const moveFormDown = function (idx: number) {
    const newForms = forms.map((form, formIdx) => {
      if (formIdx < idx || formIdx > idx + 1) {
        return {...form};
      } else if (formIdx === idx + 1) {
        return {...forms[idx]};
      } else if (formIdx === idx) {
        return {...forms[idx + 1]};
      }
    });
    setForms(newForms);
  }

  const handleSubmitForm = async function(prevState: FormData, data: FormData) {
    let updateData = Object.fromEntries(data);
    updateData.categories = category;
    updateData.type_id = type;
    updateData.forms = forms;
    updateData.project_id = currentProject._id;
    await action(updateData);
  }

  const setFormValue = function(idx: number, field: string, value: string) {
    const changedForms = forms.map((form, formIdx) => {
      if (formIdx !== idx) {
        return {...form};
      } else {
        let changedForm = {...form};
        changedForm[field as keyof WordFormInterface] = value;
        return changedForm;
      }
    });
    setForms(changedForms);
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const createAudio = async function (word_id: string, formIdx: number | null = null) {
    const response = await setWordAudio(word_id, formIdx);
    console.log(response);
    if (formIdx === null) {
      setAudio(response.audio);
    } else {
      const newForms = response.forms.map((form, idx) => {
      return {...form};
    });
    setForms(newForms);
    }
  }

  const [ state, formAction, pending ] = useActionState<FormState, FormData>(handleSubmitForm, new FormData());

  return (
    <div className="word-form">
      <form action={formAction}>
        <div className="form-fields">
          <div className="form-row -cols-5">
            <div className="form-field">
              <div className="field-label">Word</div>
            </div>
            <div className="form-field"></div>
            <div className="form-field">
              <div className="field-label">Transcription</div>
            </div>
            <div className="form-field">
              <div className="field-label">Translation</div>
            </div>
            <div className="form-field">
              <div className="field-label">Notes</div>
            </div>
          </div>
          <div className="form-row -cols-5">
            <div className="form-field">
              <div className="field-value">
                <input name="word" defaultValue={word} />
              </div>
            </div>
            <div className="form-field">
              { audio ? (
                <i className="fa-solid fa-play" onClick={() => playAudio(audio)}></i>
              ) : '' }
              <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(wordData._id || "")}></i>
            </div>
            <div className="form-field">
              <div className="field-value">
                <input name="transcription" defaultValue={transcription} />
              </div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <input name="translation" defaultValue={translation} />
              </div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <textarea name="notes" defaultValue={notes} rows={3} cols={30}></textarea>
              </div>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="form-field">
              <div className="field-label">Type</div>
              <div className="field-value">
                <Dropdown value={type} options={types} onChange={(e: MultiSelectChangeEvent) => setType(e.value)} optionLabel="name" optionValue="_id" />
              </div>
            </div>
            <div className="form-field">
              <div className="field-label">Category</div>
              <div className="field-value">
                <MultiSelect value={category} options={categories} onChange={(e: MultiSelectChangeEvent) => setCategory(e.value)} optionLabel="name" optionValue="_id" />
              </div>
            </div>
          </div>
          <div className="form-row -cols-6">
            <div className="form-field"></div>
            <div className="form-field">
              <div className="field-label">Word</div>
            </div>
            <div className="form-field"></div>
            <div className="form-field">
              <div className="field-label">Transcription</div>
            </div>
            <div className="form-field">
              <div className="field-label">Translation</div>
            </div>
            <div className="form-field">
              <div className="field-label">Notes</div>
            </div>
          </div>
          { forms.map((form, idx) => {
            return (
              <div key={ idx } className="form-row -cols-6">
                <div className="form-field">
                  <div className="field-label">
                    <i className="fa-solid fa-angle-up" onClick={() => moveFormUp(idx)}></i>
                    { idx < forms.length - 1 ? 
                    (<i className="fa-solid fa-angle-down" onClick={() => moveFormDown(idx)}></i>) : 
                    <span className="move-word-placeholder"></span>}
                  </div>
                </div>
                <div className="form-field">
                  <div className="field-value">
                    <input value={form.word} onChange={(e) => {
                      setFormValue(idx, 'word', e.target.value);
                    }} />
                  </div>
                </div>
                <div className="form-field">
                  { form.audio ? (
                    <i className="fa-solid fa-play" onClick={() => playAudio(form.audio || "")}></i>
                  ) : '' }
                  <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(wordData._id || "", idx)}></i>
                </div>
                <div className="form-field">
                  <div className="field-value">
                    <input value={form.transcription} onChange={(e) => {
                      setFormValue(idx, 'transcription', e.target.value);
                    }} />
                  </div>
                </div>
                <div className="form-field">
                  <div className="field-value">
                    <input value={form.translation} onChange={(e) => {
                      setFormValue(idx, 'translation', e.target.value);
                    }} />
                  </div>
                </div>
                <div className="form-field">
                  <div className="field-value">
                    <textarea value={form.notes} rows={3} cols={30} onChange={(e) => {
                      setFormValue(idx, 'notes', e.target.value);
                    }}></textarea>
                    <i className="fa fa-plus" onClick={(e) => {
                      insertForm(idx);
                    }}></i>
                    <i className="fa fa-minus" onClick={() => {
                      deleteForm(idx);
                    }}></i>
                  </div>
                </div>
              </div>
            )
          }) }
          <div className="form-row">
            <div className="form-field"></div>
            <div className="form-field">
              <div className="button -primary" onClick={() => {
                addForm()
              }}>
                + ADD
              </div>
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