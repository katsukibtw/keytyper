export const SET_WORD = "SETWORD";
export const SET_CHAR = "SETCHAR";
export const TIMER_DECREMENT = "TIMERDECREMENT";
export const APPEND_TYPED_HISTORY = "APPENDTYPEDHISTORY";
export const TIMER_SET = "TIMERSET";
export const TIMERID_SET = "TIMERIDSET";
export const PREV_WORD = "PREVWORD";
export const SET_WORDLIST = "SETWORDLIST";
export const SET_THEME = "SETTHEME";
export const SET_TIME = "SETTIME";
export const SET_REF = "SETREF";
export const SET_CARET_REF = "SETCARETREF";
export const SET_LANG = "SETLANG";
export const SET_FONT = "SETFONT";

// same things but for levels
export const SET_LEVEL = "SETLEVEL";
export const SET_LEVEL_WORD = "SETLEVELWORD";
export const SET_LEVEL_CHAR = "SETLEVELCHAR";
export const APPEND_LEVEL_TYPED_HISTORY = "APPENDLEVELTYPEDHISTORY";
export const PREV_LEVEL_WORD = "PREVLEVELWORD";
export const SET_LEVEL_WORDLIST = "SETLEVELWORDLIST";
export const SET_LEVEL_REF = "SETLEVELREF";
export const SET_LEVEL_CARET_REF = "SETLEVELCARETREF";

// Time Actions
export const timerDecrement = () => ({ type: TIMER_DECREMENT });
export const timerSet = (payload) => ({ type: TIMER_SET, payload });
export const setTimerId = (payload) => ({
    type: TIMERID_SET,
    payload,
});

// Word Actions
export const setWord = (payload) => ({ type: SET_WORD, payload });
export const setChar = (payload) => ({ type: SET_CHAR, payload });
export const setTypedWord = (payload) => ({ type: SET_CHAR, payload });
export const appendTypedHistory = () => ({
    type: APPEND_TYPED_HISTORY,
});
export const backtrackWord = (payload) => ({
    type: PREV_WORD,
    payload,
});
export const setWordList = (payload) => ({
    type: SET_WORDLIST,
    payload,
});
export const setRef = (payload) => ({
    type: SET_REF,
    payload,
});
export const setCaretRef = (payload) => ({
    type: SET_CARET_REF,
    payload,
});

// Level actions
export const setLevelWord = (payload) => ({ type: SET_LEVEL_WORD, payload });
export const setLevelChar = (payload) => ({ type: SET_LEVEL_CHAR, payload });
export const setLevelTypedWord = (payload) => ({ type: SET_LEVEL_CHAR, payload });
export const appendLevelTypedHistory = () => ({
    type: APPEND_LEVEL_TYPED_HISTORY,
});
export const backtrackLevelWord = (payload) => ({
    type: PREV_LEVEL_WORD,
    payload,
});
export const setLevelWordList = (payload) => ({
    type: SET_LEVEL_WORDLIST,
    payload,
});
export const setLevelRef = (payload) => ({
    type: SET_LEVEL_REF,
    payload,
});
export const setLevelCaretRef = (payload) => ({
    type: SET_LEVEL_CARET_REF,
    payload,
});

// Prefrences Actions
export const setTheme = (payload) => ({ type: SET_THEME, payload });
export const setFont = (payload) => ({ type: SET_FONT, payload });
export const setTime = (payload) => ({ type: SET_TIME, payload });
export const setLang = (payload) => ({ type: SET_LANG, payload });
export const setLevel = (payload) => ({ type: SET_LEVEL, payload });
