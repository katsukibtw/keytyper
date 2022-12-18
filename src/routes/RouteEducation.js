import '../styles/App.scss';
import '../styles/themes.scss';
import '../styles/fonts.scss';
import '../styles/Education.scss';
import { indexPath } from "../App";
import { useEffect, useState } from "react";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import levelList from "../edu_levels/list.json";
import { 
    Link, 
    Outlet,
    useNavigate
} from "react-router-dom";
import { setLevel, setLevelWordList, setMode, setTime, setUserId, setUserName, setUserRefreshToken } from "../store/actions";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function RouteEducation(props) {
    // some store vars for checking user id
    const {
        user: { refreshToken }
    } = useSelector((state) => state);
    const dispatch = useDispatch();
    
    const [ token, setToken ] = useState('');
    const [ expire, setExpire ] = useState('');
    const [ user, setUser ] = useState([]);
    const [ usrName, setUsrName ] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        refreshTokenFunc();
    })
    
    const refreshTokenFunc = async () => {
        try {
            const resp = await axios.get('http://localhost:5000/api/token', {
                refreshToken: refreshToken
            });
            setToken(resp.data.accessToken);
            dispatch(setUserRefreshToken(resp.data.accessToken));
            localStorage.setItem("refreshToken", refreshToken);
            const decoded = jwtDecode(resp.data.accessToken);
            setUsrName(decoded.name);
            setExpire(decoded.exp);
            dispatch(setUserId(decoded.userId));
            dispatch(setUserName(decoded.name));
        } catch (error) {
            if (error.response) {
                navigate(`${indexPath}/login`);
            }
        }
    }
    
    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/api/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setUsrName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })

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
        dispatch(setTime(30));
        navigate("test");
    }

    return (
            <div className="level_list">
                {levelList.map((entry, idx) => {
                    return (
                        <div className="dumm" key={entry + idx + idx}>
                            <div
                                className="level_list__step_block" 
                                key={entry + idx}>
                                {`Этап ${entry.step}`}
                            </div>
                            <div className="level_list__container" key={entry + idx + idx}>
                                {entry.levels.map((el, id) => {
                                    return (
                                        <div 
                                            className="level_list__entry"
                                            onClick={() => handleLevelSelection(el.filename)}
                                            key={el + id}>
                                                {el.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                <Link className="exit_btn" to={indexPath} onClick={() => dispatch(setMode("init"))}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                </Link>
            </div>
    );
}
