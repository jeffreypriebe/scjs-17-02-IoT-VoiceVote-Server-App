import uuid from 'uuid';
import { MESSAGE_ACTIONS } from '../../actions';

export default function messages (state = { messages: [] }, action) {
	switch(action.type) {
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
	newMessages.splice(0, 0, {
		_id: uuid.v4(),
		text: newMessage,
		createdAt: new Date(),
		user: {
			_id: 1,
			name: 'JP',
		}
	});
	return newMessages;
}