import {
    appendLevelTypedHistory,
    backtrackWord,
    setLevelChar,
    setLevelTypedWord,
} from "../store/actions";
import { store } from "../store/store";
import { resetLevel } from "./resetLevel";
import { startTimer } from "./startTimer";

const handleBackspace = (ctrlKey) => {
    const { dispatch, getState } = store;
    const {
        levelWord: { typedLevelWord, activeLevelWordRef, typedLevelHistory, levelWordList },
    } = getState();
    const currIdx = typedLevelHistory.length - 1;
    const currWordEl = activeLevelWordRef?.current;
    if (!typedLevelWord && typedLevelHistory[currIdx] !== levelWordList[currIdx]) {
        dispatch(backtrackWord(ctrlKey));
        currWordEl.previousElementSibling.classList.remove("right", "wrong");
        if (ctrlKey) {
            currWordEl.previousElementSibling.childNodes.forEach(
                (char) => {
                    char.classList.remove("wrong", "right");
                }
            );
        }
    } else {
        if (ctrlKey) {
            dispatch(setLevelTypedWord(""));
            currWordEl.childNodes.forEach((char) => {
                char.classList.remove("wrong", "right");
            });
        } else {
            const newTypedWord = typedLevelWord.slice(0, typedLevelWord.length - 1);
            dispatch(setLevelTypedWord(newTypedWord));
        }
    }
};

export const recordLevel = (key, ctrlKey) => {
    const { dispatch, getState } = store;
    const {
        time: { timer, timerId },
        levelWord: { typedLevelWord, currWord, activeLevelWordRef, caretRef },
        preferences: { timeLimit },
    } = getState();

    if (!timer) {
        if (key === "Tab") {
            resetLevel();
        }
        return;
    }
    if (!timerId && key !== "Tab") startTimer();
    const currWordEl = activeLevelWordRef?.current;
    currWordEl.scrollIntoView({ behavior: "smooth", block: "center" });
    const caret = caretRef?.current;
    caret.classList.remove("blink");
    setTimeout(() => caret.classList.add("blink"), 500);
    switch (key) {
        case "Tab":
            if (timer !== timeLimit || timerId) {
                resetLevel();
                document.getElementsByClassName("word")[0].scrollIntoView();
            }
            break;
        case " ":
            if (typedLevelWord === "") return;
            currWordEl.classList.add(
                typedLevelWord !== currWord ? "wrong" : "right"
            );
            dispatch(appendLevelTypedHistory());
            break;
        case "Backspace":
            handleBackspace(ctrlKey);
            break;
        default:
            dispatch(setLevelChar(typedLevelWord + key));
            break;
    }
};
