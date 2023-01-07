import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import RoomWrapper from './RoomWrapper';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerId, incRoomErrorCount } from "../store/actions";
import { recordRoom } from '../actions/recordRoom';
import RoomResults from './RoomResults';
import React, { Suspense } from "react";

export default function RoomTest(props) {
	const setShowCmd = props.setShowCmd;
	const divRef = useRef(null);

	const {
		time: { timerId, timer },
		roomWord: { currRoomWord, typedRoomWord, activeRoomWordRef },
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
			recordRoom(e.key, e.ctrlKey);
			e.preventDefault();
		}
		return null;
	};

	useEffect(() => {
		let idx = typedRoomWord.length - 1;
		const currRoomWordEl = activeRoomWordRef?.current;
		if (currRoomWordEl) {
			currRoomWordEl.children[idx + 1].classList.add(
				currRoomWord[idx] !== typedRoomWord[idx] ? "wrong" : "right"
			);
			if (currRoomWord[idx] !== typedRoomWord[idx]) dispatch(incRoomErrorCount());
		}
	}, [currRoomWord, typedRoomWord, activeRoomWordRef]);

	useEffect(() => {
		let idx = typedRoomWord.length;
		const currRoomWordEl = activeRoomWordRef?.current;
		if (currRoomWordEl && idx < currRoomWord.length)
			currRoomWordEl.children[idx + 1].classList.remove("wrong", "right");
	}, [currRoomWord.length, typedRoomWord, activeRoomWordRef]);

	useEffect(() => {
		if (!timer && timerId) {
			clearInterval(timerId);
			dispatch(setTimerId(null));
		}
	}, [dispatch, timer, timerId]);

	useEffect(() => {
		divRef.current.focus();
	});

	return (
		<div
			className="route_training"
			ref={divRef}
			onKeyDown={onKeyDown}
			tabIndex="0">
			<Suspense fallback={"Loading..."}>
				{timer ? <RoomWrapper /> : <RoomResults />}
			</Suspense>
		</div>
	);
}
