"use client"

import { useRouter } from "next/navigation";
import { usePhraseContext, PhraseInterface } from "@/context/modules/PhrasesContext";

import PhrasesForm from "./PhrasesForm";

export default function PhrasesAdd() {

  const router = useRouter();

  const creatingPhrase: PhraseInterface = {
    phrase: "",
    translation: "",
    notes: "",
    categories: []
  };

  const { createPhrase } = usePhraseContext();

  const create = async function (data: any) {
    await createPhrase(data);
    router.push('/phrases');
  }

  return (
    <PhrasesForm phraseData={ creatingPhrase } action={ create }></PhrasesForm>
  )
}