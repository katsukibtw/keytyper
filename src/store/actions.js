export const SET_WORD = "SETWORD";
export const SET_CHAR = "SETCHAR";
export const TIMER_DECREMENT = "TIMERDECREMENT";
export const APPEND_TYPED_HISTORY = "APPENDTYPEDHISTORY";
export const TIMER_SET = "TIMERSET";
export const TIMERID_SET = "TIMERIDSET";
export const TIMER_END = "TIMEREND";
export const SET_REMAINED_TIME = "SETREMAINEDTIME";
export const PREV_WORD = "PREVWORD";
export const SET_WORDLIST = "SETWORDLIST";
export const SET_THEME = "SETTHEME";
export const SET_TIME = "SETTIME";
export const SET_REF = "SETREF";
export const SET_CARET_REF = "SETCARETREF";
export const INC_ERROR_COUNT = "INCERRORCOUNT";
export const SET_ERRORS_TO_ZERO = "SETERRORSTOZERO";
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
export const SET_LEVEL_ID = "SETLEVELID";
export const INC_LEVEL_ERROR_COUNT = "INCLEVELERRORCOUNT";
export const SET_LEVEL_ERRORS_TO_ZERO = "SETLEVELERRORSTOZERO";

// this thing is used to log in which part of site user is
export const SET_MODE = "SETMODE";

// user action types
export const SET_USER_ID = "SETUSERID";
export const SET_USER_NAME = "SETUSERNAME";
export const SET_USER_REFRESH_TOKEN = "SETUSERREFRESHTOKEN";
export const ADD_COMPL_LEVEL = "ADDCOMPLLEVEL";
export const SET_COMPL_LEVEL = "SETCOMPLLEVEL";

// Time Actions
export const timerDecrement = () => ({ type: TIMER_DECREMENT });
export const timerSet = (payload) => ({ type: TIMER_SET, payload });
export const timerEnd = (payload) => ({ type: TIMER_END, payload });
export const setRemainedTime = (payload) => ({ type: SET_REMAINED_TIME, payload });
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
export const incErrorCount = () => ({
	type: INC_ERROR_COUNT,
});
export const setErrorsToZero = () => ({
	type: SET_ERRORS_TO_ZERO
})

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
export const incLevelErrorCount = () => ({
	type: INC_LEVEL_ERROR_COUNT,
});
export const setLevelErrorsToZero = () => ({
	type: SET_LEVEL_ERRORS_TO_ZERO
})

export const setLevelId = (payload) => ({ type: SET_LEVEL_ID, payload });

// User actions
export const setUserId = (payload) => ({ type: SET_USER_ID, payload });
export const setUserName = (payload) => ({ type: SET_USER_NAME, payload });
export const setUserRefreshToken = (payload) => ({ type: SET_USER_REFRESH_TOKEN, payload });
export const addComplLevel = (payload) => ({ type: ADD_COMPL_LEVEL, payload });
export const setComplLevel = (payload) => ({ type: SET_COMPL_LEVEL, payload });

// Prefrences Actions
export const setTheme = (payload) => ({ type: SET_THEME, payload });
export const setFont = (payload) => ({ type: SET_FONT, payload });
export const setTime = (payload) => ({ type: SET_TIME, payload });
export const setLang = (payload) => ({ type: SET_LANG, payload });
export const setLevel = (payload) => ({ type: SET_LEVEL, payload });
export const setMode = (payload) => ({ type: SET_MODE, payload });
