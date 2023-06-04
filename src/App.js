import './styles/App.scss';
import './styles/themes.scss';
import './styles/fonts.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import SettingsPanel from './components/SettingsPanel';
import IndexPage from './components/IndexPage';
import { useState, useEffect } from 'react';
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
	setRoomId,
	setShowSettings
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
// export const host = 'http://94.181.190.26:9967';
export const host = 'http://localhost:9967';
export const indexPath = "/10v/skripko/keytyper";

const socket = io(host, { transports: ['websocket', 'polling', 'flashsocket'] });

const App = () => {
	axios.defaults.withCredentials = true;
	// some store vars for checking user id
	const {
		user: { refreshToken },
		preferences: { mode, show_settings }
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [token, setToken] = useState('');
	const [expire, setExpire] = useState('');
	const [usrName, setUsrName] = useState('');

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
			dispatch(setShowSettings(true));
			e.preventDefault();
		}
		return null;
	};

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
					{show_settings && <SettingsPanel />}
					<MobileBlock />

					<Routes>
						<Route path={indexPath} element={<IndexPage />} />
						<Route path={`${indexPath}/training`} element={<RouteTraining />} />
						<Route path={`${indexPath}/education`} element={<RouteEducation />}>
							<Route index element={<LevelList />} />
							<Route path="test" element={<RoutedTest />} />
						</Route>
						<Route path={`${indexPath}/createroom`} element={<CreateRoom socket={socket} />} />
						<Route path={`${indexPath}/joinroom`} element={<JoinRoom socket={socket} />} />
						<Route path={`${indexPath}/room`} >
							<Route index element={<RouteRoom socket={socket} />} />
							<Route path="test" element={<RoomTest socket={socket} />} />
							<Route path="stats" element={<RoomStats socket={socket} />} />
						</Route>
						<Route path={`${indexPath}/login`} element={<Login />} />
						<Route path={`${indexPath}/dashboard`} element={<Dashboard />} />
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
