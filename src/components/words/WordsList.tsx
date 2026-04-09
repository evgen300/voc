"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { useWordContext, WordInterface, WordsFilterInterface } from "@/context/modules/WordsContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";
import { useDataContext } from "@/context/modules/DataContext";

import WordsSearchResult from "@/components/words/WordsSearchResult";

export default function WordsList() {

  const [ words, setWords ] = useState<Array<WordInterface>>([]);
  const [ filters, setFilters ] = useState<WordsFilterInterface>({});
  const [ lastFilters, setLastFilters ] = useState<WordsFilterInterface>({});

  const { getList, deleteWord } = useWordContext();
  const { currentProject } = useProjectContext();
  const { getTypes, types, getCategories, categories } = useDataContext();

  useEffect(() => {
    if (currentProject && currentProject._id) {
      filterWords();
    }
  }, [ currentProject ]);

  useEffect(() => {
    getTypes();
    getCategories();
  }, [ ]);

  const filterWords = async function() {
    setLastFilters({...filters});
    setWords(await getList(currentProject._id, filters.search, filters.word, filters.transcription, filters.translation, filters.notes, filters.type_id, filters.categories));
  }

  const resetFIlters = async function() {
    let newFilters = {...filters};
    Object.keys(filters).forEach(filterFiled => {
      newFilters[filterFiled as keyof WordsFilterInterface] = "";
    });
    setFilters(newFilters);
    await filterWords();
  }

  const setFilterValue = function(field: string, value: string) {
    let wordFilters = filters;
    wordFilters[field as keyof WordsFilterInterface] = value;
    setFilters(wordFilters);
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
            Filter:<br /><input name="filter" value={ filters.search || "" } onChange={(e) => setFilters({...filters, search: e.target.value})} />
          </div>
          <div className="item-field">
            Word:<br/><input name="word" value={ filters.word || "" } onChange={(e) => setFilters({...filters, word: e.target.value})} />
          </div>
          <div className="item-field">
            Transcription:<br/><input name="transcription" value={ filters.transcription || "" } onChange={(e) => setFilters({...filters, transcription: e.target.value})} />
          </div>
          <div className="item-field">
            Translation:<br/><input name="translation" value={ filters.translation || "" } onChange={(e) => setFilters({...filters, translation: e.target.value})} />
          </div>
          <div className="item-field">
            Notes:<br /><input name="notes" value={ filters.notes || "" } onChange={(e) => setFilters({...filters, notes: e.target.value})} />
          </div>
          <div className="item-field">
            Type:<br /><Dropdown value={filters.type_id} options={types} onChange={(e: DropdownChangeEvent) => setFilters({...filters, type_id: e.value})} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
          </div>
          <div className="item-field">
            Categories:<br /><MultiSelect value={filters.categories} options={categories} onChange={(e: MultiSelectChangeEvent) => setFilters({...filters, categories: e.value})} optionLabel="name" optionValue="_id" panelClassName="voc-multiselect" scrollHeight="250px" />
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
                <div className="item-field">[{ getFormattedFieldText(word.transcription, 'transcription') }]</div>
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
                    <div className="item-field">[{ getFormattedFieldText(form.transcription, 'transcription') }]</div>
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