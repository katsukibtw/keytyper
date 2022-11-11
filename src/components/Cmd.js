import '../styles/Cmd.scss';
import { useState, useEffect } from 'react';

export default function Cmd(props) {
	const [ cmdText, setCmdText ] = useState('');
	
	useEffect(() => {
		document.onclick = () => {
			props.setShowCmd((s) => !s);
		};
		return () => {
			document.onclick = null;
		};
	}, [props]);

	// useEffect(() => {
		// document.onkeydown = (e) => {
			// if (e.key === "Escape") {
				// props.setShowCmd((s) => !s);
			// }
		// };
		// return () => {
			// document.onkeydown = null;
		// };
	// }, [props]);

	return (
		<div className="cmd_container">
			<input
				className='command_input'
				placeholder='Input text here'
				autoFocus
				onChange={(e) => setCmdText(e.target.value)}
			/>
			<div className='command'>defaultshit</div>
		</div>
	);
}
