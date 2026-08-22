"use client"

import React, { useState, useEffect, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import lodash from "lodash";

import { useWordContext, WordInterface, WordFormInterface, VerbFormInterface, VerbTimes, VerbForms } from "@/context/modules/WordsContext";
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

  const [ editWord, setEditWord ] = useState<WordInterface>({word: "", transcription: "", translation: "", notes: "", forms: [], categories: [], type_id: "", verb_times: []});
  const [ saved, setSaved ] = useState<boolean>(false);

  const { setWordAudio } = useWordContext();
  const { categories, getCategories, types, getTypes } = useDataContext();
  const { currentProject } = useProjectContext();
  const { t } = useTranslation();

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

  const addTime = function () {
    let wordTimes = [...editWord.verb_times, { time: '', forms: [{type: '', word: "", transcription: "", translation: "", notes: ""}]}];
    console.log(wordTimes)
    console.log({...editWord, verb_times: [...wordTimes]})
    setEditWord({...editWord, verb_times: [...wordTimes]});
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
  };

  const insertTimeForm = function (timeIdx: number, afterIdx: number) {
    const nextTimes = [
      // Items before the insertion point:
      ...editWord.verb_times[timeIdx].forms.slice(0, afterIdx + 1),
      // New item:
      {...editWord.verb_times[timeIdx].forms[afterIdx- + 1], type: '', word: "", transcription: "", translation: "", notes: ""},
      // Items after the insertion point:
      ...editWord.verb_times[timeIdx].forms.slice(afterIdx + 1)
    ];
    let verbTimes = editWord.verb_times;
    verbTimes[timeIdx].forms = nextTimes;
    //console.log(nextTimes);
    //console.log({...editWord, verb_times: [...nextTimes]});
    setEditWord({...editWord, verb_times: [...verbTimes]});
  };

  const deleteForm = function (afterIdx: number) {
    let wordForms = [...editWord.forms].filter((form, idx) => {
      return idx !== afterIdx;
    });
    
    setEditWord({...editWord, forms: [...wordForms]});
  };

  const deleteTimeForm = function (timeIdx: number, afterIdx: number) {
    let nextTimes = [...editWord.verb_times];
    nextTimes[timeIdx].forms = nextTimes[timeIdx].forms.filter((form, idx) => {
      return idx !== afterIdx;
    });
    
    setEditWord({...editWord, verb_times: [...nextTimes]});
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

  const handleSubmitForm = async function(prevState: FormState, data: FormData): Promise<FormState> {
    let insertData = {...editWord};
    insertData.project_id = currentProject._id;
    await action(insertData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
    return prevState;
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
  };

  const setTimeFormValue = function(timeIdx: number, idx: number, field: keyof VerbFormInterface, value: string) {
    let changedTimes = [...editWord.verb_times];
    changedTimes[timeIdx].forms = changedTimes[timeIdx].forms.map((form, formIdx) => {
      if (formIdx !== idx) {
        return {...form};
      } else {
        let changedForm = {...form};
        changedForm[field] = value;
        return changedForm;
      }
    });
    setEditWord({...editWord, verb_times: [...changedTimes]});
  }

  const setWordValue = function(field: 'word' | 'transcription' | 'translation' | 'notes', value: string) {
    let wordData = {...editWord};
    wordData[field] = value;
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

  const setTimeValue = function (timeIdx: number, time: string) {
    let nextTimes = [...editWord.verb_times];
    nextTimes[timeIdx].time = time;
    setEditWord({...editWord, verb_times: nextTimes});
  };

  const setTimeFormType = function(timeIdx: number, formIdx: number, type: string) {
    let nextTimes = [...editWord.verb_times];
    nextTimes[timeIdx].forms[formIdx].type = type;
    setEditWord({...editWord, verb_times: [...nextTimes]});
  };

  const filteredTimes = function(current: string = '') {
    return VerbTimes.filter(vTime => {
      if (current === vTime.key) {
        return true;
      }
      const present = editWord.verb_times.find(word_time => {
        return word_time.time === vTime.key;
      });
      return !present;
    });
  }

  const [ state, formAction, pending ] = useActionState<FormState, FormData>(handleSubmitForm, {});

  return (
    <div className="word-form">
      <form action={formAction}>
        <div className="form-fields">
          <div className="word-form-section">
          <div className="form-row -cols-4">
            <div className="form-field">
              <div className="field-label">{ t('word') }</div>
            </div>
            <div className="form-field">
              <div className="field-label">{ t('transcription') }</div>
            </div>
            <div className="form-field">
              <div className="field-label">{ t('translation') }</div>
            </div>
            <div className="form-field">
              <div className="field-label">{ t('notes') }</div>
            </div>
          </div>
          <div className="form-row -cols-4">
            <div className="form-field">
              <div className="field-value">
                <input name="word" value={editWord.word} onChange={(e) => setWordValue('word', e.target.value)} />
              </div>
            </div>
            { /*
            <div className="form-field">
              { editWord.audio ? (
                <i className="fa-solid fa-play" onClick={() => playAudio(editWord.audio || "")}></i>
              ) : '' }
              <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(wordData._id || "")}></i>
            </div>
            */ }
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
              <div className="field-label">{ t('type') }&nbsp;
                <Dropdown value={editWord.type_id} options={types} onChange={(e: MultiSelectChangeEvent) => setTypeId(e.value)} optionLabel="name" optionValue="key" />
              </div>
            </div>
            <div className="form-field">
              <div className="field-label">{ t('category') }&nbsp;
                <MultiSelect value={editWord.categories} options={categories} onChange={(e: MultiSelectChangeEvent) => setCategories(e.value)} optionLabel="name" optionValue="_id" />
              </div>
            </div>
          </div>
          </div>
          <div className="word-form-section">
          { editWord.forms.length > 0 ? (
            <div className="form-row -cols-5">
              <div className="form-field"></div>
              <div className="form-field">
                <div className="field-label">{ t('word') }</div>
              </div>
              <div className="form-field">
                <div className="field-label">{ t('transcription') }</div>
              </div>
              <div className="form-field">
                <div className="field-label">{ t('translation') }</div>
              </div>
              <div className="form-field">
                <div className="field-label">{ t('notes') }</div>
              </div>
            </div>
          ) : '' }
          { editWord.forms.map((form, idx) => {
            return (
              <div key={ idx } className="word-forms-container">
                <div className="form-row -cols-5">
                  <div className="form-field">
                    <div className="field-label">
                      <i className="fa-solid fa-angle-up icon-button" onClick={() => moveFormUp(idx)}></i>
                      { idx < editWord.forms.length - 1 ? 
                      (<i className="fa-solid fa-angle-down icon-button" onClick={() => moveFormDown(idx)}></i>) : 
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
                  { /*
                  <div className="form-field">
                    { form.audio ? (
                      <i className="fa-solid fa-play" onClick={() => playAudio(form.audio || "")}></i>
                    ) : '' }
                    <i className="fa-solid fa-arrows-rotate" onClick={() => createAudio(wordData._id || "", idx)}></i>
                  </div>
                  */ }
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
                    </div>
                  </div>
                </div>
                  <div className="form-row -small">
                    <div className="form-field">
                      <div className="field-value">
                      { idx < editWord.forms.length - 1 ? (
                        <span className="form-pill -add" onClick={(e) => {
                            insertForm(idx);
                          }}>
                          <i className="fa-solid fa-angles-down -add-item"></i>{ t('add_form_below') }
                        </span>
                      ) : '' }
                        <span className="form-pill -remove" onClick={() => {
                            deleteForm(idx);
                          }}>
                          <i className="fa-solid fa-trash-can -remove-item"></i>{ t('delete_form') }
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            )
          }) }
          <div className="form-row">
            <div className="form-field"></div>
            <div className="form-field">
              <div className="button -additional" onClick={() => {
                addForm()
              }}>
                + { t('add_form') }
              </div>
            </div>
          </div>
          </div>
          { editWord.type_id === "verb" ? (
            <div className="word-form-section">
              <div className="form-row">
                <div className="form-field">{ t('verb_times') } <span className="button -additional" onClick={() => {
                    addTime()
                  }}>+ { t('add_time') }</span></div>
              </div>
              { editWord.verb_times.map((v_time, idx) => {
                return (
                  <div key={ idx } className="word-forms-container">
                  <div className="form-row -cols-6">
                    <div className="form-field">
                      <div className="field-label">{ t('time') } <Dropdown value={v_time.time} options={filteredTimes(v_time.time)} optionLabel="label" optionValue="key" onChange={(e) => setTimeValue(idx, e.value)} /></div>
                    </div>
                  </div>
                  { v_time.forms.map((form, formIdx) => {
                  return (
                    <div key={ formIdx } className="word-forms-container">
                      <div className="form-row -cols-5 -verb-time-forms">
                        <div className="form-field">
                          <div className="field-value">
                            <Dropdown value={form.type} options={VerbForms} optionLabel="label" optionValue="key" onChange={(e) => setTimeFormType(idx, formIdx, e.value)} />
                          </div>
                        </div>
                        <div className="form-field">
                          <div className="field-value">
                            <input value={form.word} onChange={(e) => {
                              setTimeFormValue(idx, formIdx, 'word', e.target.value);
                            }} />
                          </div>
                        </div>
                        <div className="form-field">
                          <div className="field-value">
                            <input value={form.transcription} onChange={(e) => {
                              setTimeFormValue(idx, formIdx, 'transcription', e.target.value);
                            }} />
                          </div>
                        </div>
                        <div className="form-field">
                          <div className="field-value">
                            <input value={form.translation} onChange={(e) => {
                              setTimeFormValue(idx, formIdx, 'translation', e.target.value);
                            }} />
                          </div>
                        </div>
                        <div className="form-field">
                          <div className="field-value">
                            <textarea value={form.notes} rows={3} cols={7} onChange={(e) => {
                              setTimeFormValue(idx, formIdx, 'notes', e.target.value);
                            }}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="form-row -small">
                        <div className="form-field">
                          <div className="field-value">
                            <span className="form-pill -add" onClick={(e) => {
                                insertTimeForm(idx, formIdx);
                              }}>
                              <i className="fa-solid fa-angles-down -add-item"></i>{ t('add_form_below') }
                            </span>
                            <span className="form-pill -remove" onClick={() => {
                                deleteTimeForm(idx, formIdx);
                              }}>
                              <i className="fa-solid fa-trash-can -remove-item"></i>{ t('delete_form') }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  }) }
                </div>
                )
              }) }
            </div>
          ) : '' }
          <div className="form-row -cols-6">
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field"></div>
            <div className="form-field">
              { saved ? (
                <span className="button -additional">{ t('saved') }</span>
              ) : (
                <button type="submit" className="button -primary" disabled={ pending }>
                  { pending ? t('saving') : t('save') }
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}