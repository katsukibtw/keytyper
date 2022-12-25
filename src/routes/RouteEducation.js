import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import '../styles/Education.scss';
import { indexPath } from "../App";
import { useEffect, useState } from "react";
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";
import {
	Link,
	Outlet,
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

	const onKeyDown = (e) => {
		if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
			props.setShowCmd((s) => !s);
			e.preventDefault();
		}
		return null;
	};

	return (
		<div
			className="edu_cont"
			onKeyDown={onKeyDown}
			tabIndex="0">
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

	return (
		<>
			<div className="level_list">
				{levelList.map((entry, idx) => {
					return (
						<div className="dumm" key={entry + idx + idx}>
							<div
								className="level_list__step_block"
								key={entry + idx}>
								{`Этап ${entry.step}`}
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
			<Link className="exit_btn" to={indexPath} onClick={() => dispatch(setMode("init"))}>
				<FontAwesomeIcon icon={faArrowLeft} />
			</Link>
		</>
	);
}
