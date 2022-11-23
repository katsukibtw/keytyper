import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import '../styles/Education.scss';
import { indexPath } from "../App";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";

export default function RouteEducation(props) {
    
    useEffect(() => {
        console.log(levelList);
    });
    
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
    
    const handleLevelSelection = (level) => {
        console.log(level);
    }
    
    return (
        <div className="dummydiv">
            <div className="level_list">
                {levelList.map((entry, idx) => {
                    return (
                        <div 
                            className="level_list__entry" 
                            key={entry + idx}
                            onClick={() => handleLevelSelection(entry.filename)}>
                        {entry.name}
                        </div>
                    );
                })}
            </div>
            <Link className="exit_btn" to={indexPath}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
            </Link>
        </div>
    );
}