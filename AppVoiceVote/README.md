# SCJS Feb 2017: VoiceVote App

This is part of the VoiceVote app which includes:

1. [IoT repo](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-IoT) (to be run on the Edison)
2. [Server](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/ServerVoiceVote) & [Mobile App](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/AppVoiceVote) repo (to be run on server, mobile app respectively)

## To Run

This is the mobile app, intended to run on a mobile device (or Simulator).

The app uses React Native and has been tested on an iPhone & Simulator. If you are on a Mac, it should work.

If you are on Android, it likely can work will work with some modification to the code (particularly around permissions for the audio - [see example](https://github.com/jsierles/react-native-audio/blob/master/AudioExample/AudioExample.js), or you can disable the speech recognition entirely).

1. Install the React Native CLI `npm i -g react-native-cli`
2. Be sure that [the Server](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/ServerVoiceVote) has been started.
    * This can either be the temporary server online, or locally run
3. Run the react native build `react-native run-ios` or `react-native run-android`
    * See the [RN Docs](https://facebook.github.io/react-native/docs/running-on-device.html)

## How To Use

Once running, you will be presented with a box to join a room. Read the room name off the desired edison LCD and tap 'Connect to Device'.

Once connected, you can:

1. Tap 'Start Recording` and speak a message (tap 'Stop Recording' when you are done).
    1. This sends the audio to [Google Cloud Speech API](https://cloud.google.com/speech/) for recognition.
    2. Once recognition is complete, you will see your message in the chat at the bottom.
2. Enter a message via the keyboard and tap 'Send'.

Once you send a message, it should appear on the Edison and trigger the related 'new message' behaviors.

You should see any response messages in the chat window at the bottom.