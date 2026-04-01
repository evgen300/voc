"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useWordContext, WordInterface, WordsFilterInterface } from "@/context/modules/WordsContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";

export default function WordsList() {

  const [ words, setWords ] = useState<Array<WordInterface>>([]);
  const [ filters, setFilters ] = useState<WordsFilterInterface>({});

  const { getList } = useWordContext();
  const { currentProject } = useProjectContext();

  useEffect(() => {
    if (currentProject && currentProject._id) {
      filterWords();
    }
  }, [ currentProject ]);

  const filterWords = async function() {
    setWords(await getList(currentProject._id, filters.search, filters.word, filters.transcription, filters.translation, filters.notes));
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

  const confirmRemove = async function(word: WordInterface) {}

  return (
    <div>
      <h1 className="section-title">Words list</h1>
      <Link className="button -primary" href={"/words/create"}>
        <i className="fa-solid fa-plus"></i>&nbsp;Add
      </Link>
      <div className="items-list -words-filter">
        <div className="item-row -rows-5">
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
                  { word.word }
                </div>
                <div className="item-field">[{ word.transcription }]</div>
                <div className="item-field">{ word.translation }</div>
                <div className="item-field">{ word.notes }</div>
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
                    <div className="item-field">{ form.word }</div>
                    <div className="item-field">[{ form.transcription }]</div>
                    <div className="item-field">{ form.translation }</div>
                    <div className="item-field">{ form.notes }</div>
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