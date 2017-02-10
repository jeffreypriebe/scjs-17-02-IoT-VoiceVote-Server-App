import {
	AudioRecorder,
	AudioUtils
} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob';

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

export function initRecording(onFinished, onProgress) {
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
		// finishRecording(data.audioFileURL);
	}
	if(onProgress) AudioRecorder.onProgress = onProgress;
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
		return response.results[0].alternatives[0];
}

function finishRecording(filePath) {
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
			console.info('MUST DISPATCH HERE')
			// const messages = this.updateMessages(this.state.messages, message);
			// this.setState({
			// 	transcribing: false,
			// 	transcribed: message,
			// 	messages
			// });
		}).catch(error => {
			console.error(error);
		});
}