import { useSelector, useDispatch } from "react-redux";
import "../styles/Results.scss";
import { resetLevel } from "../actions/resetLevel";
import { useEffect, useState } from "react";
import axios from 'axios';
import { addComplLevel } from '../store/actions';
import { Link } from 'react-router-dom';

export default function RoutedResults() {
	const {
		time: { remTime },
		levelWord: { levelWordList, typedLevelHistory, currLevelWord, levelId, levelErrors },
		user: { id },
		preferences: { timeLimit },
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [msg, setMsg] = useState('');
	const [success, setSuccess] = useState(false);

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
			const resp = await axios.post('http://94.181.190.26:9967/api/stats', {
				level: levelId,
				wpm: wpm,
				errors: levelErrors,
				cr_words: result.filter((x) => x).length,
				time: timeLimit,
				user_id: id,
			},
				{ withCredentials: true });
			setMsg(resp.data.msg);
			if (resp.data.corr) {
				dispatch(addComplLevel(levelId));
				setSuccess(true);
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
					<div>Количество ошибок:</div>
					<div>{levelErrors}</div>
				</div>
				<div className="info__msg">{msg}</div>
			</div>
			{success ?
				<Link to='..' className="btn" onClick={() => resetLevel()}>Выход из уровня</Link>
				: <button className="btn" onClick={() => resetLevel()}>Restart</button>}
		</div>
	);
}
