import '../styles/RoomStats.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { host } from '../App';

const RoomStats = ({ socket }, props) => {
	const {
		room: { roomname, room_id }
	} = useSelector((state) => state);
	const [stats, setStats] = useState([]);
	const [msg, setMsg] = useState('');

	const getRoomStats = async ({ room }) => {
		try {
			const resp = await axios.get(`${host}/api/roomstats`, {
				headers: {
					room_id: room
				},
				withCredentials: true,
			});
			console.log(resp.data);
			if (resp.data.length === 0) {
				setMsg(':( Пока что здесь нет записей');
				setStats([]);
			} else {
				setMsg('');
				setStats(resp.data);
			}
		} catch (error) {
			if (error.response) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		getRoomStats({ room: room_id });
	}, []);

	return (
		<div className="stats">
			<div className="container">
				<div className="container__header">
					<Link to=".." className="container__header__exitbtn">
						<FontAwesomeIcon icon={faArrowLeft} className="container__header__exitbtn__icon" />
					</Link>
					Статистика по комнате
					"<div className="container__header__roomname">{roomname}</div>"
				</div>
				<div className="container__row first">
					<div className="container__row__entry">Уровень</div>
					<div className="container__row__entry">WPM</div>
					<div className="container__row__entry">Ошибки</div>
					<div className="container__row__entry">Слова без ошибок</div>
					<div className="container__row__entry">Никнейм</div>
					<div className="container__row__entry">Дата</div>
				</div>
				{msg && <div className="container__row msg">{msg}</div>}
				{stats.map((el, idx) => {
					const date = new Date(el.createdAt);
					return (
						<div className="container__row">
							<div className="container__row__entry" key={el + idx}>{
								el.level === 121 ?
									'Русский'
									: el.level === 122 ?
										'Русский (С)'
										: el.level === 123 ?
											'Английский'
											: el.level === 124 ?
												'Английский (С)'
												: el.level
							}</div>
							<div className="container__row__entry" key={el + idx + idx}>{el.wpm}</div>
							<div className="container__row__entry" key={el + idx + idx + idx}>{el.errors}</div>
							<div className="container__row__entry" key={el + idx + idx + idx + idx}>{el.cr_words}</div>
							<div className="container__row__entry" key={el + 123}>{el.room_user_id}</div>
							<div className="container__row__entry" key={el + idx + idx + idx + idx + idx}>{date.toLocaleString()}</div>
						</div>
					);
				})}
			</div>
		</div>
	)
}

export default RoomStats;
