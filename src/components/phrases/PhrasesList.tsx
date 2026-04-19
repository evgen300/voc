"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { usePhraseContext, PhraseInterface, PhrasesFilterInterface } from "@/context/modules/PhrasesContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";
import { PaginationInterface } from "@/context/modules/WordsContext";

import PhrasesSearchResult from "@/components/phrases/PhrasesSearchResult";
import Pagination from "@/components/Pagination";

export default function PhrasesList() {

  const [ phrases, setPhrases ] = useState<Array<PhraseInterface>>([]);
  const [ filters, setFilters ] = useState<PhrasesFilterInterface>({});
  const [ lastFilters, setLastFilters ] = useState<PhrasesFilterInterface>({});
  const [ phrasesPagination, setPhrasesPagination ] = useState<PaginationInterface>({page: 1, pages: 0, total: 0, onpage: 100});

  const { getList, deletePhrase } = usePhraseContext();
  const { currentProject } = useProjectContext();

  useEffect(() => {
    if (currentProject && currentProject._id) {
      filterPhrases();
    }
  }, [ currentProject ]);

  const filterPhrases = async function() {
    setLastFilters({...filters});
    const phrasesData = await getList(currentProject._id, filters.search, filters.phrase, filters.translation, filters.notes, phrasesPagination.page, phrasesPagination.onpage);
    setPhrases(phrasesData.phrases);
    setPhrasesPagination({...phrasesData.pagination, pages: Math.ceil(phrasesData.pagination.total / phrasesPagination.onpage)});
  }

  const applyFilters = async function () {
    phrasesPagination.page = 1;
    await filterPhrases();
  }

  const resetFIlters = async function() {
    phrasesPagination.page = 1;
    let newFilters = {...filters};
    Object.keys(filters).forEach(filterFiled => {
      newFilters[filterFiled as keyof PhrasesFilterInterface] = "";
    });
    setFilters(newFilters);
    await filterPhrases();
  }

  const setFilterValue = function(field: string, value: string) {
    let phrasesFilters = filters;
    phrasesFilters[field as keyof PhrasesFilterInterface] = value;
    setFilters(phrasesFilters);
  }

  const playAudio = function (url: string) {
    const a = new Audio(url);
    a.play();
  }

  const confirmRemove = async function(phrase: PhraseInterface) {
    confirmDialog({
      message: phrase.phrase && phrase.phrase.length > 50 ? phrase.phrase.substring(0, 50) + '...' : phrase.phrase,
      header: 'Remove phrase?',
      className: 'confirm-dialog',
      acceptClassName: 'button -primary',
      rejectClassName: 'button',
      accept: async () => {
        await deletePhrase(phrase._id);
        await filterPhrases();
      }
    });
  }

  const getFormattedFieldText = function(text: string, field: string = '') {
    return (
      <PhrasesSearchResult filters={lastFilters} text={text} field={field}></PhrasesSearchResult>
    )
  }

  const changePage = async function(pagenum: number) {
    if (phrasesPagination.page !== pagenum) {
      phrasesPagination.page = pagenum;
      filterPhrases();
    }
  }

  return (
    <div>
      <ConfirmDialog />
      <h1 className="section-title">Phrases list</h1>
      <Link className="button -primary" href={"/phrases/create"}>
        <i className="fa-solid fa-plus"></i>&nbsp;Add
      </Link>
      <div className="items-list -phrases-filter">
        <div className="item-row -rows-5">
          <div className="item-field">
            Filter:<br /><input name="filter" value={ filters.search || "" } onChange={(e) => setFilters({...filters, search: e.target.value})} />
          </div>
          <div className="item-field">
            Phrase:<br/><input name="phrase" value={ filters.phrase || "" } onChange={(e) => setFilters({...filters, phrase: e.target.value})} />
          </div>
          <div className="item-field">
            Translation:<br/><input name="translation" value={ filters.translation || "" } onChange={(e) => setFilters({...filters, translation: e.target.value})} />
          </div>
          <div className="item-field">
            Notes:<br /><input name="notes" value={ filters.notes || "" } onChange={(e) => setFilters({...filters, notes: e.target.value})} />
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
      <div className="items-list -phrases-list">
        <div className="items-header item-row -rows-5">
          <div className="item-header"></div>
          <div className="item-header">Phrase</div>
          <div className="item-header">Translation</div>
          <div className="item-header">Notes</div>
        </div>
        { phrases.map((phrase, idx) => {
          return (
            <div key={idx} className="item-row -rows-5">
              <div className="item-field">
                { phrase.audio ? (
                  <i className="fa-regular fa-circle-play" onClick={() => playAudio(phrase.audio || "")}></i>
                ) : '' }
              </div>
              <div className="item-field">
                { getFormattedFieldText(phrase.phrase, 'phrase') }
              </div>
              <div className="item-field">{ getFormattedFieldText(phrase.translation, 'translation') }</div>
              <div className="item-field">{ getFormattedFieldText(phrase.notes, 'notes') }</div>
              <div className="item-action">
                <Link href={`/phrases/${phrase._id}/edit`}>
                  <i className="fa-solid fa-pencil"></i>
                </Link>
                <i onClick={() => {
                  confirmRemove(phrase);
                }} className="fa-solid fa-trash"></i>
              </div>
            </div>
          )
        }) }
      </div>
      <Pagination pagination={ phrasesPagination } action={ changePage } />
    </div>
  )
}