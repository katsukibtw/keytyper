import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import '../styles/Education.scss';
import { indexPath } from "../App";
import { useEffect, useState } from "react";
import { faArrowLeft, faCheck, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";
import {
	Link, Outlet,
	useNavigate
} from "react-router-dom";
import { setLevel, setLevelId, setLevelWordList, setMode, setTime, setUserId, setUserName, setUserRefreshToken, setComplLevel, addComplLevel } from "../store/actions";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React from 'react';

export default function RouteEducation(props) {
	const {
		user: { id, refreshToken },
		preferences: { mode }
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [token, setToken] = useState('');
	const [expire, setExpire] = useState('');
	const [user, setUser] = useState([]);
	const [usrName, setUsrName] = useState('');
	const navigate = useNavigate();

	const getUserStats = async (uid) => {
		try {
			await axios.get('http://94.181.190.26:9967/api/stats', {
				headers: {
					user_id: uid
				},
				withCredentials: true,
			}).then((res) => {
				res.data.forEach((entry) => {
					if (entry.wpm >= 25 && entry.errors <= 3) {
						dispatch(addComplLevel(entry.level));
					}
				});
			});
		} catch (error) {
			if (error.response) {
				console.log(error);
			}
		}
	}

	const Logout = async () => {
		try {
			await axios.delete('http://94.181.190.26:9967/api/logout');
			navigate(`${indexPath}/login`);
			dispatch(setUserRefreshToken(null));
			dispatch(setUserId(''));
			dispatch(setUserName(''));
			dispatch(setComplLevel([]));
			localStorage.setItem('refreshToken', '');
		} catch (error) {
			console.log(error);
		}
	}

	const refreshTokenFunc = async () => {
		try {
			const resp = await axios.get('http://94.181.190.26:9967/api/token', {
				headers: {
					refreshToken: refreshToken
				},
				withCredentials: true,
			})
				.catch((error) => {
					if (error.response) {
						Logout();
					}
				});
			setToken(resp.data.accessToken);
			dispatch(setUserRefreshToken(resp.data.accessToken));
			localStorage.setItem("refreshToken", refreshToken);
			const decoded = jwtDecode(resp.data.accessToken);
			setUsrName(decoded.name);
			setExpire(decoded.exp);
			dispatch(setUserId(decoded.userId));
			dispatch(setUserName(decoded.name));
		} catch (error) {
			if (error.response && mode !== 'init') {
				navigate(`${indexPath}/login`);
			}
		}
	}

	const axiosJWT = axios.create();
	axiosJWT.interceptors.request.use(async (config) => {
		const currentDate = new Date();
		if (expire * 1000 < currentDate.getTime()) {
			const response = await axios.get('http://94.181.190.26:9967/api/token',
				{ withCredentials: true });
			config.headers.Authorization = `Bearer ${response.data.accessToken}`;
			setToken(response.data.accessToken);
			const decoded = jwtDecode(response.data.accessToken);
			setUsrName(decoded.name);
			setExpire(decoded.exp);
		}
		return config;
	}, (error) => {
		return Promise.reject(error);
	})

	useEffect(() => {
		if (refreshToken !== undefined) {
			refreshTokenFunc();
		}
		getUserStats(id);
	}, [dispatch, refreshToken]);

	return (
		<div className="edu_cont">
			<Outlet />
		</div>
	);
}

export const LevelList = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		user: { levelsCompl }
	} = useSelector((state) => state);

	const handleLevelSelection = (level, levelId) => {
		dispatch(setLevel(level));
		import(`../edu_levels/${level}.json`).then((words) =>
			dispatch(setLevelWordList(words.default))
		);
		dispatch(setLevelId(levelId));
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
			className="level_cont"
			onKeyDown={onKeyDown}
			tabIndex="0">
			<div className="level_list">
				{levelList.map((entry, idx) => {
					return (
						<div className="dumm" key={entry + idx + idx}>
							<div
								className={idx === 0 ? "level_list__step_block active" : "level_list__step_block"}
								id={idx}
								onClick={() => document.getElementById(idx).classList.toggle('active')}
								key={entry + idx}>
								<FontAwesomeIcon icon={faPlay} className="indicator" />{`Этап ${entry.step}`}
							</div>
							<div className="level_list__container" key={entry + idx + idx}>
								{entry.levels.map((el, id) => {
									return (
										<div
											className="level_list__entry"
											onClick={() => handleLevelSelection(el.filename, el.id)}
											key={el + id}>
											{el.name}
											{levelsCompl.includes(el.id) ?
												<FontAwesomeIcon icon={faCheck} className="level_list__entry__check" />
												: ''
											}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
			<div className="desc">
				<div className="desc__text">Главная задача этого раздела - обучение слепой печати с помощью специальных упражнений. Вам необходимо проходить все уровни максимально аккуратно и при этом быстро, тренируя тем самым мышечную память рук. Старайтесь при этом как можно меньше смотреть на клавиатуру и больше смотреть в экран. Неплохо будет также совмещать это с тренировками в разделе "Быстрая тренировка". Чем чаще будете тренироваться, тем лучше будет получаться :)</div>
				<div className="desc__keyboard">
					<div className="desc__keyboard__text">Руки на клавиатуре должны лежать так, чтобы указательные пальцы находились на отмеченных клавишах (на этих клавишах есть бугорки, которые помогают найти пальцам нужное положение). Каждый палец отвечает за свою зону (они выделены на схеме разными цветами). Старайтесь не путать зоны между пальцами.</div>
					<div className="desc__keyboard__row">
						<div className="desc__keyboard__row__key zone1">
							<div className="desc__keyboard__row__key__symbol1">q</div>
							<div className="desc__keyboard__row__key__symbol2">й</div>
						</div>
						<div className="desc__keyboard__row__key zone2">
							<div className="desc__keyboard__row__key__symbol1">w</div>
							<div className="desc__keyboard__row__key__symbol2">ц</div>
						</div>
						<div className="desc__keyboard__row__key zone3">
							<div className="desc__keyboard__row__key__symbol1">e</div>
							<div className="desc__keyboard__row__key__symbol2">у</div>
						</div>
						<div className="desc__keyboard__row__key zone4">
							<div className="desc__keyboard__row__key__symbol1">r</div>
							<div className="desc__keyboard__row__key__symbol2">к</div>
						</div>
						<div className="desc__keyboard__row__key zone4">
							<div className="desc__keyboard__row__key__symbol1">t</div>
							<div className="desc__keyboard__row__key__symbol2">е</div>
						</div>
						<div className="desc__keyboard__row__key zone5">
							<div className="desc__keyboard__row__key__symbol1">y</div>
							<div className="desc__keyboard__row__key__symbol2">н</div>
						</div>
						<div className="desc__keyboard__row__key zone5">
							<div className="desc__keyboard__row__key__symbol1">u</div>
							<div className="desc__keyboard__row__key__symbol2">г</div>
						</div>
						<div className="desc__keyboard__row__key zone6">
							<div className="desc__keyboard__row__key__symbol1">i</div>
							<div className="desc__keyboard__row__key__symbol2">ш</div>
						</div>
						<div className="desc__keyboard__row__key zone7">
							<div className="desc__keyboard__row__key__symbol1">o</div>
							<div className="desc__keyboard__row__key__symbol2">щ</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">p</div>
							<div className="desc__keyboard__row__key__symbol2">з</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">{"[ {"}</div>
							<div className="desc__keyboard__row__key__symbol2">х</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">{"] }"}</div>
							<div className="desc__keyboard__row__key__symbol2">ъ</div>
						</div>
					</div>
					<div className="desc__keyboard__row">
						<div className="desc__keyboard__row__key zone1">
							<div className="desc__keyboard__row__key__symbol1">a</div>
							<div className="desc__keyboard__row__key__symbol2">ф</div>
						</div>
						<div className="desc__keyboard__row__key zone2">
							<div className="desc__keyboard__row__key__symbol1">s</div>
							<div className="desc__keyboard__row__key__symbol2">ы</div>
						</div>
						<div className="desc__keyboard__row__key zone3">
							<div className="desc__keyboard__row__key__symbol1">d</div>
							<div className="desc__keyboard__row__key__symbol2">в</div>
						</div>
						<div className="desc__keyboard__row__key main zone4">
							<div className="desc__keyboard__row__key__symbol1">f</div>
							<div className="desc__keyboard__row__key__symbol2">а</div>
						</div>
						<div className="desc__keyboard__row__key zone4">
							<div className="desc__keyboard__row__key__symbol1">g</div>
							<div className="desc__keyboard__row__key__symbol2">п</div>
						</div>
						<div className="desc__keyboard__row__key zone5">
							<div className="desc__keyboard__row__key__symbol1">h</div>
							<div className="desc__keyboard__row__key__symbol2">р</div>
						</div>
						<div className="desc__keyboard__row__key main zone5">
							<div className="desc__keyboard__row__key__symbol1">j</div>
							<div className="desc__keyboard__row__key__symbol2">о</div>
						</div>
						<div className="desc__keyboard__row__key zone6">
							<div className="desc__keyboard__row__key__symbol1">k</div>
							<div className="desc__keyboard__row__key__symbol2">л</div>
						</div>
						<div className="desc__keyboard__row__key zone7">
							<div className="desc__keyboard__row__key__symbol1">l</div>
							<div className="desc__keyboard__row__key__symbol2">д</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">{"; :"}</div>
							<div className="desc__keyboard__row__key__symbol2">ж</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">{"' \""}</div>
							<div className="desc__keyboard__row__key__symbol2">э</div>
						</div>
					</div>
					<div className="desc__keyboard__row">
						<div className="desc__keyboard__row__key zone1">
							<div className="desc__keyboard__row__key__symbol1">z</div>
							<div className="desc__keyboard__row__key__symbol2">я</div>
						</div>
						<div className="desc__keyboard__row__key zone2">
							<div className="desc__keyboard__row__key__symbol1">x</div>
							<div className="desc__keyboard__row__key__symbol2">ч</div>
						</div>
						<div className="desc__keyboard__row__key zone3">
							<div className="desc__keyboard__row__key__symbol1">c</div>
							<div className="desc__keyboard__row__key__symbol2">с</div>
						</div>
						<div className="desc__keyboard__row__key zone4">
							<div className="desc__keyboard__row__key__symbol1">v</div>
							<div className="desc__keyboard__row__key__symbol2">м</div>
						</div>
						<div className="desc__keyboard__row__key zone4">
							<div className="desc__keyboard__row__key__symbol1">b</div>
							<div className="desc__keyboard__row__key__symbol2">и</div>
						</div>
						<div className="desc__keyboard__row__key zone5">
							<div className="desc__keyboard__row__key__symbol1">n</div>
							<div className="desc__keyboard__row__key__symbol2">т</div>
						</div>
						<div className="desc__keyboard__row__key zone5">
							<div className="desc__keyboard__row__key__symbol1">m</div>
							<div className="desc__keyboard__row__key__symbol2">ь</div>
						</div>
						<div className="desc__keyboard__row__key zone6">
							<div className="desc__keyboard__row__key__symbol1">{", <"}</div>
							<div className="desc__keyboard__row__key__symbol2">б</div>
						</div>
						<div className="desc__keyboard__row__key zone7">
							<div className="desc__keyboard__row__key__symbol1">{". >"}</div>
							<div className="desc__keyboard__row__key__symbol2">ю</div>
						</div>
						<div className="desc__keyboard__row__key zone8">
							<div className="desc__keyboard__row__key__symbol1">{"/ ?"}</div>
							<div className="desc__keyboard__row__key__symbol2">{". ,"}</div>
						</div>
					</div>
					<div className="desc__keyboard__row">
						<div className="desc__keyboard__row__spacebar"></div>
					</div>
				</div>
				<Link className="exit_btn" to={indexPath} onClick={() => dispatch(setMode("init"))}>
					<FontAwesomeIcon icon={faArrowLeft} />
				</Link>
			</div>
		</div>
	);
}
