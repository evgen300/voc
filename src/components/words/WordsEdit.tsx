"use client"

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useWordContext, WordInterface } from "@/context/modules/WordsContext";

import WordsForm from "./WordsForm";

interface WordEditParams {
  wordId: string
};

export default function WordsEdit(params: WordEditParams) {

  const { wordId } = params;

  const [ word, setWord ] = useState<WordInterface>({word: "", transcription: "", translation: "", notes: "", categories: [], type_id: "", forms: []});

  useEffect(() => {
    if (wordId) {
      loadWord();
    }
  }, [ wordId ]);

  const router = useRouter();

  const { editWord, getWord } = useWordContext();

  const loadWord = async function() {
    const wordData = await getWord(wordId);
    setWord(wordData);
  }

  const updateWord = async function (data: any) {
    await editWord(wordId, data);
    router.push('/words');
  }

  return (
    <WordsForm wordData={ word } action={ updateWord }></WordsForm>
  )
}