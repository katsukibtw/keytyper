import './styles/App.scss';
import './styles/themes.scss';
import './styles/fonts.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import Cmd from './components/Cmd';
import { faArrowLeft, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
import RoutedTest from './components/RoutedTest';
import { setMode, setUserId, setUserName, setUserRefreshToken } from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function App() {
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
			const resp = await axios.get('http://94.181.190.26:6743/api/auth', {
				refreshToken: refreshToken
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
			const response = await axios.get('http://94.181.190.26:6743/api/token');
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

	return (
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
							<Link className="route_link" to={`${indexPath}/training`} onClick={() => handleMovingToMode("test")}>Быстрая тренировка</Link>
							<Link className="route_link" to={`${indexPath}/education`} onClick={() => handleMovingToMode("edu")}>Программа обучения</Link>
							<div className="link_row">
								<div className="link_row__title">Класс:</div>
								<div className="link_row__links">
									<Link className="route_link gridded" to={`${indexPath}/classroom`}>
										<FontAwesomeIcon icon={faPlus} />
									</Link>
									<Link className="route_link gridded" to={`${indexPath}/classroom`}>
										<FontAwesomeIcon icon={faArrowRight} />
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
					<Route path={`${indexPath}/classroom`} element={<Placeholder setShowCmd={setShowCmd} />} />
					<Route path={`${indexPath}/login`} element={<Login />} />
					<Route index element={<Navigate to="/10v/skripko/keytyper" />} />
				</Routes>

				<Footer />
			</div>
		</Router>
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

export const indexPath = "/10v/skripko/keytyper";
export default App;
