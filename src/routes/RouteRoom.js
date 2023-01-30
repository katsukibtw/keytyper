import { useSelector, useDispatch } from 'react-redux';
import {
	setRoomName,
	setRoomLevel,
	setRoomWordList,
	setRoomLevelId,
	setTime
} from '../store/actions';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { faUser, faGear, faPlay, faCheck, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";

const RouteRoom = ({ socket }, props) => {
	const {
		room: { safe_code, roomname, username, user_id }
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [presentUsers, setPresentUsers] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [roomAdmin, setRoomAdmin] = useState('');
	const [levelSet, setLevelSet] = useState([]);
	const [showSettings, setShowSettings] = useState(false);
	const [levelsCompl, setLevelsCompl] = useState([]);
	const [msg, setMsg] = useState('');

	// useEffect(() => {
	// socket.emit('join', ({ safe_code, username }));
	// }, [])

	useEffect(() => {
		socket.emit('get room data', ({ room: roomname }));
		socket.emit('get room levels', ({ room: roomname }));
		socket.emit('get user db id', ({ room: roomname, username: username }));
	}, [])

	useEffect(() => {
		// gettings user and room data
		socket.on('roomData', ({ room, admin, users }) => {
			setPresentUsers(users);
			setRoomAdmin(admin);
			dispatch(setRoomName(room));
			if (username === admin) setIsAdmin(true);
		});
		socket.on('roomLevels', ({ room, levels }) => {
			setLevelSet(levels);
		})
		socket.on('userDBId', ({ user_id }) => {
			dispatch(setRoomLevelId(user_id));
		});

		// errors
		socket.on('failed to add level', ({ error }) => console.log(error));
		socket.on('failed to join', ({ error }) => {
			setMsg(error);
		})
	}, []);

	const handleLevelSelection = ({ level_id }) => {
		document.getElementById(`el${level_id}`).classList.toggle('toggled');
		socket.emit('toggle level', ({ room: roomname, level_id: level_id }));
	}

	const goToLevel = ({ filename, level_id }) => {
		dispatch(setRoomLevel(filename));
		if ([121, 122, 123, 124].includes(level_id)) {
			import(`../langs/${filename}.json`).then((words) => {
				dispatch(setRoomWordList(words.default));
			});
		} else {
			import(`../edu_levels/${filename}.json`).then((words) =>
				dispatch(setRoomWordList(words.default))
			);
		}
		dispatch(setRoomLevelId(level_id));
		dispatch(setTime(30));
		navigate("test");
	}

	const onKeyDown = (e) => {
		if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
			props.setShowCmd((s) => !s);
			e.preventDefault();
		}
		return null;
	};

	return (
		<div
			className="room"
			onKeyDown={onKeyDown}
			tabIndex="0">
			{msg && <div className="room_msg">{`ERROR: ${msg}`}</div>}
			<div className="room__uprow">
				<div className="room__uprow__entry user">
					<FontAwesomeIcon icon={faUser} className="user__icon" />
					<div className="user__name">{username}</div>
				</div>
				<div className="room__uprow__sep" />
				<div className="room__uprow__entry roomname">
					<div className="room__uprow__entry__pretext">Комната:</div>
					<div className="roomname__title">{roomname}</div>
				</div>
				<div className="room__uprow__sep" />
				<div className="room__uprow__entry admin">
					<div className="room__uprow__entry__pretext">Администратор:</div>
					<div className="admin__title">{roomAdmin}</div>
				</div>
				<div className="room__uprow__sep" />
				<div className="room__uprow__entry safecode">
					<div className="room__uprow__entry__pretext">Код комнаты:</div>
					<div className="safecode__title">{safe_code}</div>
				</div>
				<div className="room__uprow__sep" />
				<Link className="room__uprow__entry link" to="stats">
					<FontAwesomeIcon icon={faList} className="link__icon" />
					<div className="link__text">Статистика</div>
				</Link>
				{isAdmin &&
					<>
						<div className="room__uprow__sep" />
						<button className={showSettings ? "room__uprow__entry settingsbtn checked" : "room__uprow__entry settingsbtn"} onClick={() => setShowSettings((s) => !s)}>
							<FontAwesomeIcon icon={faGear} className="settingsbtn__icon" />
						</button>
					</>
				}
			</div>
			<div className="room__middlesec">
				<div className="room__middlesec__entry users">
					<div className="room__middlesec__entry__header">Пользователи в комнате:</div>
					{presentUsers.map((el, idx) => {
						return (
							<div className="users__entry" key={el + idx}>
								<FontAwesomeIcon icon={faUser} className="users__entry__icon" />
								{el.username}
								{roomAdmin === el.username
									? <div className="users__entry__admin">(Администратор)</div>
									: ''
								}
							</div>
						);
					})}
				</div>
				<div className="room__middlesec__entry level_list">
					<div className="room__middlesec__entry__header">Уровни:</div>
					{levelList.map((entry, idx) => {
						return (
							<div className="dumm" key={entry + idx + idx}>
								<div
									className={idx === 0 ? "level_list__step_block active" : "level_list__step_block"}
									id={`step${idx}`}
									onClick={() => document.getElementById(`step${idx}`).classList.toggle('active')}
									key={entry + idx}>
									<FontAwesomeIcon icon={faPlay} className="indicator" />{`Этап ${entry.step}`}
								</div>
								<div className="level_list__container" key={entry + idx + idx}>
									{entry.levels.map((el, id) => {
										return (
											entry.step === 0 ?
												<div
													className="level_list__entry"
													onClick={() => goToLevel({ filename: el.filename, level_id: el.id })}
													key={el + id}>
													{el.name}
													{levelsCompl.includes(el.id) ?
														<FontAwesomeIcon icon={faCheck} className="level_list__entry__check" />
														: ''
													}
												</div>
												: levelSet.filter((level) => level.id === el.id)[0] ?
													<div
														className="level_list__entry"
														onClick={() => goToLevel({ filename: el.filename, level_id: el.id })}
														key={el + id}>
														{el.name}
														{levelsCompl.includes(el.id) ?
															<FontAwesomeIcon icon={faCheck} className="level_list__entry__check" />
															: ''
														}
													</div>
													: ''
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
				{showSettings &&
					<div className={showSettings ? "room__middlesec__entry settings opened" : "room__middlesec__entry settings"}>
						<div className="settings__header">
							Выбор уровней:
						</div>
						<div className="settings__chooselevels">
							{levelList.map((entry, idx) => {
								return (
									<>
										{entry.step !== 0 &&
											<div className="dumm" key={entry + idx + idx}>
												<div
													className={idx === 0 ? "step_block active" : "step_block"}
													id={idx}
													onClick={() => document.getElementById(idx).classList.toggle('active')}
													key={entry + idx}>
													<FontAwesomeIcon icon={faPlay} className="indicator" />{`Этап ${entry.step}`}
												</div>
												<div className="container" key={entry + idx + idx}>
													{entry.levels.map((el, id) => {
														return (
															<div
																className={levelSet.filter((level) => { return level.id === el.id })[0] ? "entry toggled" : "entry"}
																onClick={() => handleLevelSelection({ filename: el.filename, level_id: el.id })}
																id={`el${el.id}`}
																key={el + id}>
																{el.name.split(' ')[1]}
															</div>
														);
													})}
												</div>
											</div>
										}
									</>
								);
							})}
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default RouteRoom;
