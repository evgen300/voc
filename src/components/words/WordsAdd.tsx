"use client"

import { useRouter } from "next/navigation";
import { useWordContext, WordInterface } from "@/context/modules/WordsContext";

import WordsForm from "./WordsForm";

export default function WordsAdd() {

  const router = useRouter();

  const creatingWord: WordInterface = {
    word: "",
    transcription: "",
    translation: "",
    forms: [],
    notes: "",
    categories: [],
    type_id: "",
    verb_times: []
  };

  const { createWord } = useWordContext();

  const addWord = async function (data: any) {
    const response = await createWord(data);
    if (response && response._id) {
      router.push('/words/' + response._id + '/edit');
    } else {
      router.push('/words');
    }
  }

  return (
    <WordsForm wordData={ creatingWord } action={ addWord }></WordsForm>
  )
}