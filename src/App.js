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
import Cmd from './components/Cmd';
import { faArrowLeft, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";
import RouteTraining from "./components/RouteTesting";

function App() {
	const [ showCmd, setShowCmd ] = useState(false);
	const {
        time: { timerId, timer },
        word: { currWord, typedWord, activeWordRef },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && e.key === "e") {
				setShowCmd((s) => !s);
				e.preventDefault();
			} 
        };
		return () => {
			document.onkeydown = null;
		};
	}, [dispatch]);

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
                        <div className="link_row">
                            <div className="link_row__title">Класс:</div>
                            <div className="link_row__links">
                                <Link className="route_link gridded" to={`${indexPath}/classroom`}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Link>
                                <Link className="route_link gridded" to={`${indexPath}/classroom`}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        </div>
                    </div>
                }/>
                <Route path={`${indexPath}/training`} element={<RouteTraining setShowCmd={setShowCmd}/>}/>
                <Route path={`${indexPath}/education`} element={<Education setShowCmd={setShowCmd}/>}/>
                <Route path={`${indexPath}/classroom`} element={<Education setShowCmd={setShowCmd}/>}/>
                <Route index element={<Navigate to="/10v/skripko/keytyper" />}/>
            </Routes>

			<Footer />
		</div>
    </Router>
	);
}

const Education = (props) => {
	const {
        time: { timerId, timer },
        word: { currWord, typedWord, activeWordRef },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && e.key === "e") {
				props.setShowCmd((s) => !s);
				e.preventDefault();
			} 
        };
		return () => {
			document.onkeydown = null;
		};
	}, [dispatch]);
    
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
