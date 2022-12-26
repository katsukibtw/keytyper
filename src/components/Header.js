import '../styles/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faUser } from '@fortawesome/free-regular-svg-icons';
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
	setComplLevel
} from "../store/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { indexPath } from "../App";
import { Link } from 'react-router-dom';
import axios from 'axios';

export const options = {
	time: [15, 30, 45, 60, 120],
	theme: [
		"tokyonight",
		"clear",
		"catppuccin",
		"gruvbox",
		"gruvbox_light",
		"nord",
		"nord_light",
		"everforest",
	],
	lang: ["eng", "eng_hard", "rus", "rus_hard"],
};

export default function Header() {
	let location = useLocation();
	const navigate = useNavigate();
	const [showButtons, setShowButtons] = useState(false);

	const {
		preferences: { timeLimit, theme, lang, font },
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
			document.querySelector(".theme")?.childNodes.forEach((el) => {
				if (el instanceof HTMLButtonElement)
					el.classList.remove("selected");
			});
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
			document.querySelector(".time")?.childNodes.forEach((el) => {
				if (el instanceof HTMLButtonElement)
					el.classList.remove("selected");
			});
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
			document.querySelector(".lang")?.childNodes.forEach((el) => {
				if (el instanceof HTMLButtonElement)
					el.classList.remove("selected");
			});
			document
				.querySelector(`button[value="${lang}"]`)
				?.classList.add("selected");
			dispatch(setLang(lang));
			localStorage.setItem("lang", lang);
			resetTest();
		}
	}, [dispatch, lang]);

	const handleOptions = ({ target }) => {
		if (target.dataset.option) {
			if (target.value === theme || +target.value === timeLimit) {
				target.blur();
				return;
			}
			switch (target.dataset.option) {
				case "theme":
					setTimeout(() => {
						dispatch(setTheme(target.value));
					}, 750);
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
			await axios.delete('http://94.181.190.26:9967/api/logout');
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

	return (
		<div className={timerId ? "hidden head" : "head"}>
			<div className="right_section">
				<Link to={`${indexPath}`} className='title'><FontAwesomeIcon icon={faKeyboard} className='icon' /><h1>keytyper</h1></Link>
				<div className={showButtons ? "buttons" : "hidden buttons"}>
					{Object.entries(options).map(([option, choices]) => (
						<div key={option} className={option}>
							{option}:
							{choices.map((choice) => (
								<button
									className="head__btn"
									key={choice}
									data-option={option}
									value={choice}
									onClick={(e) => handleOptions(e)}>
									{choice}
								</button>
							))}
						</div>
					))}
				</div>
				<div className={showButtons ? "hidden advice" : "advice"}>
					Нажмите <div className="advice__button">Ctrl</div> + <div className="advice__button">E</div> , чтобы открыть панель управления.
				</div>
			</div>
			{showLogoutButton ?
				<div className="userspace">
					<button className="login_link" onClick={Logout}>Выйти</button>
					<Link to={`${indexPath}/dashboard`} className="userspace__user">
						<div className="userspace__user__name">{name}</div>
						<div className="userspace__user__icon"><FontAwesomeIcon icon={faUser} className="userspace__default" /></div>
					</Link>
				</div>
				: <Link to={`${indexPath}/login`} className="login_link">Войти</Link>
			}
		</div>
	);
}
