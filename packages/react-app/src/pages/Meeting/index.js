import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import  { useUserMedia } from '../../hooks'
// import { ZoomMtg } from '@zoomus/websdk'
import Peer from 'peerjs';
// const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI || window.exports.JitsiMeetExternalAPI;

const VideoContainer = styled.div`
  width: 40vw;
  height: 60vh;
`

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};


export function Meeting() {

  const peer = new Peer()

  const [peerId, setPeerId] = useState('')
  const [conn, setConn] = useState({})
  const [connId, setConnId] = useState(0)
  const [peerStream, setPeerStream] = useState({})
  const [localStream, setLocalStream] = useState({})
  const [loading, setLoading] = useState(true)

  const videoRef = useRef();
  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }

  function connectToPeer() {
    if (peerId) {
      var connection = peer.connect(peerId)
      setConn(connection)
    } else {
      alert('enter an id')
      return false
    }
  }

  peer.on('open', function() {
    setPeerId(peer.id)
  })

  peer.on('connection', function(connection) {
    setConn(connection)
    setPeerId(connection.peer)
  })

  peer.on('error', function(error){
    alert('an error occured: ' + error)
    console.log(error)
  })



    
    return (
      <React.Fragment>
        <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
        <button onClick={() => connectToPeer()}>connect</button>
      </React.Fragment>
    );
}