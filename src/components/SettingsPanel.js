import "../styles/SettingsPanel.scss";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setTheme, setFont, setTime, setLang, setShowSettings } from '../store/actions';
import { useSelector, useDispatch } from 'react-redux';

export default function SettingsPanel() {
	const {
		preferences: { timeLimit, theme, lang, font },
	} = useSelector((state) => state);

	const dispatch = useDispatch();

	const options = {
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
			"mellow",
		],
		lang: ["eng", "eng_hard", "rus", "rus_hard"],
		font: ["mononoki", "roboto_mono", "jetbrains_mono", "ubuntu_mono"],
	};

	const handleCloseClick = (e) => {
		dispatch(setShowSettings(false));
		e.preventDefault();
	}

	return <>
		<div className="settings_panel" onClick={handleCloseClick}>
			<div className="settings_panel__container" onClick={(e) => e.stopPropagation()} >
				<div className="settings_panel__container__header">
					<div className="settings_panel__container__header__title">Настройки</div>
					<button className="settings_panel__container__header__closebtn" onClick={handleCloseClick}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
				<div className="settings_panel__container__section">
					<div className="settings_panel__container__section__title">Тема</div>
					<div className="settings_panel__container__section__content">
						{options.theme.map((el, idx) => {
							return <>
								<div
									className={theme === el ? "settings_panel__container__section__content__el active" : "settings_panel__container__section__content__el"}
									key={el + idx}
									onClick={() => dispatch(setTheme(el))}
								>
									{el}
								</div>
							</>
						})}
					</div>
				</div>
				<div className="settings_panel__container__section">
					<div className="settings_panel__container__section__title">Шрифт</div>
					<div className="settings_panel__container__section__content">
						{options.font.map((el, idx) => {
							return <>
								<div
									className={font === el ? "settings_panel__container__section__content__el active" : "settings_panel__container__section__content__el"}
									key={el + idx}
									onClick={() => {
										dispatch(setFont(el))
										document.body.children[1].classList.remove(...options.font);
										document.body.children[1].classList.add(el);
										localStorage.setItem("font", el);
									}}
								>
									{el}
								</div>
							</>
						})}
					</div>
				</div>
				<div className="settings_panel__container__section">
					<div className="settings_panel__container__section__title">Время <div className="add">(работает только в тренировке)</div></div>
					<div className="settings_panel__container__section__content">
						{options.time.map((el, idx) => {
							return <>
								<div
									className={timeLimit === el ? "settings_panel__container__section__content__el active" : "settings_panel__container__section__content__el"}
									key={el + idx}
									onClick={() => dispatch(setTime(el))}
								>
									{el}
								</div>
							</>
						})}
					</div>
				</div>
				<div className="settings_panel__container__section">
					<div className="settings_panel__container__section__title">Язык <div className="add">(работает только в тренировке)</div></div>
					<div className="settings_panel__container__section__content">
						{options.lang.map((el, idx) => {
							return <>
								<div
									className={lang === el ? "settings_panel__container__section__content__el active" : "settings_panel__container__section__content__el"}
									key={el + idx}
									onClick={() => dispatch(setLang(el))}
								>
									{el}
								</div>
							</>
						})}
					</div>
				</div>
			</div>
		</div>
	</>
}
