import '../styles/Rooms.scss';
import { useRef, useEffect, useState } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { setRoomSafecode, setRoomName, setRoomUsername } from '../store/actions';
import { useNavigate } from 'react-router-dom';
import { indexPath } from '../App';

const CreateRoom = ({ socket }) => {

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const roomNameRef = useRef();
	const nicknameRef = useRef();

	const [msg, setMsg] = useState('');

	const onFormSubmit = () => {
		if (roomNameRef?.current.value === '') {
			setMsg('Введите название комнаты');
		} else if (nicknameRef?.current.value === '') {
			setMsg('Введите своё имя');
		} else {
			socket.emit('create-room', {
				room_name: roomNameRef.current.value,
				admin_name: nicknameRef.current.value,
			});
		}
	}

	useEffect(() => {
		socket.on('room created', ({ safe_code }) => {
			dispatch(setRoomSafecode(safe_code)); dispatch(setRoomName(roomNameRef?.current.value)); dispatch(setRoomUsername(nicknameRef?.current.value));
			navigate(`${indexPath}/room`);
		});
		socket.on('room exists', () => setMsg('Комната с таким названием уже существует'));
		socket.on('connect', () => console.log('connect'));
	})

	return (
		<div className="create_room">
			<div className="create_room__header">Создание комнаты</div>
			<div className="create_room__form">
				<input type='text' ref={roomNameRef} className='room_input' placeholder='Введите название комнаты' />
				<input type='text' ref={nicknameRef} className='room_input' placeholder='Введите своё имя' />
				{msg && <div className="create_room__form__msg">{msg}</div>}
				<button type='submit' className="create_room__form__btn" onClick={onFormSubmit}>
					<FontAwesomeIcon icon={faArrowRight} />
				</button>
			</div>
		</div>
	);
}

export default CreateRoom;
