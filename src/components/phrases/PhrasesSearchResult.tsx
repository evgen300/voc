'use client'

import React, { useState, useEffect } from 'react';

import { PhrasesFilterInterface } from '@/context/modules/PhrasesContext';

interface WordSearchResultParams {
    filters: PhrasesFilterInterface,
    text: string,
    field: string
}

export default function PhrasesSearchResult(params: WordSearchResultParams) {
  const { filters, text, field } = params;

  const [ textParts, setTextParts ] = useState<Array<string>>([]);
  const [ searchString, setSearchString ] = useState<string>("");

  useEffect(() => {
    let searchParts: Array<string> = [];
    if (filters.search && filters.search.length > 0) {
      setSearchString(filters.search);
      if (text.toLowerCase().indexOf(filters.search.toLowerCase()) !== -1) {
        searchParts = text.split(new RegExp(`(${filters.search})`, 'i'));
      }
    } else {
      if (filters.phrase && filters.phrase.length > 0 && field === "phrase") {
        setSearchString(filters.phrase);
        if (text.toLowerCase().indexOf(filters.phrase.toLowerCase()) !== -1) {
          searchParts = text.split(new RegExp(`(${filters.phrase})`, 'i'));
        }
      }

      /*if (filters.transcription && filters.transcription.length > 0 && field === "transcription") {
        setSearchString(filters.transcription);
        if (text.toLowerCase().indexOf(filters.transcription.toLowerCase()) !== -1) {
          searchParts = text.split(new RegExp(`(${filters.transcription})`));
        }
      }*/

      if (filters.translation && filters.translation.length > 0 && field === "translation") {
        setSearchString(filters.translation);
        if (text.toLowerCase().indexOf(filters.translation.toLowerCase()) !== -1) {
          searchParts = text.split(new RegExp(`(${filters.translation})`, 'i'));
        }
      }

      if (filters.notes && filters.notes.length > 0 && field === "notes") {
        setSearchString(filters.notes);
        if (text.toLowerCase().indexOf(filters.notes.toLowerCase()) !== -1) {
          searchParts = text.split(new RegExp(`(${filters.notes})`, 'i'));
        }
      }
    }
    setTextParts(searchParts);
  }, [ filters, text ]);

  if (textParts.length < 2) {
    return (
      <>{ text }</>
    )
  }

  return (
    <>{textParts.map((part: string, partIdx: number) => {
      return (
        <span className="search-result-formatted" key={partIdx}>
          { part.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 ? (
            <><span className="search-result">{part}</span></>
          ) : (
            <>{ part }</>
          ) }
        </span>
      )
    })}</>
  )
}