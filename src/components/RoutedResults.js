import { useSelector } from "react-redux";
import "../styles/Results.scss";
import { resetLevel } from "../actions/resetLevel";
import { useEffect } from "react";

export default function RoutedResults() {
    const {
        time: { remTime },
        levelWord: { levelWordList, typedLevelHistory, currLevelWord, levelId },
        user: { id, name },
        preferences: { timeLimit },
    } = useSelector((state) => state);
    
    const spaces = levelWordList.indexOf(currLevelWord);
    let correctChars = 0;
    const result = typedLevelHistory.map(
        (typedWord, idx) => typedWord === levelWordList[idx]
    );
    result.forEach((r, idx) => {
        if (r) correctChars += levelWordList[idx].length;
    });
    const wpm = ((correctChars + spaces) * 60 * 5 * (remTime / levelWordList.length / (timeLimit - remTime) + .3)) / timeLimit / 5;
    
    const sendNewStatEntry = async () => {
        
    }

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
            <button className="btn" onClick={() => resetLevel()}>Restart</button>
        </div>
    );
}
