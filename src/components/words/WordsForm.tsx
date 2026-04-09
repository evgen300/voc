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

  const [ editWord, setEditWord ] = useState<WordInterface>({word: "", transcription: "", translation: "", notes: "", forms: [], categories: [], type_id: ""});

  const { setWordAudio } = useWordContext();
  const { categories, getCategories, types, getTypes } = useDataContext();
  const { currentProject } = useProjectContext();

  useEffect(() => {
    setEditWord(wordData);
  }, [ wordData ]);

  useEffect(() => {
    getTypes();
    getCategories();
  }, [ ]);

  const addForm = function () {
    let wordForms = [...editWord.forms, {word: "", transcription: "", translation: "", notes: ""}];
    //wordForms.push({word: "", transcription: "", translation: "", notes: ""});
    setEditWord({...editWord, forms: [...wordForms]});
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
      ...editWord.forms.slice(0, afterIdx + 1),
      // New item:
      {...editWord.forms[afterIdx- + 1], word: "", transcription: "", translation: "", notes: ""},
      // Items after the insertion point:
      ...editWord.forms.slice(afterIdx + 1)
    ];
    setEditWord({...editWord, forms: [...nextForms]});
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
    let wordForms = [...editWord.forms].filter((form, idx) => {
      return idx !== afterIdx;
    });
    
    setEditWord({...editWord, forms: [...wordForms]});
  }

  const moveFormUp = function (idx: number) {
    if (idx === 0) {
      let newWord = editWord.forms[0].word;
      let newTranslation = editWord.forms[0].translation;
      let newTranscription = editWord.forms[0].transcription;
      let newNotes = editWord.forms[0].notes;
      let newAudio = editWord.forms[0].audio;
      let newForms = [...editWord.forms];
      newForms[0] = {word: editWord.word, translation: editWord.translation, transcription: editWord.transcription, notes: editWord.notes, audio: editWord.audio};
      let newEditData = {...editWord};

      newEditData.word = newWord;
      newEditData.transcription = newTranscription;
      newEditData.translation = newTranslation;
      newEditData.notes = newNotes;
      newEditData.audio = newAudio;
      newEditData.forms = [...newForms];
      setEditWord(newEditData);
      return;
    }
    const newForms = editWord.forms.map((form, formIdx) => {
      if (formIdx < idx - 1 || formIdx > idx) {
        return {...form};
      } else if (formIdx === idx - 1) {
        return {...editWord.forms[idx]};
      } else if (formIdx === idx) {
        return {...editWord.forms[idx - 1]};
      } else {
        return {...form};
      }
    });
    setEditWord({...editWord, forms: [...newForms]});
  }

  const moveFormDown = function (idx: number) {
    const newForms = editWord.forms.map((form, formIdx) => {
      if (formIdx < idx || formIdx > idx + 1) {
        return {...form};
      } else if (formIdx === idx + 1) {
        return {...editWord.forms[idx]};
      } else if (formIdx === idx) {
        return {...editWord.forms[idx + 1]};
      } else {
        return {...form};
      }
    });
    setEditWord({...editWord, forms: [...newForms]});
  }

  const handleSubmitForm = async function(prevState: FormData, data: FormData) {
    let insertData = {...editWord};
    insertData.project_id = currentProject._id;
    await action(insertData);
  }

  const setFormValue = function(idx: number, field: string, value: string) {
    const changedForms = editWord.forms.map((form, formIdx) => {
      if (formIdx !== idx) {
        return {...form};
      } else {
        let changedForm = {...form};
        changedForm[field as keyof WordFormInterface] = value;
        return changedForm;
      }
    });
    setEditWord({...editWord, forms: [...changedForms]});
  }

  const setWordValue = function(field: string, value: string) {
    let wordData = {...editWord};
    wordData[field as keyof WordInterface] = value;
    setEditWord({...wordData});
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const createAudio = async function (word_id: string, formIdx: number | null = null) {
    const response = await setWordAudio(word_id, formIdx);
    console.log(response);
    if (formIdx === null) {
      editWord.audio = response.audio;
    } else {
      const newForms = response.forms.map((form: WordFormInterface, idx: number) => {
      return {...form};
    });
    setEditWord({...editWord, forms: [...newForms]});
    }
  }

  const setTypeId = function(type_id: string) {
    editWord.type_id = type_id;
    setEditWord({...editWord});
  }

  const setCategories = function(categories: Array<string>) {
    editWord.categories = categories;
    setEditWord({...editWord});
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
                <input name="word" value={editWord.word} onChange={(e) => setWordValue('word', e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              { editWord.audio ? (
                <i className="fa-solid fa-play" onClick={() => playAudio(editWord.audio || "")}></i>
              ) : '' }
              <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(wordData._id || "")}></i>
            </div>
            <div className="form-field">
              <div className="field-value">
                <input name="transcription" value={editWord.transcription} onChange={(e) => setWordValue('transcription', e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <input name="translation" value={editWord.translation} onChange={(e) => setWordValue('translation', e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <div className="field-value">
                <textarea name="notes" value={editWord.notes} rows={3} cols={30} onChange={(e) => setWordValue('notes', e.target.value)}></textarea>
              </div>
            </div>
          </div>
          <div className="form-row -cols-2">
            <div className="form-field">
              <div className="field-label">Type</div>
              <div className="field-value">
                <Dropdown value={editWord.type_id} options={types} onChange={(e: MultiSelectChangeEvent) => setTypeId(e.value)} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
              </div>
            </div>
            <div className="form-field">
              <div className="field-label">Category</div>
              <div className="field-value">
                <MultiSelect value={editWord.categories} options={categories} onChange={(e: MultiSelectChangeEvent) => setCategories(e.value)} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
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
          { editWord.forms.map((form, idx) => {
            return (
              <div key={ idx } className="form-row -cols-6">
                <div className="form-field">
                  <div className="field-label">
                    <i className="fa-solid fa-angle-up" onClick={() => moveFormUp(idx)}></i>
                    { idx < editWord.forms.length - 1 ? 
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
              <div className="button" onClick={() => {
                addForm()
              }}>
                + Add row
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
                { pending ? 'Saving' : 'Save' }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}