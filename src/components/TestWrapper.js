import React from 'react';
import '../styles/TestWrapper.scss';
import rus from '../langs/rus.json';

export default function TestWrapper() {
	const wordList = rus['words'];	
	return (
		<div className="test">
			<div className="timer">there's supposed to be a timer</div>
			<div className="wrapper">
				<span id="caret" className='blink'>|</span>
				{wordList.sort(() => (Math.random() > .5) ? 1 : -1).map((word, idx) => {
					return (
						<div className="word" key={word + idx}>
							{word.split("").map((char, charId) => {
								return <span className="char" key={char + charId}>{char}</span>;
							})}
						</div>
					);
				})}
			</div>
			<button className="restart_btn">Restart</button>
		</div>
	);
}
