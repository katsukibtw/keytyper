import { resetTest } from "../actions/resetTest";
import { useSelector } from "react-redux";
import "../styles/Results.scss";

export default function Results() {
    const {
        word: { wordList, typedHistory, currWord },
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
            <h1>{Math.round(wpm) + " wpm"}</h1>
			<div className="info">
				<div className="info__row">
					<div>Слова без ошибок:</div>
					<div>{result.filter((x) => x).length}</div>
				</div>
				<div className="info__row">
					<div>Слова с ошибками:</div>
					<div>{result.filter((x) => !x).length}</div>
				</div>
			</div>
            <button className="btn" onClick={() => resetTest()}>Restart</button>
        </div>
    );
}
