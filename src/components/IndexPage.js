import { faArrowLeft, faPlus, faRightToBracket, faMagnifyingGlass, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Link,
	useNavigate,
} from "react-router-dom";
import { setMode } from '../store/actions';
import { useDispatch } from 'react-redux';
import { indexPath } from '../App';
import { useEffect } from 'react';

export default function IndexPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleMovingToMode = (mode) => {
		dispatch(setMode(mode));
	}

	return <>
		<div className="index_links">
			<Link className="route_link" to={`${indexPath}/training`} onClick={() => handleMovingToMode("test")}>
				<FontAwesomeIcon icon={faClock} className="route_link__icon" />
				<div className="route_link__text">Быстрая тренировка</div>
			</Link>
			<Link className="route_link" to={`${indexPath}/education`} onClick={() => handleMovingToMode("edu")}>
				<FontAwesomeIcon icon={faMagnifyingGlass} className="route_link__icon" />
				<div className="route_link__text">Программа обучения</div>
			</Link>
			<div className="link_row">
				<div className="link_row__title">Комнаты:</div>
				<div className="link_row__links">
					<Link className="route_link gridded" to={`${indexPath}/createroom`} onClick={() => handleMovingToMode("room")}>
						<FontAwesomeIcon icon={faPlus} className="route_link__icon" />
						<div className="route_link__text">Создать</div>
					</Link>
					<Link className="route_link gridded" to={`${indexPath}/joinroom`} onClick={() => handleMovingToMode("room")}>
						<FontAwesomeIcon icon={faRightToBracket} />
						<div className="route_link__text">Войти</div>
					</Link>
				</div>
			</div>
		</div>
	</>
}
