import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
// import RoutedWrapper from './RoutedWrapper';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLevelWord, setRemainedTime, setTimerId, timerEnd } from "../store/actions";
import { recordLevel } from '../actions/recordLevel';
import RoutedResults from './RoutedResults';
import React, { lazy, Suspense } from "react";

const Wrapper = lazy(() => import('./RoutedWrapper'));

export default function RoutedTest(props) { 
    const setShowCmd = props.setShowCmd;
    const divRef = useRef(null);

	const {
        time: { timerId, timer },
        levelWord: { currLevelWord, typedLevelWord, activeLevelWordRef, levelWordList },
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
            recordLevel(e.key, e.ctrlKey);
            e.preventDefault();
        }
        return null;
	};
	
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
    
    const setDivFocus = () => {
        divRef.current.focus();
    }

    return (
        <div 
            className="route_training"
            onKeyDown={onKeyDown}
            tabIndex="0">
            <Suspense fallback={"Loading..."}>
                {timer ? <Wrapper /> : <RoutedResults />}
            </Suspense>
        </div>
    );
}
