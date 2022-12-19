import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import TestWrapper from '../components/TestWrapper';
import Results from '../components/Results';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerId } from "../store/actions";
import { recordTest } from "../actions/recordTest";

export default function RouteTesting(props) { 
    const setShowCmd = props.setShowCmd;
    // const level = useLocation().state.level || "";
    
    // useEffect(() => {
        // if (level) {
            // console.log(level);
        // }
    // });

	const {
        time: { timerId, timer },
        word: { currWord, typedWord, activeWordRef },
    } = useSelector((state) => state);
    const dispatch = useDispatch();


    const onKeyDown = (e) => {
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
        return null;
	};
	
	useEffect(() => {
        let idx = typedWord.length - 1;
        const currWordEl = activeWordRef?.current;
        if (currWordEl) {
            currWordEl.children[idx + 1].classList.add(
                currWord[idx] !== typedWord[idx] ? "wrong" : "right"
            );
        }
    }, [currWord, typedWord, activeWordRef]);

    useEffect(() => {
        let idx = typedWord.length;
        const currWordEl = activeWordRef?.current;
        if (currWordEl && idx < currWord.length)
            currWordEl.children[idx + 1].classList.remove("wrong", "right");
    }, [currWord.length, typedWord, activeWordRef]);

    useEffect(() => {
        if (!timer && timerId) {
            clearInterval(timerId);
            dispatch(setTimerId(null));
        }
    }, [dispatch, timer, timerId]);

    return (
        <div 
            className="route_training"
            onKeyDown={onKeyDown}
            tabIndex="0">
            {timer ? <TestWrapper /> : <Results />}
        </div>
    );
}