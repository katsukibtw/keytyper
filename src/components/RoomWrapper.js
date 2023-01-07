import { resetRoom } from "../actions/resetRoom";
import { useDispatch, useSelector } from "react-redux";
import { setRoomRef, setRoomCaretRef, timerEnd, setRoomWord, setRemainedTime } from "../store/actions";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RoomWrapper() {
	const {
		roomWord: { typedRoomWord, currRoomWord, roomWordList, typedRoomHistory },
		time: { timer, timerId }
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const extraLetters = typedRoomWord.slice(currRoomWord.length).split("");
	const activeWord = useRef(null);
	const caretRef = useRef(null);

	useEffect(() => {
		dispatch(setRoomRef(activeWord));
		dispatch(setRoomCaretRef(caretRef));
	}, [dispatch]);

	useEffect(() => {
		if (typedRoomWord === roomWordList[roomWordList.length - 1] && typedRoomHistory.length === roomWordList.length - 1) {
			dispatch(setRemainedTime(timer));
			dispatch(timerEnd());
			dispatch(setRoomWord(currRoomWord));
		}
	})

	const handleResetClick = () => {
		if (timer) {
			resetRoom();
		}
	}

	return (
		<div className="test">
			<div className={timerId ? "timer" : "hidden timer"}>{timer}</div>
			<div className="wrapper">
				{roomWordList.map((word, idx) => {
					const isActive =
						currRoomWord === word && typedRoomHistory.length === idx;
					return (
						<div
							key={word + idx}
							className="word"
							ref={isActive ? activeWord : null}>
							{isActive ? (
								<span
									ref={caretRef}
									id="caret"
									className="blink"
									style={{
										left: typedRoomWord.length * 14,
									}}>
									|
								</span>
							) : null}
							{word.split("").map((char, charId) => {
								return <span key={char + charId}>{char}</span>;
							})}
							{isActive
								? extraLetters.map((char, charId) => {
									return (
										<span
											key={char + charId}
											className="wrong extra">
											{char}
										</span>
									);
								})
								: typedRoomHistory[idx]
									? typedRoomHistory[idx]
										.slice(roomWordList[idx].length)
										.split("")
										.map((char, charId) => {
											return (
												<span
													key={char + charId}
													className="wrong extra">
													{char}
												</span>
											);
										})
									: null}
						</div>
					);
				})}
			</div>
			<div className={timerId ? "hidden advice" : "advice"}>
				Правильно поставьте пальцы на клавиатуре перед прохождением уровня :)
			</div>
			{timerId ?
				<button className="reset_btn" onClick={handleResetClick}>
					<FontAwesomeIcon icon={faArrowRotateLeft} />
				</button>
				:
				<Link className="exit_btn" to="..">
					<FontAwesomeIcon icon={faArrowLeft} />
				</Link>
			}
		</div>
	);
}
