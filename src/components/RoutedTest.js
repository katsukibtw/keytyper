import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import RoutedWrapper from './RoutedWrapper';
import Results from './Results';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerId } from "../store/actions";
import { recordTest } from "../actions/recordTest";

export default function RoutedTest(props) { 
    const setShowCmd = props.setShowCmd;

	const {
        time: { timerId, timer },
        levelWord: { currLevelWord, typedLevelWord, activeLevelWordRef },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
				setShowCmd((s) => !s);
				e.preventDefault();
			} else if (
                e.key.length === 1 ||
                e.key === "Backspace" ||
                e.key === "Tab"
            ) {
                recordTest(e.key, e.ctrlKey);
                e.preventDefault();
            }
		};
		return () => {
			document.onkeydown = null;
		};
	}, [dispatch, setShowCmd]);
	
	useEffect(() => {
        let idx = typedLevelWord.length - 1;
        const currLevelWordEl = activeLevelWordRef?.current;
        if (currLevelWordEl) {
            currLevelWordEl.children[idx + 1].classList.add(
                currLevelWord[idx] !== typedLevelWord[idx] ? "wrong" : "right"
            );
        }
    }, [currLevelWord, typedLevelWord, activeLevelWordRef]);

    useEffect(() => {
        let idx = typedLevelWord.length;
        const currLevelWordEl = activeLevelWordRef?.current;
        if (currLevelWordEl && idx < currLevelWord.length)
            currLevelWordEl.children[idx + 1].classList.remove("wrong", "right");
    }, [currLevelWord.length, typedLevelWord, activeLevelWordRef]);

    useEffect(() => {
        if (!timer && timerId) {
            clearInterval(timerId);
            dispatch(setTimerId(null));
        }
    }, [dispatch, timer, timerId]);

    return (
        <div className="route_training">
            {timer ? <RoutedWrapper /> : <Results />}
        </div>
    );
}
