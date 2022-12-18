import React, { useEffect, useMemo, useRef } from "react";
import "./wordsHelpers";
import { IWord, WordsStore } from "./wordsStore";
import { observer } from "mobx-react-lite";
import "./words.scss";

const Words = () => {
  const store = useMemo(() => new WordsStore(), []);

  const getStyle = (word: IWord): string => {
    const { lastAnswer, questionWord, isAnswered } = store.state;

    if (isAnswered) {
      if (lastAnswer.id === word.id && questionWord.id === lastAnswer.id) return "green";
      if (lastAnswer.id === word.id && questionWord.id !== lastAnswer.id) return "red";
    }

    return "grey";
  };
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = pageRef.current;
    if (!ref) return;

    ref.addEventListener("mousedown", store.reloadQuestion);
    return () => {
      ref.removeEventListener("mousedown", store.reloadQuestion);
    };
  }, [pageRef.current]);
  return (
    <div ref={pageRef} className="words-wrapper">
      <div className="words-main">
        <div className="words-quest">
          <span>{store.state.questionWord.word}</span>
        </div>
        <div className="words-answer">
          {store.state.answerWordOpt.map((w) => (
            <div style={{ backgroundColor: getStyle(w) }} onClick={() => store.handleAnswer(w)} key={w.id}>
              {w.eng}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(Words);
