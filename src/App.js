import './styles/App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import TestWrapper from './components/TestWrapper';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cmd from './components/Cmd';

function App() {

	const [ showCmd, setShowCmd ] = useState(false);
	// const dispatch = useDispatch();

	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && e.key === "k") {
				setShowCmd((s) => !s);
				e.preventDefault();
			}
		};
		return () => {
			document.onkeydown = null;
		};
	}, []);

	return (
		<div className="App tokyonight">
			<Header />
			{showCmd && <Cmd setShowCmd={setShowCmd}/>}
			<TestWrapper />
			<Footer />
		</div>
	);
}

export default App;
