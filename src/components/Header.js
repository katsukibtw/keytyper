import React from 'react';
import '../styles/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'

export default function Header() {
	return (
		<div className='head'>
			<div className='title'><FontAwesomeIcon icon={faKeyboard} className='icon' /><h1>keytyper</h1></div>
		</div>
	);
}
