import { useSelector, useDispatch } from "react-redux";
import "../styles/Results.scss";
import { resetLevel } from "../actions/resetLevel";
import { useEffect, useState } from "react";
import axios from 'axios';
import { addComplLevel } from '../store/actions';

export default function RoutedResults() {
	const {
		time: { remTime },
		levelWord: { levelWordList, typedLevelHistory, currLevelWord, levelId },
		user: { id },
		preferences: { timeLimit },
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [msg, setMsg] = useState('');

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
		try {
			const resp = await axios.post('http://localhost:5000/api/stats', {
				level: levelId,
				wpm: wpm,
				errors: result.filter((x) => !x).length,
				cr_words: result.filter((x) => x).length,
				time: timeLimit,
				user_id: id,
			});
			setMsg(resp.data.msg);
			if (resp.data.corr) {
				dispatch(addComplLevel(levelId));
			}
		} catch (error) {
			if (error.response) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		sendNewStatEntry();
	}, []);

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
				<div className="info__msg">{msg}</div>
			</div>
			<button className="btn" onClick={() => resetLevel()}>Restart</button>
		</div>
	);
}
