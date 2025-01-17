import { resetTest } from "../actions/resetTest";
import { useSelector } from "react-redux";
import "../styles/Results.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

export default function Results() {
	const {
		word: { wordList, typedHistory, currWord, errors },
		preferences: { timeLimit },
	} = useSelector((state) => state);

	const spaces = wordList.indexOf(currWord);
	let correctChars = 0;
	const result = typedHistory.map(
		(typedWord, idx) => typedWord === wordList[idx]
	);
	result.forEach((r, idx) => {
		if (r) correctChars += wordList[idx].length;
	});
	const wpm = ((correctChars + spaces) * 60) / timeLimit / 5;
	return (
		<div className="result">
			<h1>{Math.round(wpm) + " с\/мин"}</h1>
			<div className="info">
				<div className="advice">СВМ - Слова в минуту</div>
				<div className="info__row">
					<div>Слова без ошибок:</div>
					<div>{result.filter((x) => x).length}</div>
				</div>
				<div className="info__row">
					<div>Количество ошибок:</div>
					<div>{errors}</div>
				</div>
			</div>
			<button className="btn" onClick={() => resetTest()}>
				<FontAwesomeIcon icon={faArrowRotateLeft} className="btn__icon" />
				<div className="btn__text">Заново</div>
			</button>
		</div>
	);
}
