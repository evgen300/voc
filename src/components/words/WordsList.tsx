"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { useWordContext, WordInterface, WordsFilterInterface, PaginationInterface } from "@/context/modules/WordsContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";
import { useDataContext, DataInterface } from "@/context/modules/DataContext";

import WordsSearchResult from "@/components/words/WordsSearchResult";
import Pagination from "@/components/Pagination";

interface PrintConfig {
  word: boolean,
  transcription: boolean,
  translation: boolean,
  notes: boolean
};

export default function WordsList() {

  const [ words, setWords ] = useState<Array<WordInterface>>([]);
  const [ wordsPagination, setWordsPagination ] = useState<PaginationInterface>({page: 1, pages: 0, total: 0, onpage: 100});
  //const [ filters, setFilters ] = useState<WordsFilterInterface>({});
  const [ lastFilters, setLastFilters ] = useState<WordsFilterInterface>({});
  const [ categoriesFilter, setCategoriesFilter ] = useState<Array<DataInterface>>([]);
  const [ printConfig, setPrintConfig ] = useState<PrintConfig>({word: true, transcription: true, translation: true, notes: true});

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

  const applyFilters = async function () {
    wordsPagination.page = 1;
    await filterWords();
  }

  const filterWords = async function() {
    setLastFilters({...wordsFilters});
    const wordsData = await getList(currentProject._id, wordsFilters.search, wordsFilters.word, wordsFilters.transcription, wordsFilters.translation, wordsFilters.notes, wordsFilters.type_id, wordsFilters.categories, wordsPagination.page, wordsPagination.onpage);
    setWords(wordsData.words);
    setWordsPagination({...wordsData.pagination, pages: Math.ceil(wordsData.pagination.total / wordsPagination.onpage)});
  }

  const resetFIlters = async function() {
    wordsPagination.page = 1;
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
  };

  const getFormattedFieldText = function(text: string, field: string = '') {
    return (
      <WordsSearchResult filters={lastFilters} text={text} field={field}></WordsSearchResult>
    )
  };

  const getPrintColsConfig = function () {
    let config = `-print-cols`;
    Object.keys(printConfig).forEach(key => {
      config+= printConfig[key as keyof PrintConfig] ? '-1' : '-0';
    });
    return config;
  };

  const changePage = async function(pagenum: number) {
    if (wordsPagination.page !== pagenum) {
      wordsPagination.page = pagenum;
      filterWords();
    }
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
            <div className="button -primary" onClick={() => applyFilters()}>Apply</div>
          </div>
          <div className="item-field">
            <div className="button" onClick={() => resetFIlters()}>Reset</div>
          </div>
        </div>
      </div>
      <div className="items-list">
        <div className="item-row -rows-5">
          <div className="item-field">
            <label>
              Word: <input type="checkbox" checked={printConfig.word} onChange={(e) => {
                setPrintConfig({...printConfig, word: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              Transcription: <input type="checkbox" checked={printConfig.transcription} onChange={(e) => {
                setPrintConfig({...printConfig, transcription: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              Translation: <input type="checkbox" checked={printConfig.translation} onChange={(e) => {
                setPrintConfig({...printConfig, translation: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              Notes: <input type="checkbox" checked={printConfig.notes} onChange={(e) => {
                setPrintConfig({...printConfig, notes: e.target.checked});
              }} />
            </label>
          </div>
        </div>
      </div>
      <div className="items-list -words-list print-section">
        <div className="items-header item-row -rows-6 -no-print">
          <div></div>
          <div className="item-header">Word</div>
          <div className="item-header">Transcription</div>
          <div className="item-header">Translation</div>
          <div className="item-header">Notes</div>
        </div>
        { words.map((word, idx) => {
          return (
            <div key={'word' + idx}>
              <div key={idx} className={"item-row -rows-6 -word-row " + getPrintColsConfig()}>
                <div className="item-field -no-print">
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
                <div className="item-action -no-print">
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
                  <div key={formIdx} className={`item-row -rows-6 ` + getPrintColsConfig()}>
                    <div className="item-field -no-print">
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
      <Pagination pagination={ wordsPagination } action={ changePage } />
    </div>
  )
}