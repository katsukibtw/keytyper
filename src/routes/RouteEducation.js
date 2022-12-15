import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import '../styles/Education.scss';
import { indexPath } from "../App";
import { useEffect } from "react";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";
import { 
    Link, 
    Outlet,
    useNavigate
} from "react-router-dom";
import { setLevel, setLevelWordList } from "../store/actions";
import { useDispatch } from 'react-redux';

export default function RouteEducation(props) {
	useEffect(() => {
		document.onkeydown = (e) => {
			if (e.ctrlKey && (e.key === "e" || e.key === "у")) {
				props.setShowCmd((s) => !s);
				e.preventDefault();
			} 
        };
		return () => {
			document.onkeydown = null;
		};
	});
    
    return (
        <div className="edu_cont">
            <Outlet />
        </div>
    );
}

export const LevelList = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLevelSelection = (level) => {
        dispatch(setLevel(level));
        import(`../edu_levels/${level}.json`).then((words) => 
            dispatch(setLevelWordList(words.default))
        );
        navigate("test");
    }

    return (
            <div className="level_list">
                {levelList.map((entry, idx) => {
                    return (
                        <div
                            to="test"
                            className="level_list__entry" 
                            onClick={() => handleLevelSelection(entry.filename)}
                            key={entry + idx}>
                        {entry.name}
                        </div>
                    );
                })}
                <Link className="exit_btn" to={indexPath}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                </Link>
            </div>
    );
}
