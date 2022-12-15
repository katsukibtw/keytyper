import { combineReducers } from "redux";
import {
    SET_CHAR,
    SET_WORD,
    TIMER_DECREMENT,
    TIMERID_SET,
    TIMER_SET,
    TIMER_END,
    SET_REMAINED_TIME,
    APPEND_TYPED_HISTORY,
    PREV_WORD,
    SET_WORDLIST,
    SET_THEME,
	SET_FONT,
    SET_TIME,
    SET_REF,
    SET_CARET_REF,
    SET_LANG,
	SET_LEVEL,
    SET_MODE,
	SET_LEVEL_WORD,
	SET_LEVEL_CHAR,
	APPEND_LEVEL_TYPED_HISTORY,
	PREV_LEVEL_WORD,
	SET_LEVEL_WORDLIST,
	SET_LEVEL_REF,
	SET_LEVEL_CARET_REF
} from "./actions";

export const initialState = {
    preferences: {
        theme: "",
		font: "",
        timeLimit: 0,
        lang: "",
        mode: "init",
    },
    word: {
        currWord: "",
        typedWord: "",
        typedHistory: [],
        wordList: [],
        activeWordRef: null,
        caretRef: null,
    },
	levelWord: {
        currLevelWord: "",
        typedLevelWord: "",
        typedLevelHistory: [],
        levelWordList: [],
        activeLevelWordRef: null,
        levelCaretRef: null,
    },
    time: {
        timer: 1,
        timerId: null,
        remTime: null,
    },
};

const timerReducer = (
    state = initialState.time,
    { type, payload }
) => {
    switch (type) {
        case TIMER_DECREMENT:
            return { ...state, timer: state.timer - 1 };
        case TIMER_END:
            return { ...state, timer: state.timer - state.timer };
        case SET_REMAINED_TIME:
            return { ...state, remTime: payload };
        case TIMER_SET:
            return { ...state, timer: payload };
        case TIMERID_SET:
            return { ...state, timerId: payload };
        default:
            return state;
    }
};

const wordReducer = (
    state = initialState.word,
    { type, payload }
) => {
    switch (type) {
        case SET_CHAR:
            return { ...state, typedWord: payload };
        case SET_WORD:
            return { ...state, typedHistory: [...state.typedHistory, payload] };
        case APPEND_TYPED_HISTORY:
            const nextIdx = state.typedHistory.length + 1;
            return {
                ...state,
                typedWord: "",
                currWord: state.wordList[nextIdx],
                typedHistory: [...state.typedHistory, state.typedWord],
            };
        case PREV_WORD:
            const prevIdx = state.typedHistory.length - 1;
            return {
                ...state,
                currWord: state.wordList[prevIdx],
                typedWord: !payload ? state.typedHistory[prevIdx] : "",
                typedHistory: state.typedHistory.splice(0, prevIdx),
            };
        case SET_REF:
            return {
                ...state,
                activeWordRef: payload,
            };
        case SET_CARET_REF:
            return {
                ...state,
                caretRef: payload,
            };
        case SET_WORDLIST:
            const areNotWords = payload.some((word) =>
                word.includes(" ")
            );
            var shuffledWordList = payload.sort(
                () => Math.random() - 0.5
            );
            if (areNotWords)
                shuffledWordList = payload.flatMap((token) =>
                    token.split(" ")
                );
            return {
                ...state,
                typedWord: "",
                typedHistory: [],
                currWord: shuffledWordList[0],
                wordList: shuffledWordList,
            };
        default:
            return state;
    }
};

const levelWordReducer = (
    state = initialState.levelWord,
    { type, payload }
) => {
    switch (type) {
        case SET_LEVEL_CHAR:
            return { ...state, typedLevelWord: payload };
        case SET_LEVEL_WORD:
            return { ...state, typedLevelHistory: [...state.typedLevelHistory, payload] };
        case APPEND_LEVEL_TYPED_HISTORY:
            const nextIdx = state.typedLevelHistory.length + 1;
            return {
                ...state,
                typedLevelWord: "",
                currLevelWord: state.levelWordList[nextIdx],
                typedLevelHistory: [...state.typedLevelHistory, state.typedLevelWord],
            };
        case PREV_LEVEL_WORD:
            const prevIdx = state.typedLevelHistory.length - 1;
            return {
                ...state,
                currLevelWord: state.levelWordList[prevIdx],
                typedLevelWord: !payload ? state.typedLevelHistory[prevIdx] : "",
                typedLevelHistory: state.typedLevelHistory.splice(0, prevIdx),
            };
        case SET_LEVEL_REF:
            return {
                ...state,
                activeLevelWordRef: payload,
            };
        case SET_LEVEL_CARET_REF:
            return {
                ...state,
                levelCaretRef: payload,
            };
        case SET_LEVEL_WORDLIST:
            const lareNotWords = payload.some((word) =>
                word.includes(" ")
            );
            var shuffledLevelWordList = payload.sort(
                () => Math.random() - 0.5
            );
            if (lareNotWords)
                shuffledLevelWordList = payload.flatMap((token) =>
                    token.split(" ")
                );
            return {
                ...state,
				typedLevelWord: "",
				typedLevelHistory: [],
                currLevelWord: shuffledLevelWordList[0],
                levelWordList: shuffledLevelWordList,
            };
        default:
            return state;
    }
};

const preferenceReducer = (
    state = initialState.preferences,
    { type, payload }
) => {
    switch (type) {
        case SET_THEME:
            return { ...state, theme: payload };
		case SET_FONT:
			return { ...state, font: payload };
        case SET_TIME:
            return { ...state, timeLimit: payload };
        case SET_LANG:
			return { ...state, lang: payload };
		case SET_LEVEL:
			return { ...state, level: payload };
        case SET_MODE:
            return { ...state, mode: payload };
        default:
            return state;
    }
};

export default combineReducers({
    time: timerReducer,
    word: wordReducer,
	levelWord: levelWordReducer,
    preferences: preferenceReducer,
});
