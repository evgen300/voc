"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { useWordContext, WordInterface, WordsFilterInterface, PaginationInterface } from "@/context/modules/WordsContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";
import { useDataContext, DataInterface } from "@/context/modules/DataContext";

import WordsSearchResult from "@/components/words/WordsSearchResult";
import Pagination from "@/components/Pagination";
import { VerbTimeInterface } from "@/models/Word";
import LoaderMain from "@/components/LoaderMain";

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
  const [ wordsLoading, setWordsLoading ] = useState<boolean>(true);

  const { getList, deleteWord, wordsFilters, setWordsFilters, verbTimeLabel, verbTimeFormLabel } = useWordContext();
  const { currentProject } = useProjectContext();
  const { getTypes, types, getCategories, categories } = useDataContext();
  const { t } = useTranslation();

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
    setWordsLoading(true);
    setLastFilters({...wordsFilters});
    const wordsData = await getList(currentProject._id, wordsFilters.search, wordsFilters.word, wordsFilters.transcription, wordsFilters.translation, wordsFilters.notes, wordsFilters.type_id, wordsFilters.categories, wordsPagination.page, wordsPagination.onpage);
    setWords(wordsData.words);
    setWordsPagination({...wordsData.pagination, pages: Math.ceil(wordsData.pagination.total / wordsPagination.onpage)});
    setWordsLoading(false);
  }

  const resetFIlters = async function() {
    wordsPagination.page = 1;
    const newFilters: WordsFilterInterface = {
      search: "",
      word: "",
      transcription: "",
      translation: "",
      notes: "",
      type_id: "",
      categories: []
    };
    setWordsFilters(newFilters);
    await filterWords();
  }

  const setFilterValue = function(field: Exclude<keyof WordsFilterInterface, 'categories'>, value: string) {
    setWordsFilters({ ...wordsFilters, [field]: value });
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const confirmRemove = async function(word: WordInterface) {
    confirmDialog({
      message: word.word,
      header: t('remove_word_confirm'),
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

  if (wordsLoading) {
    return (
      <LoaderMain></LoaderMain>
    )
  }

  return (
    <div>
      <ConfirmDialog />
      <h1 className="section-title">{ t('words_list') }</h1>
      <Link className="button -primary" href={"/words/create"}>
        <i className="fa-solid fa-plus"></i>&nbsp;{ t('add') }
      </Link>
      <div className="items-list -words-filter">
        <div className="item-row -rows-7">
          <div className="item-field">
            { t('filter') }:<br /><input name="filter" value={ wordsFilters.search || "" } onChange={(e) => setWordsFilters({...wordsFilters, search: e.target.value})} />
          </div>
          <div className="item-field">
            { t('word') }:<br/><input name="word" value={ wordsFilters.word || "" } onChange={(e) => setWordsFilters({...wordsFilters, word: e.target.value})} />
          </div>
          <div className="item-field">
            { t('transcription') }:<br/><input name="transcription" value={ wordsFilters.transcription || "" } onChange={(e) => setWordsFilters({...wordsFilters, transcription: e.target.value})} />
          </div>
          <div className="item-field">
            { t('translation') }:<br/><input name="translation" value={ wordsFilters.translation || "" } onChange={(e) => setWordsFilters({...wordsFilters, translation: e.target.value})} />
          </div>
          <div className="item-field">
            { t('notes') }:<br /><input name="notes" value={ wordsFilters.notes || "" } onChange={(e) => setWordsFilters({...wordsFilters, notes: e.target.value})} />
          </div>
          <div className="item-field">
            { t('type') }:<br /><Dropdown value={wordsFilters.type_id} options={types} onChange={(e: DropdownChangeEvent) => setWordsFilters({...wordsFilters, type_id: e.value})} optionLabel="name" optionValue="key" />
          </div>
          <div className="item-field">
            { t('categories') }:<br /><MultiSelect value={wordsFilters.categories} options={categoriesFilter} onChange={(e: MultiSelectChangeEvent) => setWordsFilters({...wordsFilters, categories: e.value})} optionLabel="name" optionValue="_id" />
          </div>
        </div>
        <div className="item-row -rows-5">
          <div className="item-field">
            <div className="button -primary" onClick={() => applyFilters()}>{ t('apply') }</div>
          </div>
          <div className="item-field">
            <div className="button" onClick={() => resetFIlters()}>{ t('reset') }</div>
          </div>
        </div>
      </div>
      <div className="items-list">
        <div className="item-row -rows-5">
          <div className="item-field">
            <label>
              { t('word') }: <input type="checkbox" checked={printConfig.word} onChange={(e) => {
                setPrintConfig({...printConfig, word: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              { t('transcription') }: <input type="checkbox" checked={printConfig.transcription} onChange={(e) => {
                setPrintConfig({...printConfig, transcription: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              { t('translation') }: <input type="checkbox" checked={printConfig.translation} onChange={(e) => {
                setPrintConfig({...printConfig, translation: e.target.checked});
              }} />
            </label>
          </div>
          <div className="item-field">
            <label>
              { t('notes') }: <input type="checkbox" checked={printConfig.notes} onChange={(e) => {
                setPrintConfig({...printConfig, notes: e.target.checked});
              }} />
            </label>
          </div>
        </div>
      </div>
      <div className="items-list -words-list print-section">
        <div className="items-header item-row -rows-5 -no-print">
          <div className="item-header">{ t('word') }</div>
          <div className="item-header">{ t('transcription') }</div>
          <div className="item-header">{ t('translation') }</div>
          <div className="item-header">{ t('notes') }</div>
        </div>
        { words.map((word, idx) => {
          return (
            <div key={'word' + idx}>
              <div key={idx} className={"item-row -rows-5 -word-row " + getPrintColsConfig()}>
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
                <div className="item-field -notes">{ getFormattedFieldText(word.notes, 'notes') }</div>
                <div className="item-action -no-print">
                  <Link href={`/words/${word._id}/edit`}>
                    <i className="fa-solid fa-pencil icon-button"></i>
                  </Link>
                  <i onClick={() => {
                    confirmRemove(word);
                  }} className="fa-solid fa-trash icon-button -danger"></i>
                </div>
              </div>
              { word.type_id === "verb" && Array.isArray(word.verb_times) && word.verb_times.length > 0 ? (
                <>
                  {word.verb_times.map((v_time, v_timeIdx) => {
                    return (
                      <div key={ v_timeIdx }>
                        <div className="item-row -rows-6 -nested-row">
                          <div className="item-field"></div>
                          <div className="item-field">
                            <b>{ verbTimeLabel(v_time.time) }</b>
                          </div>
                        </div>
                        { v_time.forms.map((v_time_form, v_time_formIdx) => {
                          return (
                            <div className="item-row -rows-6 -nested-row" key={ v_time_formIdx }>
                              <div className="item-field">
                                { verbTimeFormLabel(v_time_form.type) }
                              </div>
                              <div className="item-field">
                              { getFormattedFieldText(v_time_form.word, 'word') }
                              </div>
                              <div className="item-field">[{ v_time_form.transcription }]</div>
                              <div className="item-field">
                              { getFormattedFieldText(v_time_form.translation, 'translation') }
                              </div>
                              <div className="item-field">
                                { getFormattedFieldText(v_time_form.notes, 'notes') }
                              </div>
                            </div>
                            )
                          }) }
                      </div>
                    )
                  })}
                </>
              ) : '' }
              { word.forms.map((form, formIdx) => {
                return (
                  <div key={formIdx} className={`item-row -rows-6 -nested-row ` + getPrintColsConfig()}>
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
                    <div className="item-field -notes">{ getFormattedFieldText(form.notes, 'notes') }</div>
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