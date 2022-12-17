import "../styles/Login.scss";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [ formData, setFormData ] = useState({
        login: '',
        password: ''
    });

    return (
        <div className="login">
            <div className="login__cont">
                <div className="login__header">Регистрация</div>
                <input className="login__input" type="text" placeholder="Введите свой логин" />
                <input className="login__input" type="password" placeholder="Введите свой пароль" />
                <input className="login__input" type="password" placeholder="Введите свой пароль повторно" />
                <button className="login__btn">ОК</button>
            </div>
            
            <form className="login__cont">
                <div className="login__header">Вход</div>
                <input className="login__input" onChange={(e) => setFormData({ ...formData, login: e.target.value })} type="text" placeholder="Введите свой логин" />
                <input className="login__input" onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" placeholder="Введите свой пароль" />
                <button className="login__btn">Submit</button>
            </form>
        </div>
    );
}