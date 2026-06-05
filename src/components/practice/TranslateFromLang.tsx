'use client'

import React, { useState } from "react";

import { usePracticeContext, TranslatePracticeInterface } from "@/context/modules/PracticeContext";
import { useProjectContext } from "@/context/modules/ProjectsContext";

export default function TranslateFromLang() {

  const [ currentTest, setCurrentTest ] = useState<TranslatePracticeInterface>({ tasks: [] });

  const { getTranslateFromTest, checkTranslateFromTest } = usePracticeContext();
  const { currentProject } = useProjectContext();

  const loadTest = async function () {
    const test = await getTranslateFromTest(currentProject._id);
    setCurrentTest(test);
  }

  const checkTest = async function () {
    const test = await checkTranslateFromTest(currentTest, currentProject._id);
    setCurrentTest(test);
  }

  const setTaskTranslation = function (idx: number, value: string) {
    let changedTest = {...currentTest};
    if (changedTest.tasks[idx]) {
      changedTest.tasks[idx].translation = value;
      setCurrentTest({...changedTest});
    }
  }

  const formatAnswerCorrection = function (answer: string) {
    return answer.replace(/\+([^\+]+)\+/img, `<span class="added">$1</span>`).replace(/\-([^\-]+)\-/img, `<span class="removed">$1</span>`);
  }

  return (
    <div>
      <span className="button -primary" onClick={() => loadTest()}>Start</span>
      <div className="items-list practice-form">
        { currentTest.tasks.map((task, idx) => {
          return (
            <div key={ idx } className="item-row -rows-2">
              <div>{ task.word }</div>
              <div>
                <input type="text" value={ task.translation } onChange={(e) => {
                  setTaskTranslation(idx, e.target.value)
                  } } />
                  { task.correct ? (
                    <i className="fa-solid fa-check -correct"></i>
                  ) : '' }
                  { task.correct === false ? (
                    <>
                      <i className="fa-solid fa-xmark -wrong"></i>
                      <span className="correct-answer">{ task.correct_answer }</span>
                      <span className="answer-correction" dangerouslySetInnerHTML={{__html: formatAnswerCorrection(task.answer_correction || '')}}></span>
                    </>
                  ) : '' }
              </div>
            </div>
          )
        }) }
        <div className="item-row -rows-2">
          <div></div>
          <div>
            <span className="button -primary" onClick={() => checkTest()}>Check</span>
          </div>
        </div>
      </div>
    </div>
  )
}