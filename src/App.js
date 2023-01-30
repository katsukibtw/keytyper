import './styles/App.scss';
import './styles/themes.scss';
import './styles/fonts.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import Cmd from './components/Cmd';
import { faArrowLeft, faPlus, faRightToBracket, faMagnifyingGlass, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from "react-router-dom";
import RouteTraining from "./routes/RouteTesting";
import RouteEducation, { LevelList } from "./routes/RouteEducation";
import RouteRoom from './routes/RouteRoom';
import RoutedTest from './components/RoutedTest';
import RoomTest from './components/RoomTest';
import RoomStats from './components/RoomStats';
import {
	setMode,
	setUserId,
	setUserName,
	setUserRefreshToken,
	setRoomSafecode,
	setRoomName,
	setRoomUsername,
	setRoomUserId,
	setRoomId
} from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Dashboard from './components/Dashboard';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import SocketContext from './SocketContext';
import { io } from 'socket.io-client';

// some minor configuration for hosting
export const host = 'http://94.181.190.26:9967';
export const indexPath = "/10v/skripko/keytyper";

const socket = io(host, { transports: ['websocket', 'polling', 'flashsocket'] });

const App = () => {
	axios.defaults.withCredentials = true;
	// some store vars for checking user id
	const {
		user: { refreshToken },
		preferences: { mode }
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [token, setToken] = useState('');
	const [expire, setExpire] = useState('');
	const [usrName, setUsrName] = useState('');

	const [showCmd, setShowCmd] = useState(false);

	const refreshTokenFunc = async () => {
		try {
			const resp = await axios.get(`${host}/api/token`, {
				headers: {
					refreshToken: refreshToken
				},
				withCredentials: true,
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
				console.log("refresh token error")
			}
		}
	}

	const axiosJWT = axios.create();
	axiosJWT.interceptors.request.use(async (config) => {
		const currentDate = new Date();
		if (expire * 1000 < currentDate.getTime()) {
			const response = await axios.get(`${host}/api/token`,
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
		if (refreshToken) {
			refreshTokenFunc();
		}
	}, [dispatch]);

	const onKeyDown = (e) => {
		if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
			setShowCmd((s) => !s);
			e.preventDefault();
		}
		return null;
	};

	const handleMovingToMode = (mode) => {
		dispatch(setMode(mode));
	}

	useEffect(() => {
		const code = localStorage.getItem('room_safecode') || '';
		const username = localStorage.getItem('room_username') || '';
		const roomname = localStorage.getItem('room_name') || '';
		const userid = localStorage.getItem('room_userid') || '';
		const roomid = localStorage.getItem('room_id') || '';

		dispatch(setMode('init'));
		dispatch(setRoomUsername(username));
		dispatch(setRoomName(roomname));
		dispatch(setRoomSafecode(code));
		dispatch(setRoomUserId(userid));
		dispatch(setRoomId(roomid));
	}, [])

	return (
		<SocketContext.Provider value={socket}>
			<Router>
				<div
					className="App"
					onKeyDown={onKeyDown}
					tabIndex="0">
					<Header />
					{showCmd && <Cmd setShowCmd={setShowCmd} />}
					<MobileBlock />

					<Routes>
						<Route path={indexPath} element={
							<div className="index_links">
								<Link className="route_link" to={`${indexPath}/training`} onClick={() => handleMovingToMode("test")}>
									<FontAwesomeIcon icon={faClock} className="route_link__icon" />
									<div className="route_link__text">Быстрая тренировка</div>
								</Link>
								<Link className="route_link" to={`${indexPath}/education`} onClick={() => handleMovingToMode("edu")}>
									<FontAwesomeIcon icon={faMagnifyingGlass} className="route_link__icon" />
									<div className="route_link__text">Программа обучения</div>
								</Link>
								<div className="link_row">
									<div className="link_row__title">Комнаты:</div>
									<div className="link_row__links">
										<Link className="route_link gridded" to={`${indexPath}/createroom`} onClick={() => handleMovingToMode("room")}>
											<FontAwesomeIcon icon={faPlus} className="route_link__icon" />
											<div className="route_link__text">Создать</div>
										</Link>
										<Link className="route_link gridded" to={`${indexPath}/joinroom`} onClick={() => handleMovingToMode("room")}>
											<FontAwesomeIcon icon={faRightToBracket} />
											<div className="route_link__text">Войти</div>
										</Link>
									</div>
								</div>
							</div>
						} />
						<Route path={`${indexPath}/training`} element={<RouteTraining setShowCmd={setShowCmd} />} />
						<Route path={`${indexPath}/education`} element={<RouteEducation setShowCmd={setShowCmd} />}>
							<Route index element={<LevelList />} />
							<Route path="test" element={<RoutedTest setShowCmd={setShowCmd} />} />
						</Route>
						<Route path={`${indexPath}/createroom`} element={<CreateRoom setShowCmd={setShowCmd} socket={socket} />} />
						<Route path={`${indexPath}/joinroom`} element={<JoinRoom setShowCmd={setShowCmd} socket={socket} />} />
						<Route path={`${indexPath}/room`} >
							<Route index element={<RouteRoom setShowCmd={setShowCmd} socket={socket} />} />
							<Route path="test" element={<RoomTest setShowCmd={setShowCmd} socket={socket} />} />
							<Route path="stats" element={<RoomStats setShowCmd={setShowCmd} socket={socket} />} />
						</Route>
						<Route path={`${indexPath}/login`} element={<Login />} />
						<Route path={`${indexPath}/dashboard`} element={<Dashboard setShowCmd={setShowCmd} />} />
						<Route index element={<Navigate to="/10v/skripko/keytyper" />} />
					</Routes>

					<Footer />
				</div>
			</Router>
		</SocketContext.Provider>
	);
}

const MobileBlock = () => {
	return (
		<div className="mobile_block">
			<div className="mobile_block__smile">:(</div>
			<p className="mobile_block__text">К сожалению, на данный момент страница не адаптирована под мобильные устройства, пожалуйста, откройте сайт на компьютере
			</p>
		</div>
	);
}

export const Placeholder = (props) => {
	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && e.key === "e") {
				props.setShowCmd((s) => !s);
				e.preventDefault();
			}
		};
		return () => {
			document.onkeydown = null;
		};
	});

	return (
		<div className="dummydiv">placeholder
			<Link className="exit_btn" to="..">
				<FontAwesomeIcon icon={faArrowLeft} />
			</Link>
		</div>
	);
}

export default App;
