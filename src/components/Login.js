import "../styles/Login.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { indexPath } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, setUserName, setUserRefreshToken, addComplLevel } from "../store/actions";
import { useCookies } from 'react-cookie';

export default function Login() {
	const dispatch = useDispatch();

	const [cookies, setCookie] = useCookies(['refreshToken']);

	// some vars for login fields  
	const [loginI, setLoginI] = useState('');
	const [passI, setPassI] = useState('');
	const [msgI, setMsgI] = useState('');

	// same vars but for register fields (i'm not gonna separate this pages)
	const [nameU, setNameU] = useState('');
	const [loginU, setLoginU] = useState('');
	const [passU, setPassU] = useState('');
	const [confPassU, setConfPassU] = useState('');
	const [msgU, setMsgU] = useState('');

	const navigate = useNavigate();

	const Register = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://94.181.190.26:9967/api/users', {
				name: nameU,
				login: loginU,
				pass: passU,
				confPass: confPassU,
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
				login: loginI,
				pass: passI,
				withCredentials: true,
			}).then((res) => {
				localStorage.setItem('refreshToken', res.data.refreshToken);
				localStorage.setItem('userId', res.data.userId);
				localStorage.setItem('username', res.data.name);
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
				console.log(msgI);
			}
		}
	}

	return (
		<div className="login">
			<form className="login__cont" onSubmit={Register}>
				<div className="login__header">Регистрация</div>
				<input onChange={(e) => setNameU(e.target.value)} className="login__input" type="text" placeholder="Введите свой ник" />
				<input onChange={(e) => setLoginU(e.target.value)} className="login__input" type="text" placeholder="Введите свой логин" />
				<input onChange={(e) => setPassU(e.target.value)} title="Пароль должен содержать строчные и заглавные символы латиницы и цифры" pattern="[A-Za-z0-9._+-@|\/\\]{8,}" className="login__input" type="password" placeholder="Введите свой пароль" />
				<input onChange={(e) => setConfPassU(e.target.value)} title="Пароль должен содержать строчные и заглавные символы латиницы и цифры" pattern="[A-Za-z0-9._+-@|\/\\]{8,}" className="login__input" type="password" placeholder="Введите свой пароль повторно" />
				<div className="login__msg">{msgU}</div>
				<input type="submit" className="login__btn" value="Submit" />
			</form>

			<form className="login__cont" onSubmit={Auth}>
				<div className="login__header">Вход</div>
				<input onChange={(e) => setLoginI(e.target.value)} className="login__input" type="text" placeholder="Введите свой логин" />
				<input onChange={(e) => setPassI(e.target.value)} className="login__input" type="password" placeholder="Введите свой пароль" />
				<div className="login__msg">{msgI}</div>
				<button className="login__btn">Submit</button>
			</form>
		</div>
	);
}
