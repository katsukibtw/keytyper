import { setTimerId, setRoomWordList, timerSet, setRoomErrorsToZero } from "../store/actions";
import { store } from "../store/store";

export const resetRoom = async () => {
	const { dispatch, getState } = store;
	const {
		time: { timerId },
		preferences: { timeLimit, roomLevel },
	} = getState();
	document
		.querySelectorAll(".wrong, .right")
		.forEach((el) => el.classList.remove("wrong", "right"));
	if (timerId) {
		clearInterval(timerId);
		dispatch(setTimerId(null));
	}
	import(`../edu_levels/${roomLevel}.json`).then((words) =>
		dispatch(setRoomWordList(words.default))
	);
	dispatch(timerSet(timeLimit));
	dispatch(setRoomErrorsToZero());
};
