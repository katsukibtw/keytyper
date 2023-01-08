import { useDispatch } from 'react-redux';
import { setRoomSafecode, setRoomName, setRoomUsername, setRoomUserId, setRoomId } from '../store/actions';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { indexPath } from '../App';

const JoinRoom = ({ socket }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const roomCodeRef = useRef();
	const nicknameRef = useRef();

	const [msg, setMsg] = useState('');
	const [roomCode, setRoomCode] = useState('');

	const onFormSumbit = () => {
		if (roomCodeRef?.current.value && !nicknameRef?.current) {
			socket.emit('check if room exists', { safe_code: roomCodeRef?.current.value });
		} else if (!roomCodeRef?.current.value) {
			setMsg('Введите секретный код комнаты');
		}

		if (roomCode && !nicknameRef?.current.value) {
			setMsg('Введите своё имя');
		} else if (roomCode && nicknameRef?.current.value) {
			socket.emit('join', { safe_code: roomCode, username: nicknameRef?.current.value });
		}
	}

	useEffect(() => {
		socket.on('room not exist', () => setMsg('Комнаты с таким кодом не существует'));
		socket.on('room exists', ({ safe_code }) => setRoomCode(safe_code));
		socket.on('joined', ({ room_name, safe_code, username, room_id }) => {
			dispatch(setRoomName(room_name));
			dispatch(setRoomSafecode(safe_code));
			dispatch(setRoomUsername(username));
			dispatch(setRoomId(room_id));
			localStorage.setItem('room_safecode', safe_code);
			localStorage.setItem('room_username', username);
			localStorage.setItem('room_name', room_name);
			localStorage.setItem('room_id', room_id);
			socket.emit('get user db id', ({ room: room_name, username: username }));
		});
		socket.on('userDBId', ({ user_id }) => {
			dispatch(setRoomUserId(user_id));
			localStorage.setItem('room_userid', user_id);
			navigate(`${indexPath}/room`);
		})
	})

	return (
		<div className="join_room">
			<div className="join_room__header">Вход в комнату</div>
			<div className="join_room__form">
				<input className="join_room__form__input" type='text' ref={roomCodeRef} placeholder="Введите секретный код комнаты" />
				{roomCode &&
					<input className="join_room__form__input" type='text' ref={nicknameRef} placeholder="Введите своё имя" />
				}
				{msg && <div className="join_room__form__msg">{msg}</div>}
				<button className="join_room__form__btn" onClick={onFormSumbit}>{roomCode ? "Войти" : "Далее"}</button>
			</div>
		</div>
	)
}

export default JoinRoom;
