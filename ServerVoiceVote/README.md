# SCJS Feb 2017: VoiceVote App

This is part of the VoiceVote app which includes:

1. [IoT repo](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-IoT) (to be run on the Edison)
2. [Server](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/ServerVoiceVote) & [Mobile App](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/AppVoiceVote) repo (to be run on server, mobile app respectively)

## To Run

This is the server app which consists of a socket-io server that manages messages between the mobile app and the edison IoT device.

To run it locally `node server.js`

Be sure to check that your mobile app and edison devices are pointing at your local server and can connect to it. (And check for App Transport Security Settings in the iOS mobile app.)
