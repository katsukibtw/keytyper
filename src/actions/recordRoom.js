import {
	appendRoomTypedHistory,
	backtrackWord,
	setRoomChar,
	setRoomTypedWord,
} from "../store/actions";
import { store } from "../store/store";
import { resetRoom } from "./resetRoom";
import { startTimer } from "./startTimer";

const handleBackspace = (ctrlKey) => {
	const { dispatch, getState } = store;
	const {
		roomWord: { typedRoomWord, activeRoomWordRef, typedRoomHistory, roomWordList },
	} = getState();
	const currIdx = typedRoomHistory.length - 1;
	const currWordEl = activeRoomWordRef?.current;
	if (!typedRoomWord && typedRoomHistory[currIdx] !== roomWordList[currIdx]) {
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
			dispatch(setRoomTypedWord(""));
			currWordEl.childNodes.forEach((char) => {
				char.classList.remove("wrong", "right");
			});
		} else {
			const newTypedWord = typedRoomWord.slice(0, typedRoomWord.length - 1);
			dispatch(setRoomTypedWord(newTypedWord));
		}
	}
};

export const recordRoom = (key, ctrlKey) => {
	const { dispatch, getState } = store;
	const {
		time: { timer, timerId },
		roomWord: { typedRoomWord, currRoomWord, activeRoomWordRef, roomCaretRef },
		preferences: { timeLimit },
	} = getState();

	if (!timer) {
		if (key === "Tab") {
			resetRoom();
		}
		return;
	}
	if (!timerId && key !== "Tab") startTimer();
	const currWordEl = activeRoomWordRef?.current;
	currWordEl.scrollIntoView({ behavior: "smooth", block: "center" });
	const caret = roomCaretRef?.current;
	caret.classList.remove("blink");
	setTimeout(() => caret.classList.add("blink"), 500);
	switch (key) {
		case "Tab":
			if (timer !== timeLimit || timerId) {
				resetRoom();
				document.getElementsByClassName("word")[0].scrollIntoView();
			}
			break;
		case " ":
			if (typedRoomWord === "") return;
			currWordEl.classList.add(
				typedRoomWord !== currRoomWord ? "wrong" : "right"
			);
			dispatch(appendRoomTypedHistory());
			break;
		case "Backspace":
			handleBackspace(ctrlKey);
			break;
		default:
			dispatch(setRoomChar(typedRoomWord + key));
			break;
	}
};
