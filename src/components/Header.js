import '../styles/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faUser } from '@fortawesome/free-regular-svg-icons';
import { faRightToBracket, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { resetTest } from "../actions/resetTest";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setTheme,
	setTime,
	setLang,
	setFont,
	setLevel,
	timerSet,
	setLevelWordList,
	setMode,
	setUserRefreshToken,
	setUserId,
	setUserName,
	setComplLevel,
	setRoomUsername,
	setRoomSafecode,
	setRoomName
} from "../store/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { indexPath, host } from "../App";
import { Link } from 'react-router-dom';
import axios from 'axios';

export const options = {
	time: [15, 30, 45, 60, 120],
	theme: [
		"tokyonight",
		"solarized",
		"catppuccin",
		"gruvbox",
		"gruvbox_light",
		"nord",
		"nord_light",
		"everforest",
		"mellow"
	],
	lang: ["eng", "eng_hard", "rus", "rus_hard"],
};

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const [showButtons, setShowButtons] = useState(false);

	const {
		preferences: { timeLimit, theme, lang, font, mode },
		user: { name, refreshToken },
		time: { timerId },
	} = useSelector((state) => state);
	const [showLogoutButton, setShowLogoutButton] = useState(!(refreshToken === null || refreshToken === 'null'));
	const dispatch = useDispatch();
	const fonts = ["mononoki", "roboto_mono"];

	useEffect(() => {
		setShowButtons(location.pathname === indexPath + "/training" ? true : false);
	}, [location]);

	useEffect(() => {
		const theme = localStorage.getItem("theme") || "tokyonight";
		const lang = localStorage.getItem("lang") || "rus";
		const time = parseInt(localStorage.getItem("time") || "30", 10);
		const font = localStorage.getItem("font") || "mononoki";
		dispatch(timerSet(time));
		dispatch(setLang(lang));
		dispatch(setTime(time));
		dispatch(setTheme(theme));
		dispatch(setFont(font));

		// for settings level on enter
		const level = localStorage.getItem("level") || "s1_l1";
		import(`../edu_levels/${level}.json`).then((words) =>
			dispatch(setLevelWordList(words.default))
		);
		dispatch(setLevel(level));

		// for settings init status to mode prop if it's broken on startup
		const mode = localStorage.getItem("mode") || "init";
		dispatch(setMode(mode));

		// user things
		const refreshToken = localStorage.getItem("refreshToken") || null;
		const userId = localStorage.getItem('userId') || '';
		const username = localStorage.getItem('username') || '';
		dispatch(setUserRefreshToken(refreshToken));
		dispatch(setUserId(userId));
		dispatch(setUserName(username));
	}, [dispatch]);

	// Set Theme
	useEffect(() => {
		if (theme) {
			document
				.querySelector(`button[value="${theme}"]`)
				?.classList.add("selected");
			document.body.children[1].classList.remove(...options.theme);
			document.body.children[1].classList.add(theme);
			document.body.classList.remove(...options.theme);
			document.body.classList.add(theme);
			localStorage.setItem("theme", theme);
		}
	}, [dispatch, theme]);

	// Set Font
	useEffect(() => {
		if (font) {
			dispatch(setFont(font));
			document.body.children[1].classList.remove(...fonts);
			document.body.children[1].classList.add(font);
			localStorage.setItem("font", font);
		}
	}, [dispatch, font]);

	// Set Time
	useEffect(() => {
		if (timeLimit !== 0) {
			document
				.querySelector(`button[value="${timeLimit}"]`)
				?.classList.add("selected");
			dispatch(setTime(timeLimit));
			localStorage.setItem("time", `${timeLimit}`);
			resetTest();
		}
	}, [dispatch, timeLimit]);

	// Set Type
	useEffect(() => {
		if (lang !== "") {
			document
				.querySelector(`button[value="${lang}"]`)
				?.classList.add("selected");
			dispatch(setLang(lang));
			localStorage.setItem("lang", lang);
			resetTest();
		}
	}, [dispatch, lang]);

	const handleOptions = ({ target }) => {
		const option = target.classList[1];
		if (option) {
			switch (option) {
				case "theme":
					dispatch(setTheme(target.value));
					break;
				case "time":
					dispatch(setTime(+target.value));
					break;
				case "lang":
					dispatch(setLang(target.value));
					break;
			}
			target.blur();
		}
	};

	useEffect(() => {
		setShowLogoutButton(!(refreshToken === null || refreshToken === "null"))
	}, [refreshToken]);

	const Logout = async () => {
		try {
			await axios.delete(`${host}/api/logout`);
			navigate(`${indexPath}`);
			dispatch(setUserRefreshToken(null));
			dispatch(setUserId(''));
			dispatch(setUserName(''));
			dispatch(setComplLevel([]));
			localStorage.setItem('refreshToken', '');
		} catch (error) {
			console.log(error);
		}
	}

	const onHeaderLinkClick = () => {
		if (mode === "room") {
			dispatch(setRoomUsername(''));
			dispatch(setRoomSafecode(''));
			dispatch(setRoomName(''));
		}
		dispatch(setMode(''));
	}

	return (
		<div className={timerId ? "hidden head" : "head"}>
			<div className="right_section">
				<Link to={indexPath} className='title' onClick={onHeaderLinkClick}><FontAwesomeIcon icon={faKeyboard} className='icon' /><h1>keytyper</h1></Link>
				<div className={showButtons ? "buttons" : "hidden buttons"}>
					{Object.entries(options).map(([option, choices]) => (
						<div key={option} className={`option ${option}`}>
							{option === 'time'
								? "время"
								: option === "theme"
									? "тема"
									: "язык"}:
							<select
								className={`option__select ${option}`}
								value={option === 'time'
									? timeLimit
									: option === 'theme'
										? theme
										: lang}
								onChange={(e) => handleOptions(e)}>
								{choices.map((choice) => (
									<option
										className="head__btn"
										key={choice}
										data-option={option}
										value={choice}>
										{choice}
									</option>
								))}
							</select>
							{option === "lang" ? '' : <div className="option__sep" />}
						</div>
					))}
				</div>
				<div className={showButtons ? "hidden advice" : "advice"}>
					Нажмите <div className="advice__button">Ctrl</div> + <div className="advice__button">E</div> , чтобы открыть панель управления.
				</div>
			</div>
			{mode === "room" ? '' : showLogoutButton ?
				<div className="userspace">
					<button className="login_link" onClick={Logout}>
						<FontAwesomeIcon icon={faArrowLeft} className="login_link__icon" />
						<div className="login_link__text">Выйти</div>
					</button>
					<Link to={`${indexPath}/dashboard`} className="userspace__user">
						<div className="userspace__user__name">{name}</div>
						<div className="userspace__user__icon"><FontAwesomeIcon icon={faUser} className="userspace__default" /></div>
					</Link>
				</div>
				: <Link to={`${indexPath}/login`} className="login_link">
					<FontAwesomeIcon icon={faRightToBracket} className="login_link__icon" />
					<div className="login_link__text">Войти</div>
				</Link>
			}
		</div>
	);
}
