window.navigator.userAgent = 'react-native';
let io = require('socket.io-client'); //no hoisting for you! need that window.nav... (import hoists)

const SERVER = 'https://voicevote.jeffreypriebe.com';

import {
	AudioRecorder,
	AudioUtils
} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob';

export const MESSAGE_ACTIONS = {
	TRANSCRIBED: 'TRANSCRIBED',
	CONNECTED: 'CONNECTED',
};

const AUDIO_PATH = `${AudioUtils.DocumentDirectoryPath}/recording.wav`;

const SPEECH_API_URL = 'https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=AIzaSyCGj_tTEv9scx-5qhbCV4oK6IXiZOI24Fk';

const REQUEST_BASE = {
	config: {
		encoding: 'LINEAR16',
		sampleRate: 16000,
		languageCode: 'en-US',
		maxAlternatives: 1,
		profanityFilter: true
	},
	audio: {},
};
const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

let socket;

export const socketConnect = (name) => async(dispatch) => {
	const connectingSocket = io(SERVER, {
		secure: true,
		transports: ['websocket'],
		jsonp: false
	});

	connectingSocket.on('connect', () => {
		connectingSocket.emit('join', { name });
	});
	
	connectingSocket.on('message', data => {
		const { message: text } = data;
		console.log(data);

		dispatch({
			type: MESSAGE_ACTIONS.TRANSCRIBED,
			payload: {
				text,
				user: { _id: 2, name: 'IoT' },
			}
		});
	});
	
	connectingSocket.connect();
	
	socket = connectingSocket;
	
	dispatch({
		type: MESSAGE_ACTIONS.CONNECTED,
	});
}

export const sendMessage = message => {
	socket.emit('message', { message });
	return {
		type: MESSAGE_ACTIONS.TRANSCRIBED,
		payload: message,
	};
}

export const initRecording = (onFinished, onProgress) => async(dispatch) => {
	AudioRecorder.prepareRecordingAtPath(AUDIO_PATH, {
		SampleRate: 16000,
		Channels: 1,
		AudioQuality: "Med",
		AudioEncoding: "lpcm",
		AudioEncodingBitRate: 32000
	});

	AudioRecorder.onFinished = data => {
		const status = data.status === "OK";

		if (onFinished) onFinished(status);
		finishRecording(data.audioFileURL, dispatch);
	}
	if (onProgress) AudioRecorder.onProgress = onProgress;
}

export async function startRecording() {
	return await AudioRecorder.startRecording();
}

export async function stopRecording() {
	return await AudioRecorder.stopRecording();
}

function extractTranscription(response) {
	if (!response || !response.results || !response.results[0] || !response.results[0].alternatives)
		return '[UNRECOGNIZED]';
	else
		return response.results[0].alternatives[0].transcript;
}

function finishRecording(filePath, dispatch) {
	console.log(`Finished recording at path: ${filePath}`);

	const filePathRead = filePath.replace('file://', '');

	RNFetchBlob.fs.readFile(filePathRead, 'base64').then(content => {
			const body = JSON.stringify(Object.assign({}, REQUEST_BASE, {
				audio: {
					content
				}
			}));

			return fetch(SPEECH_API_URL, {
				method: 'POST',
				headers,
				body,
			});
		}).then(r => r.json())
		.then(response => {
			console.log(response);
			const message = extractTranscription(response);
			dispatch({
				type: MESSAGE_ACTIONS.TRANSCRIBED,
				payload: message,
			});
			socket.emit('message', { message });
		}).catch(error => {
			console.error(error);
		});
}