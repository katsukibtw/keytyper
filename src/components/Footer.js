import React from 'react';
import '../styles/Footer.scss';
import { State } from "../store/reduce";
import { useDispatch, useSelector } from "react-redux";

export default function Footer() {

	const { time: { timerId }, } = useSelector((state) => state);

	return (
		<div className={timerId ? "hidden footer" : "footer"}>
			footer
		</div>
	);
}
