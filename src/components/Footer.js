import React from 'react';
import '../styles/Footer.scss';
import { State } from "../store/reduce";
import { useDispatch, useSelector } from "react-redux";

export default function Footer() {

	const { time: { timerId }, } = useSelector((state) => state);

	return (
		<div className={timerId ? "hidden footer" : "footer"}>
				<a href="https://codeberg.org/katsuki/keytyper" className="link"><div className="icon">{'</>'}</div>Исходный код</a>
		</div>
	);
}
