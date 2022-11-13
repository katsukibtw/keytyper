import '../styles/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import { resetTest } from "../actions/resetTest";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setTheme,
    setTime,
    setLang,
    setWordList,
    timerSet,
} from "../store/actions";
import { State } from "../store/reduce";

export const options = {
    time: [15, 30, 45, 60, 120],
    theme: [
        "default",
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

	const {
        preferences: { timeLimit, theme, lang },
        time: { timerId },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        const theme = localStorage.getItem("theme") || "default";
        const lang = localStorage.getItem("lang") || "words";
        const time = parseInt(localStorage.getItem("time") || "60", 10);
        import(`../langs/${lang}.json`).then((words) =>
            dispatch(setWordList(words.default))
        );
        dispatch(timerSet(time));
        dispatch(setLang(lang));
        dispatch(setTime(time));
        dispatch(setTheme(theme));
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
            localStorage.setItem("theme", theme);
        }
    }, [dispatch, theme]);

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

	return (
		<div className={timerId ? "hidden head" : "head"}>
			<div className='title'><FontAwesomeIcon icon={faKeyboard} className='icon' /><h1>keytyper</h1></div>
			<div className="buttons">
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
		</div>
	);
}
