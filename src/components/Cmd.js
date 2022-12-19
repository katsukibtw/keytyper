import { useEffect, useState, useRef } from "react";
// import { options } from "./Header";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { indexPath } from "../App";
import { setTime, setTheme, setLang, setFont } from "../store/actions";
import styles from "../styles/Cmd.module.scss";

export default function Cmd(props) {
	const [ cmdText, setCmdText ] = useState('');
    const [selectedOption, setSelectedOption] = useState("");
    const [highlightedOption, setHighlightedOption] = useState(0);
    const [commandList, setCommandList] = useState([]);
    const dispatch = useDispatch();
    const cmdTextBox = useRef(null);
    const location = useLocation();

	var options = {};

    useEffect(() => {
        if (location.pathname !== indexPath + "/education/test") {
            options = {
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
		        font: ["mononoki", "roboto_mono", "jetbrains_mono", "ubuntu_mono"],
	        };
        } else {
            options = {
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
		        font: ["mononoki", "roboto_mono", "jetbrains_mono", "ubuntu_mono"],
	        };
        }
    });

	useEffect(() => {
		document.onclick = () => {
			props.setShowCmd((s) => !s);
		};
		return () => {
			document.onclick = null;
		};
	}, [props]);
	
	useEffect(() => {
        if (!selectedOption) {
            setCommandList(
                Object.keys(options).filter((option) =>
                    option.includes(cmdText.toLowerCase())
                )
            );
        } else {
            const commands = options[
                selectedOption
            ].map((o) => o.toString());
            setCommandList(
                commands.filter((option) =>
                    option.includes(cmdText.toLowerCase())
                )
            );
        }
        setHighlightedOption(0);
    }, [cmdText, selectedOption]);

    const handleCommandSelection = (command) => {
        setCmdText("");
        if (!command) return;
        if (!selectedOption) {
            setSelectedOption(command);
            return;
        }
        switch (selectedOption) {
            case "time":
                dispatch(setTime(+command));
                break;
            case "theme":
                dispatch(setTheme(command));
                break;
            case "lang":
                dispatch(setLang(command));
                break;
			case "font":
				dispatch(setFont(command));
				document.body.children[1].classList.remove(...options.font);
				document.body.children[1].classList.add(command);
				localStorage.setItem("font", command);
				break;
            default:
                console.log(selectedOption, command);
        }
        props.setShowCmd(false);
    };

    const handlePalletKeys = (e) => {
        if (e.key === "ArrowUp") {
            setHighlightedOption((op) => (op > 0 ? op - 1 : op));
        } else if (e.key === "ArrowDown") {
            setHighlightedOption((op) =>
                op < commandList.length - 1 ? op + 1 : op
            );
        } else if (e.key === "Enter") {
            const command = commandList[highlightedOption];
            handleCommandSelection(command);
        } else if (e.key === "Escape") {
            props.setShowCmd(false);
        }
        e.stopPropagation();
    };

	return (
		<div className={styles.cmd}>
			<div
				className={styles.cmd_container}
				onKeyDown={handlePalletKeys}
				onClick={(e) => e.stopPropagation()}>
				<input
					ref={cmdTextBox}
					type="text"
					className={styles.command_input}
					placeholder="Type to search"
					value={cmdText}
					autoFocus
					onChange={(e) => setCmdText(e.target.value)}
				/>
				<div className={styles.command_list}>
					{commandList.map((option, idx) => (
						<div
							className={`${styles.command} ${
								highlightedOption === idx && styles.highlighted
							}`}
							key={idx}
							onClick={() => handleCommandSelection(option)}>
							{option}
						</div>
					))}
				</div>
			</div>	
		</div>
	);
}
