"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { useWordContext, WordInterface, WordsFilterInterface } from "@/context/modules/WordsContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";
import { useDataContext, DataInterface } from "@/context/modules/DataContext";

import WordsSearchResult from "@/components/words/WordsSearchResult";

export default function WordsList() {

  const [ words, setWords ] = useState<Array<WordInterface>>([]);
  //const [ filters, setFilters ] = useState<WordsFilterInterface>({});
  const [ lastFilters, setLastFilters ] = useState<WordsFilterInterface>({});
  const [ categoriesFilter, setCategoriesFilter ] = useState<Array<DataInterface>>([]);

  const { getList, deleteWord, wordsFilters, setWordsFilters } = useWordContext();
  const { currentProject } = useProjectContext();
  const { getTypes, types, getCategories, categories } = useDataContext();

  useEffect(() => {
    if (currentProject && currentProject._id) {
      filterWords();
    }
  }, [ currentProject ]);

  useEffect(() => {
    getTypes();
    loadFilterCategories();
  }, [ ]);

  const loadFilterCategories = async function() {
    const categoriesList = await getCategories();
    setCategoriesFilter([{_id: "empty", name: "Not set"}].concat(categoriesList));
  }

  const filterWords = async function() {
    setLastFilters({...wordsFilters});
    setWords(await getList(currentProject._id, wordsFilters.search, wordsFilters.word, wordsFilters.transcription, wordsFilters.translation, wordsFilters.notes, wordsFilters.type_id, wordsFilters.categories));
  }

  const resetFIlters = async function() {
    let newFilters = {...wordsFilters};
    Object.keys(wordsFilters).forEach(filterFiled => {
      newFilters[filterFiled as keyof WordsFilterInterface] = "";
    });
    setWordsFilters(newFilters);
    await filterWords();
  }

  const setFilterValue = function(field: string, value: string) {
    let wordFilters = wordsFilters;
    wordFilters[field as keyof WordsFilterInterface] = value;
    setWordsFilters(wordFilters);
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const confirmRemove = async function(word: WordInterface) {
    confirmDialog({
      message: word.word,
      header: 'Remove word?',
      className: 'confirm-dialog',
      acceptClassName: 'button -primary',
      rejectClassName: 'button',
      accept: async () => {
        await deleteWord(word._id);
        await filterWords();
      }
    });
  }

  const getFormattedFieldText = function(text: string, field: string = '') {
    return (
      <WordsSearchResult filters={lastFilters} text={text} field={field}></WordsSearchResult>
    )
  }

  return (
    <div>
      <ConfirmDialog />
      <h1 className="section-title">Words list</h1>
      <Link className="button -primary" href={"/words/create"}>
        <i className="fa-solid fa-plus"></i>&nbsp;Add
      </Link>
      <div className="items-list -words-filter">
        <div className="item-row -rows-7">
          <div className="item-field">
            Filter:<br /><input name="filter" value={ wordsFilters.search || "" } onChange={(e) => setWordsFilters({...wordsFilters, search: e.target.value})} />
          </div>
          <div className="item-field">
            Word:<br/><input name="word" value={ wordsFilters.word || "" } onChange={(e) => setWordsFilters({...wordsFilters, word: e.target.value})} />
          </div>
          <div className="item-field">
            Transcription:<br/><input name="transcription" value={ wordsFilters.transcription || "" } onChange={(e) => setWordsFilters({...wordsFilters, transcription: e.target.value})} />
          </div>
          <div className="item-field">
            Translation:<br/><input name="translation" value={ wordsFilters.translation || "" } onChange={(e) => setWordsFilters({...wordsFilters, translation: e.target.value})} />
          </div>
          <div className="item-field">
            Notes:<br /><input name="notes" value={ wordsFilters.notes || "" } onChange={(e) => setWordsFilters({...wordsFilters, notes: e.target.value})} />
          </div>
          <div className="item-field">
            Type:<br /><Dropdown value={wordsFilters.type_id} options={types} onChange={(e: DropdownChangeEvent) => setWordsFilters({...wordsFilters, type_id: e.value})} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
          </div>
          <div className="item-field">
            Categories:<br /><MultiSelect value={wordsFilters.categories} options={categoriesFilter} onChange={(e: MultiSelectChangeEvent) => setWordsFilters({...wordsFilters, categories: e.value})} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
          </div>
        </div>
        <div className="item-row -rows-5">
          <div className="item-field">
            <div className="button -primary" onClick={() => filterWords()}>Apply</div>
          </div>
          <div className="item-field">
            <div className="button" onClick={() => resetFIlters()}>Reset</div>
          </div>
        </div>
      </div>
      <div className="items-list -words-list">
        <div className="items-header item-row -rows-5">
          <div className="item-header">Word</div>
          <div className="item-header">Transcription</div>
          <div className="item-header">Translation</div>
          <div className="item-header">Notes</div>
        </div>
        { words.map((word, idx) => {
          return (
            <div key={'word' + idx}>
              <div key={idx} className="item-row -rows-6 -word-row">
                <div className="item-field">
                  { word.audio ? (
                    <i className="fa-regular fa-circle-play" onClick={() => playAudio(word.audio || "")}></i>
                  ) : '' }
                </div>
                <div className="item-field">
                  { getFormattedFieldText(word.word, 'word') }
                </div>
                <div className="item-field">
                  { word.transcription.length > 0 ? 
                    (
                      <>[{ getFormattedFieldText(word.transcription, 'transcription') }]</>
                    ) : ''
                  }
                </div>
                <div className="item-field">{ getFormattedFieldText(word.translation, 'translation') }</div>
                <div className="item-field">{ getFormattedFieldText(word.notes, 'notes') }</div>
                <div className="item-action">
                  <Link href={`/words/${word._id}/edit`}>
                    <i className="fa-solid fa-pencil"></i>
                  </Link>
                  <i onClick={() => {
                    confirmRemove(word);
                  }} className="fa-solid fa-trash"></i>
                </div>
              </div>
              { word.forms.map((form, formIdx) => {
                return (
                  <div key={formIdx} className="item-row -rows-6">
                    <div className="item-field">
                      { form.audio ? (
                        <i className="fa-regular fa-circle-play" onClick={() => playAudio(form.audio || "")}></i>
                      ) : '' }
                    </div>
                    <div className="item-field">{ getFormattedFieldText(form.word, 'word') }</div>
                    <div className="item-field">
                      { form.transcription.length > 0 ? 
                        (
                          <>[{ getFormattedFieldText(form.transcription, 'transcription') }]</>
                        ) : ''
                      }
                    </div>
                    <div className="item-field">{ getFormattedFieldText(form.translation, 'translation') }</div>
                    <div className="item-field">{ getFormattedFieldText(form.notes, 'notes') }</div>
                  </div>
                )
              }) }
            </div>
          )
        }) }
      </div>
    </div>
  )
}