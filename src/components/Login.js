import "../styles/Login.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { indexPath } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, setUserName, setUserRefreshToken } from "../store/actions";

export default function Login() {
    
    const dispatch = useDispatch();
    
    axios.defaults.withCredentials = true;

    // some vars for login fields  
    const [ loginI, setLoginI ] = useState('');
    const [ passI, setPassI ] = useState('');
    const [ msgI, setMsgI ] = useState('');

    // same vars but for register fields (i'm not gonna separate this pages)
    const [ nameU, setNameU ] = useState('');
    const [ loginU, setLoginU ] = useState('');
    const [ passU, setPassU ] = useState('');
    const [ confPassU, setConfPassU ] = useState('');
    const [ msgU, setMsgU ] = useState('');
    
    const navigate = useNavigate();
    
    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', {
              name: nameU,
              login: loginU,
              pass: passU,
              confPass: confPassU  
            });
            navigate(`${indexPath}/`)
        } catch (error) {
            if (error.response) {
                setMsgU(error.response.data.msg);
                console.log(msgU);
            }
        }
    }
    
    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/login', {
                login: loginI,
                pass: passI
            }).then((res) => {
                localStorage.setItem('refreshToken', res.data.refreshToken);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('username', res.data.name);
                dispatch(setUserRefreshToken(res.data.refreshToken));
                dispatch(setUserId(res.data.userId));
                dispatch(setUserName(res.data.name));
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
                <input onChange={(e) => setPassU(e.target.value)} className="login__input" type="password" placeholder="Введите свой пароль" />
                <input onChange={(e) => setConfPassU(e.target.value)} className="login__input" type="password" placeholder="Введите свой пароль повторно" />
                <input type="submit" className="login__btn" value="Submit" />
            </form>
            
            <form className="login__cont" onSubmit={Auth}>
                <div className="login__header">Вход</div>
                <input onChange={(e) => setLoginI(e.target.value)} className="login__input" type="text" placeholder="Введите свой логин" />
                <input onChange={(e) => setPassI(e.target.value)} className="login__input" type="password" placeholder="Введите свой пароль" />
                <button className="login__btn">Submit</button>
            </form>
        </div>
    );
}