import { resetLevel } from "../actions/resetLevel";
import { useDispatch, useSelector } from "react-redux";
import { setLevelRef, setLevelCaretRef, timerEnd, setLevelWord, setRemainedTime, incLevelErrorCount } from "../store/actions";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RoutedWrapper() {
	const {
		levelWord: { typedLevelWord, currLevelWord, levelWordList, typedLevelHistory },
		time: { timer, timerId }
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const extraLetters = typedLevelWord.slice(currLevelWord.length).split("");
	const activeWord = useRef(null);
	const caretRef = useRef(null);

	useEffect(() => {
		dispatch(setLevelRef(activeWord));
		dispatch(setLevelCaretRef(caretRef));
	}, [dispatch]);

	useEffect(() => {
		if (typedLevelWord === levelWordList[levelWordList.length - 1] && typedLevelHistory.length === levelWordList.length - 1) {
			dispatch(setRemainedTime(timer));
			dispatch(timerEnd());
			dispatch(setLevelWord(currLevelWord));
		}
	})

	const handleResetClick = () => {
		if (timer) {
			resetLevel();
		}
	}

	return (
		<div className="test">
			<div className={timerId ? "timer" : "hidden timer"}>{timer}</div>
			<div className="wrapper">
				{levelWordList.map((word, idx) => {
					const isActive =
						currLevelWord === word && typedLevelHistory.length === idx;
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
										left: typedLevelWord.length * 14,
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
								: typedLevelHistory[idx]
									? typedLevelHistory[idx]
										.slice(levelWordList[idx].length)
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
