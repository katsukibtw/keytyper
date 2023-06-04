import { useSelector } from "react-redux";
import "../styles/Results.scss";
import { resetRoom } from "../actions/resetRoom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { host } from '../App';

export default function RoomResults() {
	const {
		time: { remTime },
		roomWord: { roomWordList, typedRoomHistory, currRoomWord, roomLevelId, roomErrors },
		room: { room_id, user_id },
		preferences: { timeLimit },
	} = useSelector((state) => state);

	const [msg, setMsg] = useState('');
	const [success, setSuccess] = useState(false);

	const spaces = roomWordList.indexOf(currRoomWord);
	let correctChars = 0;
	const result = typedRoomHistory.map(
		(typedWord, idx) => typedWord === roomWordList[idx]
	);
	result.forEach((r, idx) => {
		if (r) correctChars += roomWordList[idx].length;
	});
	const wpm = [121, 122, 123, 124].includes(roomLevelId) ? ((correctChars + spaces) * 60) / timeLimit / 5
		: ((correctChars + spaces) * 60 * 5 * (remTime / roomWordList.length / (timeLimit - remTime) + .3)) / timeLimit / 5;

	const sendNewStatEntry = async () => {
		try {
			const resp = await axios.post(`${host}/api/stats`, {
				level: roomLevelId,
				wpm: wpm,
				errors: roomErrors,
				cr_words: result.filter((x) => x).length,
				time: timeLimit,
				room_user_id: user_id,
				room_id: room_id,
			},
				{ withCredentials: true });
			if ([121, 122, 123, 124].includes(roomLevelId)) {
				setMsg('Результат успешно сохранен');
			} else {
				setMsg(resp.data.msg);
				if (resp.data.corr) {
					setSuccess(true);
				}
			}
		} catch (error) {
			if (error.response) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		if (roomWordList.length === typedRoomHistory.length || [121, 122, 123, 124].includes(roomLevelId)) {
			sendNewStatEntry();
		} else {
			setMsg(':( Вы не успели напечатать все слова. Попробуйте еще раз');
			setSuccess(false);
		}
	}, []);

	return (
		<div className="result">
			<h1>{Math.round(wpm) + " с\/мин"}</h1>
			<div className="info">
				<div className="info__row">
					<div>Слова без ошибок:</div>
					<div>{result.filter((x) => x).length}</div>
				</div>
				<div className="info__row">
					<div>Количество ошибок:</div>
					<div>{roomErrors}</div>
				</div>
				<div className="info__msg">{msg}</div>
			</div>
			{success ?
				<Link to='..' className="btn" onClick={() => resetRoom()}>
					<FontAwesomeIcon icon={faArrowLeft} className="btn__icon" />
					<div className="btn__text">Выход из уровня</div>
				</Link>
				:
				<button className="btn" onClick={() => resetRoom()}>
					<FontAwesomeIcon icon={faArrowRotateLeft} className="btn__icon" />
					<div className="btn__text">Заново</div>
				</button>}
		</div>
	);
}
