"use client"

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { usePhraseContext, PhraseInterface } from "@/context/modules/PhrasesContext";

import PhrasesForm from "./PhrasesForm";

interface PhraseEditParams {
  phraseId: string
};

export default function PhrasesEdit(params: PhraseEditParams) {

  const { phraseId } = params;

  const [ phrase, setPhrase ] = useState<PhraseInterface>({phrase: "", translation: "", notes: "", categories: []});

  useEffect(() => {
    if (phraseId) {
      loadPhrase();
    }
  }, [ phraseId ]);

  const router = useRouter();

  const { editPhrase, getPhrase } = usePhraseContext();

  const loadPhrase = async function() {
    const phraseData = await getPhrase(phraseId);
    setPhrase(phraseData);
  }

  const updatePhrase = async function (data: any) {
    await editPhrase(phraseId, data);
    router.push('/phrases');
  }

  return (
    <PhrasesForm phraseData={ phrase } action={ updatePhrase }></PhrasesForm>
  )
}