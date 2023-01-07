import "../styles/Login.scss";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { indexPath } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, setUserName, setUserRefreshToken, addComplLevel } from "../store/actions";
import { useCookies } from 'react-cookie';

export default function Login() {
	const dispatch = useDispatch();

	const [cookies, setCookie] = useCookies(['refreshToken']);

	// refs for login fields
	const loginI = useRef();
	const passI = useRef();
	const [msgI, setMsgI] = useState('');

	// refs for sing up fields
	const nameU = useRef();
	const loginU = useRef();
	const passU = useRef();
	const confPassU = useRef();
	const [msgU, setMsgU] = useState('');

	const navigate = useNavigate();

	const Register = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://94.181.190.26:9967/api/users', {
				name: nameU.current.value,
				login: loginU.current.value,
				pass: passU.current.value,
				confPass: confPassU.current.value,
				withCredentials: true,
			});
			navigate(`${indexPath}/`)
		} catch (error) {
			if (error.response) {
				setMsgU(error.response.data.msg);
				console.log(msgU);
			}
		}
	}

	const getUserStats = async (id) => {
		try {
			await axios.get('http://94.181.190.26:9967/api/stats', {
				headers: {
					user_id: id
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

	const Auth = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://94.181.190.26:9967/api/login', {
				login: loginI.current.value,
				pass: passI.current.value,
				withCredentials: true,
			}).then((res) => {
				localStorage.setItem('refreshToken', res.data.refreshToken);
				localStorage.setItem('userId', res.data.userId); localStorage.setItem('username', res.data.name);
				dispatch(setUserRefreshToken(res.data.refreshToken));
				dispatch(setUserId(res.data.userId));
				dispatch(setUserName(res.data.name));
				getUserStats(res.data.userId);
				setCookie('refreshToken', res.data.refreshToken, {
					httpOnly: false,
					sameSite: 'strict',
					secure: false,
					path: '/',
					maxAge: 1000 * 60 * 60 * 24
				});
			});
			navigate(`${indexPath}/education`)
		} catch (error) {
			if (error.response) {
				setMsgI(error.response.data.msg);
			}
		}
	}

	// className rb sets red border and color on input field if msg is not empty

	return (
		<div className="login">
			<form className="login__cont" onSubmit={Register}>
				<div className="login__header">Регистрация</div>
				<input ref={nameU} className={msgU ? "rb login__input" : "login__input"} type="text" placeholder="Введите свой ник" />
				<input ref={loginU} className={msgU ? "rb login__input" : "login__input"} type="text" placeholder="Введите свой логин" />
				<input ref={passU} title="Пароль должен содержать строчные и заглавные символы латиницы и цифры" pattern="[A-Za-z0-9._+-@|\/\\]{8,}" className={msgU ? "rb login__input" : "login__input"} type="password" placeholder="Введите свой пароль" />
				<input ref={confPassU} title="Пароль должен содержать строчные и заглавные символы латиницы и цифры" pattern="[A-Za-z0-9._+-@|\/\\]{8,}" className={msgU ? "rb login__input" : "login__input"} type="password" placeholder="Введите свой пароль повторно" />
				<div className="login__msg">{msgU}</div>
				<button type="submit" className="login__btn">Зарегистрироваться</button>
			</form>

			<form className="login__cont" onSubmit={Auth}>
				<div className="login__header">Вход</div>
				<input ref={loginI} className={msgI ? "rb login__input" : "login__input"} type="text" placeholder="Введите свой логин" />
				<input ref={passI} className={msgI ? "rb login__input" : "login__input"} type="password" placeholder="Введите свой пароль" />
				<div className="login__msg">{msgI}</div>
				<button type="submit" className="login__btn">Войти</button>
			</form>
		</div >
	);
}
