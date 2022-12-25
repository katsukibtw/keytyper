import { setTimerId, setLevelWordList, timerSet, setLevelErrorsToZero } from "../store/actions";
import { store } from "../store/store";

export const resetLevel = async () => {
	const { dispatch, getState } = store;
	const {
		time: { timerId },
		preferences: { timeLimit, level },
	} = getState();
	document
		.querySelectorAll(".wrong, .right")
		.forEach((el) => el.classList.remove("wrong", "right"));
	if (timerId) {
		clearInterval(timerId);
		dispatch(setTimerId(null));
	}
	import(`../edu_levels/${level}.json`).then((words) =>
		dispatch(setLevelWordList(words.default))
	);
	dispatch(timerSet(timeLimit));
	dispatch(setLevelErrorsToZero());
};
