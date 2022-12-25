import { setTimerId, setWordList, timerSet, setErrorsToZero } from "../store/actions";
import { store } from "../store/store";

export const resetTest = async () => {
	const { dispatch, getState } = store;
	const {
		time: { timerId },
		preferences: { timeLimit, lang },
	} = getState();
	document
		.querySelectorAll(".wrong, .right")
		.forEach((el) => el.classList.remove("wrong", "right"));
	if (timerId) {
		clearInterval(timerId);
		dispatch(setTimerId(null));
	}
	import(`../langs/${lang}.json`).then((words) =>
		dispatch(setWordList(words.default))
	);
	dispatch(timerSet(timeLimit));
	dispatch(setErrorsToZero());
};
