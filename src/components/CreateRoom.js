import '../styles/Rooms.scss';
import { useRef, useEffect, useState } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { setRoomSafecode, setRoomName, setRoomUsername, setRoomId, setRoomUserId } from '../store/actions';
import { useNavigate } from 'react-router-dom';
import { indexPath } from '../App';

const CreateRoom = ({ socket }) => {

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const roomNameRef = useRef();
	const nicknameRef = useRef();

	const [msg, setMsg] = useState('');

	const onFormSubmit = (e) => {
		e.preventDefault();
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
		socket.on('room created', ({ safe_code, room_id }) => {
			dispatch(setRoomSafecode(safe_code));
			dispatch(setRoomName(roomNameRef?.current.value));
			dispatch(setRoomUsername(nicknameRef?.current.value));
			dispatch(setRoomId(room_id));
			localStorage.setItem('room_safecode', safe_code);
			localStorage.setItem('room_username', nicknameRef?.current.value);
			localStorage.setItem('room_name', roomNameRef?.current.value);
			localStorage.setItem('room_id', room_id);
			socket.emit('get user db id', ({ room: roomNameRef?.current.value, username: nicknameRef?.current.value }));
		});
		socket.on('room exists', () => setMsg('Комната с таким названием уже существует'));
		socket.on('userDBId', ({ user_id }) => {
			dispatch(setRoomUserId(user_id));
			localStorage.setItem('room_userid', user_id);
			navigate(`${indexPath}/room`);
		})
		socket.on('connect', () => console.log('connect'));
	})

	return (
		<form className="create_room" onSubmit={onFormSubmit}>
			<div className="create_room__header">Создание комнаты</div>
			<div className="create_room__form">
				<input type='text' ref={roomNameRef} className='room_input' placeholder='Введите название комнаты' />
				<input type='text' ref={nicknameRef} className='room_input' placeholder='Введите своё имя' />
				{msg && <div className="create_room__form__msg">{msg}</div>}
				<button type='submit' className="create_room__form__btn">
					<FontAwesomeIcon icon={faArrowRight} />
				</button>
			</div>
		</form>
	);
}

export default CreateRoom;
