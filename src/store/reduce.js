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
	INC_ERROR_COUNT,
	SET_ERRORS_TO_ZERO,
	SET_LANG,
	SET_LEVEL,
	SET_MODE,
	SET_LEVEL_WORD,
	SET_LEVEL_CHAR,
	APPEND_LEVEL_TYPED_HISTORY,
	PREV_LEVEL_WORD,
	SET_LEVEL_WORDLIST,
	SET_LEVEL_REF,
	SET_LEVEL_CARET_REF,
	SET_LEVEL_ID,
	SET_USER_ID,
	SET_USER_NAME,
	SET_USER_REFRESH_TOKEN,
	ADD_COMPL_LEVEL,
	SET_COMPL_LEVEL,
	INC_LEVEL_ERROR_COUNT,
	SET_LEVEL_ERRORS_TO_ZERO,
	SET_ROOM_LEVEL,
	SET_ROOM_WORD,
	SET_ROOM_CHAR,
	APPEND_ROOM_TYPED_HISTORY,
	PREV_ROOM_WORD,
	SET_ROOM_WORDLIST,
	SET_ROOM_REF,
	SET_ROOM_CARET_REF,
	SET_ROOM_LEVEL_ID,
	INC_ROOM_ERROR_COUNT,
	SET_ROOM_ERRORS_TO_ZERO,
	SET_ROOM_SAFECODE,
	SET_ROOM_NAME,
	SET_ROOM_USERNAME,
	SET_ROOM_USER_ID,
	SET_ROOM_ID,
	SET_SHOW_SETTINGS,
} from "./actions";

export const initialState = {
	preferences: {
		theme: "",
		font: "",
		timeLimit: 0,
		lang: "",
		level: '',
		roomLevel: '',
		mode: "init",
		show_settings: false,
	},
	word: {
		currWord: "",
		typedWord: "",
		typedHistory: [],
		wordList: [],
		activeWordRef: null,
		caretRef: null,
		errors: 0,
	},
	levelWord: {
		currLevelWord: "",
		typedLevelWord: "",
		typedLevelHistory: [],
		levelWordList: [],
		activeLevelWordRef: null,
		levelCaretRef: null,
		levelId: '',
		levelErrors: 0,
	},
	user: {
		id: '',
		name: '',
		levelsCompl: [],
		refreshToken: null,
	},
	room: {
		room_id: '',
		safe_code: '',
		roomname: '',
		username: '',
		user_id: '',
	},
	roomWord: {
		currRoomWord: "",
		typedRoomWord: "",
		typedRoomHistory: [],
		roomWordList: [],
		activeRoomWordRef: null,
		roomCaretRef: null,
		roomLevelId: '',
		roomErrors: 0,
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
		case INC_ERROR_COUNT:
			return { ...state, errors: state.errors + 1 }
		case SET_ERRORS_TO_ZERO:
			return { ...state, errors: 0 }
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
		case SET_LEVEL_ID:
			return { ...state, levelId: payload };
		case INC_LEVEL_ERROR_COUNT:
			return { ...state, levelErrors: state.levelErrors + 1 }
		case SET_LEVEL_ERRORS_TO_ZERO:
			return { ...state, levelErrors: 0 }
		default:
			return state;
	}
};

const roomWordReducer = (
	state = initialState.roomWord,
	{ type, payload }
) => {
	switch (type) {
		case SET_ROOM_CHAR:
			return { ...state, typedRoomWord: payload };
		case SET_ROOM_WORD:
			return { ...state, typedRoomHistory: [...state.typedRoomHistory, payload] };
		case APPEND_ROOM_TYPED_HISTORY:
			const nextIdx = state.typedRoomHistory.length + 1;
			return {
				...state,
				typedRoomWord: "",
				currRoomWord: state.roomWordList[nextIdx],
				typedRoomHistory: [...state.typedRoomHistory, state.typedRoomWord],
			};
		case PREV_ROOM_WORD:
			const prevIdx = state.typedRoomHistory.length - 1;
			return {
				...state,
				currRoomWord: state.roomWordList[prevIdx],
				typedRoomWord: !payload ? state.typedRoomHistory[prevIdx] : "",
				typedRoomHistory: state.typedRoomHistory.splice(0, prevIdx),
			};
		case SET_ROOM_REF:
			return {
				...state,
				activeRoomWordRef: payload,
			};
		case SET_ROOM_CARET_REF:
			return {
				...state,
				roomCaretRef: payload,
			};
		case SET_ROOM_WORDLIST:
			const lareNotWords = payload.some((word) =>
				word.includes(" ")
			);
			var shuffledRoomWordList = payload.sort(
				() => Math.random() - 0.5
			);
			if (lareNotWords)
				shuffledRoomWordList = payload.flatMap((token) =>
					token.split(" ")
				);
			return {
				...state,
				typedRoomWord: "",
				typedRoomHistory: [],
				currRoomWord: shuffledRoomWordList[0],
				roomWordList: shuffledRoomWordList,
			};
		case SET_ROOM_LEVEL_ID:
			return { ...state, roomLevelId: payload };
		case INC_ROOM_ERROR_COUNT:
			return { ...state, roomErrors: state.roomErrors + 1 }
		case SET_ROOM_ERRORS_TO_ZERO:
			return { ...state, roomErrors: 0 }
		default:
			return state;
	}
};

const userReducer = (
	state = initialState.user,
	{ type, payload }
) => {
	switch (type) {
		case SET_USER_ID:
			return { ...state, id: payload };
		case SET_USER_NAME:
			return { ...state, name: payload };
		case SET_USER_REFRESH_TOKEN:
			return { ...state, refreshToken: payload };
		case ADD_COMPL_LEVEL:
			if (state.levelsCompl.includes(payload)) return state;
			return { ...state, levelsCompl: [...state.levelsCompl, payload] };
		case SET_COMPL_LEVEL:
			return { ...state, levelsCompl: payload };
		default:
			return state;
	}
}

const roomReducer = (
	state = initialState.room,
	{ type, payload }
) => {
	switch (type) {
		case SET_ROOM_SAFECODE:
			return { ...state, safe_code: payload }
		case SET_ROOM_USERNAME:
			return { ...state, username: payload }
		case SET_ROOM_NAME:
			return { ...state, roomname: payload }
		case SET_ROOM_USER_ID:
			return { ...state, user_id: payload }
		case SET_ROOM_ID:
			return { ...state, room_id: payload }
		default:
			return state
	}
}

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
		case SET_ROOM_LEVEL:
			return { ...state, roomLevel: payload };
		case SET_MODE:
			return { ...state, mode: payload };
		case SET_SHOW_SETTINGS:
			return { ...state, show_settings: payload };
		default:
			return state;
	}
};

export default combineReducers({
	time: timerReducer,
	word: wordReducer,
	levelWord: levelWordReducer,
	user: userReducer,
	room: roomReducer,
	roomWord: roomWordReducer,
	preferences: preferenceReducer,
});
