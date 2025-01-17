import React from 'react';
import '../styles/Footer.scss';
import { useSelector } from "react-redux";

export default function Footer() {

	const { time: { timerId }, } = useSelector((state) => state);

	return (
		<div className={timerId ? "hidden footer" : "footer"}>
				<a id="codeberg" href="https://codeberg.org/katsuki/keytyper" className="link"><div className="icon">{'</>'}</div>Исходный код</a>
				<div className="author">by @katsukibtw</div>
		</div>
	);
}
