import '../styles/TestWrapper.scss';
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRef, setCaretRef, setMode, incErrorCount } from "../store/actions";
import { Link } from "react-router-dom";
import { faArrowLeft, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { indexPath } from "../App";
import { resetTest } from '../actions/resetTest';

export default function TestWrapper(props) {

	const {
		word: { typedWord, currWord, wordList, typedHistory },
		time: { timer, timerId },
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const extraLetters = typedWord.slice(currWord.length).split("");
	const activeWord = useRef(null);
	const caretRef = useRef(null);

	useEffect(() => {
		dispatch(setRef(activeWord));
		dispatch(setCaretRef(caretRef));
	}, [dispatch]);

	const handleResetClick = () => {
		if (timer) {
			resetTest();
		}
	}

	return (
		<div className="test">
			<div className={timerId ? "timer" : "hidden timer"}>{timer}</div>
			<div className="wrapper">
				{wordList.slice(0, 501).map((word, idx) => {
					const isActive =
						currWord === word && typedHistory.length === idx;
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
										left: typedWord.length * 14,
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
								: typedHistory[idx]
									? typedHistory[idx]
										.slice(wordList[idx].length)
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
			{timerId ?
				<button className="reset_btn" onClick={handleResetClick}>
					<FontAwesomeIcon icon={faArrowRotateLeft} />
				</button>
				:
				<Link className="exit_btn" to={indexPath} onClick={() => dispatch(setMode("init"))}>
					<FontAwesomeIcon icon={faArrowLeft} />
				</Link>
			}
		</div>
	);
}
