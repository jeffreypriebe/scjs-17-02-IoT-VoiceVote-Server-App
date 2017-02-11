import uuid from 'uuid';
import { MESSAGE_ACTIONS } from '../../actions';

export default function messages (state = { messages: [] }, action) {
	switch(action.type) {
		case MESSAGE_ACTIONS.CONNECTED:
			return {
				...state,
				connected: true
			};
		case MESSAGE_ACTIONS.TRANSCRIBED:
			return {
				...state,
				messages: updateMessages(state.messages, action.payload),
			};
		default:
			return state;
	}
}

function updateMessages(currentMessages, newMessage) {
	let newMessages = currentMessages.slice();
	const newMessageFormatted = newMessage.user ? newMessage : {
		text: newMessage,
		user: {
			_id: 1,
			name: 'JP',
		}
	};
	newMessageFormatted._id = uuid.v4();
	newMessageFormatted.createdAt = new Date();
	
	newMessages.splice(0, 0, newMessageFormatted);

	return newMessages;
}