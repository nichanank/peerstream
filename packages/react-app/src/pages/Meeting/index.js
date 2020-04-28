import React, { useState, useRef, useCallback } from 'react'
import  { useUserMedia, useEventEmitter } from '../../hooks'
import styled from 'styled-components'
import Peer from 'peerjs'

const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 3%;
  padding-bottom: 2%;
  width: 100vw;
  height: 60vh;
`

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  height: 5vh;
  margin-left: 5%;
  margin-bottom: 2%;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 5vh;
  justify-content: center;
  margin-bottom: 2%;
`

export const MeetingButton = styled.button`
  background: ${({ theme }) => theme.primaryGreen}; 
  font-family: Ubuntu; 
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 15%;
  margin-left: 3%;
  font-size: 1rem;
  :hover {
    background: ${({ theme }) => theme.secondaryGreen}; 
    box-shadow: 0px 7px 7px rgba(0, 0, 0, 0.25);
  }
`

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};

const peer = new Peer((Math.random().toString(36) + '0000000000000000000').substr(2, 16), {
  host: 'peerstream-server.herokuapp.com',
  port: 443,
  path: '/peerjs',
  secure: true
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
  )

  const handleSetConnection = useCallback((connection) => {
    console.log('Connection established with ' + connection.peer)  
    setPeerId(connection.peer)
  },[]
)

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
)

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
      var connection = peer.connect(peerId)
      connection.on('on', function(connect) {
        console.log(connect)
      })
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
        <video ref={videoRef} onCanPlay={handleCanPlay} width="60%" height="90%" autoPlay playsInline muted />
        <video ref={peerVideoRef} onCanPlay={handlePeerStreamCanPlay} width="60%" height="90%" autoPlay playsInline muted />
      </VideoContainer>
      <InformationContainer><span><strong>My Video ID:</strong> {peer.id}</span><span><strong>Peer Video ID:</strong> {peerId}</span></InformationContainer>
      <ButtonsContainer><input onChange={e => setPeerId(e.target.value)}/><MeetingButton onClick={() => connectToPeer()}>Connect</MeetingButton>
      <MeetingButton onClick={() => askToCall()}>Call</MeetingButton></ButtonsContainer>
    </React.Fragment>
  )
}