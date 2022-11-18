import './styles/App.scss';
import './styles/themes.scss';
import './styles/fonts.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import TestWrapper from './components/TestWrapper';
import Results from './components/Results';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "./store/reduce";
import { setTimerId } from "./store/actions";
import { recordTest } from "./actions/recordTest";
import Cmd from './components/Cmd';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

function App() {

	const [ showCmd, setShowCmd ] = useState(false);
	const {
        time: { timerId, timer },
        word: { currWord, typedWord, activeWordRef },
    } = useSelector((state) => state);
    const dispatch = useDispatch();


	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && e.key === "k") {
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
		};
		return () => {
			document.onkeydown = null;
		};
	}, [dispatch]);
	
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
    <Router> 
		<div className="App">
			<Header />
			{showCmd && <Cmd setShowCmd={setShowCmd}/>}

            <Routes>
                <Route path={indexPath} element={
                    <div className="index_links">
                        <Link className="route_link" to={`${indexPath}/training`}>Быстрая тренировка</Link>
                        <Link className="route_link" to={`${indexPath}/education`}>Программа обучения</Link>
                        <Link className="route_link" to={`${indexPath}/classroom`}>Класс</Link>
                    </div>
                }/>
                <Route path={`${indexPath}/training`} element={<Training timer={timer}/>}/>
                <Route path={`${indexPath}/education`} element={<Education />}/>
                <Route path={`${indexPath}/classroom`} element={<Education />}/>
            </Routes>

			<Footer />
		</div>
    </Router>
	);
}

const Training = ({timer}) => {
    return timer ? <TestWrapper /> : <Results />;
}

const Education = () => {
    return (
        <div className="dummydiv">placeholder
            <Link className="exit_btn" to={indexPath}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
        </div>
    );
}

export const indexPath = "/10v/skripko/keytyper";
export default App;
