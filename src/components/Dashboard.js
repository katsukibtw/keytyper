import "../styles/Dashboard.scss";
import { Link } from 'react-router-dom';
import { indexPath, host } from '../App';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { addComplLevel } from '../store/actions';

const Dashboard = (props) => {

	const setShowCmd = props.setShowCmd;

	const {
		user: { id, name, levelsCompl }
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	// avg stats for training mode
	const [avgErrors, setAvgErrors] = useState('--');
	const [avgWpm, setAvgWpm] = useState('--');

	const [avgLevelErrors, setAvgLevelErrors] = useState('--');
	const [avgLevelWpm, setAvgLevelWpm] = useState('--');

	const [levels, setLevels] = useState([]);

	const getUserStats = async (uid) => {
		try {
			const resp = await axios.get(`${host}/api/stats`, {
				headers: {
					user_id: uid
				},
				withCredentials: true,
			});
			let ae = 0;
			let aes = 0;
			let aw = 0;
			let aws = 0;

			resp.data.forEach((entry) => {
				ae += 1;
				aes += entry.errors;
				aw += 1;
				aws += entry.wpm;
				if (entry.wpm >= 25 && entry.errors <= 3) {
					dispatch(addComplLevel(entry.level));
				}
			});
			setLevels(resp.data);
			console.log(levels);
			if (!isNaN(aws) && !isNaN(aw)) setAvgLevelWpm(Math.trunc(aws / aw));
			if (!isNaN(aes) && !isNaN(ae)) setAvgLevelErrors(Math.trunc(aes / ae));
		} catch (error) {
			if (error.response) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		getUserStats(id);
	}, []);

	const onKeyDown = (e) => {
		if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
			setShowCmd((s) => !s);
			e.preventDefault();
		}
		return null;
	};

	return (
		<div
			className="dashboard"
			onKeyDown={onKeyDown}
			tabIndex="0">
			<div className="upper_row">
				<div className="userinfo__user section">
					<FontAwesomeIcon icon={faUser} className="userinfo__user__default" />
					<div className="userinfo__user__name">{name}</div>
				</div>
				<Link to={`${indexPath}`} className="exit_btn">
					<FontAwesomeIcon icon={faArrowLeft} className="icon" />
				</Link>
			</div>
			<div className="userinfo">
				<div className="userinfo__trainstats section">
					<div className="stat_header">Статистика по тренировке</div>
					<div className="stats">
						<div className="stats__entry">
							<div className="stats__entry__header">Средний WPM</div>
							<div className="stats__entry__value">{avgWpm}</div>
						</div>
						<div className="stats__sep"></div>
						<div className="stats__entry">
							<div className="stats__entry__header">Среднее кол-во ошибок</div>
							<div className="stats__entry__value">{avgErrors}</div>
						</div>
					</div>
				</div>
				<div className="userinfo__edustats section">
					<div className="stat_header">Статистика по обучающим уровням</div>
					<div className="stats">
						<div className="stats__entry">
							<div className="stats__entry__header">Средний WPM</div>
							<div className="stats__entry__value">{avgLevelWpm}</div>
						</div>
						<div className="stats__sep"></div>
						<div className="stats__entry">
							<div className="stats__entry__header">Среднее кол-во ошибок</div>
							<div className="stats__entry__value">{avgLevelErrors}</div>
						</div>
					</div>
				</div>
			</div>
			<div className="levels_compl">
				<div className="levels_compl__header">Статистика по прохождению обучающих уровней</div>
				<div className="levels_compl__list">
					<div className="levels_compl__list__value">Уровень</div>
					<div className="levels_compl__list__value">WPM</div>
					<div className="levels_compl__list__value">Кол-во ошибок</div>
					<div className="levels_compl__list__value">Слова без ошибок</div>
					<div className="levels_compl__list__value">Дата</div>
					{levels.map((el, idx) => {
						const date = new Date(el.createdAt);
						return (
							<>
								<div className="levels_compl__list__entry" key={el + idx}>{el.level}</div>
								<div className="levels_compl__list__entry" key={el + idx + idx}>{el.wpm}</div>
								<div className="levels_compl__list__entry" key={el + idx + idx + idx}>{el.errors}</div>
								<div className="levels_compl__list__entry" key={el + idx + idx + idx + idx}>{el.cr_words}</div>
								<div className="levels_compl__list__entry" key={el + idx + idx + idx + idx + idx}>{date.toLocaleString()}</div>
							</>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
