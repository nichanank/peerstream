import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import  { useUserMedia, useEventEmitter } from '../../hooks'
import Peer from 'peerjs'

const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100vw;
  height: 70vh;
  padding-left: 7%;
  padding-right: 7%;
`

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 20vh;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 10vh;
`

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};

const peer = new Peer((Math.random().toString(36) + '0000000000000000000').substr(2, 16), {
  host: 'localhost',
  port: 4001,
  path: '/'
});

export function Meeting() {
  
  const [peerId, setPeerId] = useState('')

  const videoRef = useRef();
  const peerVideoRef = useRef()

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  const handleSetPeerId = useCallback(() => {
    console.log('ON: set peer id')  
    setPeerId(peer.id);
    },[]
  );

  const handleSetConnection = useCallback((connection) => {
    console.log('Connection established with ' + connection.peer)  
    setPeerId(connection.peer)
  },[]
);

  const handleSetCall = useCallback((call) => {
    console.log('Incoming call')
    var acceptCall = window.confirm("Do you want to accept this call?")

    if (acceptCall){
      call.answer(mediaStream)
      call.on('stream', function(stream) {
        peerVideoRef.current.srcObject = stream; 
      })
      call.on('close', function() {
        alert('the call has been ended')
      })
    } else {console.log('call denied') }
  },[mediaStream]
);

  const handlePeerError = useCallback((error) => {
    alert('an error occured: ' + error)
    peer.destroy()
  },[]);
  
  // Add event listener using our hook
  useEventEmitter('open', handleSetPeerId, peer);
  useEventEmitter('connection', handleSetConnection, peer);
  useEventEmitter('call', handleSetCall, peer);
  useEventEmitter('error', handlePeerError, peer);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    var startVideo = window.confirm("Do you want to start the video?")
    if (startVideo) videoRef.current.play();
  }

  function handlePeerStreamCanPlay() {
    peerVideoRef.current.play();
  }

  function connectToPeer() {
    if (peerId) {
      peer.connect(peerId)
    } else {
      alert('enter an id')
      return false
    }
  }

  function askToCall() {
    console.log('Calling peer: ' + peerId)
    var call = peer.call(peerId, mediaStream)
    call.on('stream', function(stream) {
      peerVideoRef.current.srcObject = stream
    })
  }
 
  return (
    <React.Fragment>
      <VideoContainer>
        <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
        <video ref={peerVideoRef} onCanPlay={handlePeerStreamCanPlay} autoPlay playsInline muted />
      </VideoContainer>
      <InformationContainer><span>my id is {peer.id}</span><span>peer id is {peerId}</span></InformationContainer>
      <ButtonsContainer><input onChange={e => setPeerId(e.target.value)}/><button onClick={() => connectToPeer()}>Connect</button>
      <button onClick={() => askToCall()}>Call</button></ButtonsContainer>
    </React.Fragment>
  );
}