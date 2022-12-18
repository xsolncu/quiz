import { wrds } from "./wordsHelpers";
import { action, makeAutoObservable, makeObservable } from "mobx";

export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

export interface IWord {
  id: number;
  word: string;
  eng: string;
}

interface IWordsStoreState {
  questionWord: IWord;
  answerWordOpt: IWord[];
  lastAnswer: IWord;
  isAnswered: boolean;
}

export class WordsStore {
  countAnswers = 4;
  words = wrds;

  state: IWordsStoreState = {
    questionWord: {} as IWord,
    answerWordOpt: [],
    lastAnswer: {} as IWord,
    isAnswered: true,
  };

  constructor() {
    this.reloadQuestion();
    makeAutoObservable(this.state);
    makeObservable(this, {
      reloadQuestion: action,
    });
  }

  handleAnswer = (answer: IWord) => {
    if (this.state.isAnswered) return;
    this.state.isAnswered = true;
    this.state.lastAnswer = answer;
  };

  reloadQuestion = () => {
    if (!this.state.isAnswered) return;
    this.state.isAnswered = false;
    this.state.answerWordOpt = [];
    for (let i = 0; i < this.countAnswers; i++) {
      let wordIndex = -1;
      do {
        wordIndex = randomNum(0, wrds.length - 1);
      } while (this.state.answerWordOpt.find((f) => f.id === this.words[wordIndex].id));
      this.state.answerWordOpt.push(this.words[wordIndex]);
    }
    this.state.questionWord = this.state.answerWordOpt[randomNum(0, this.countAnswers)];
  };
}
