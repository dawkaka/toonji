import React,{useState} from 'react';
import './contributorRequest.css';
import {errorPrompt} from '../prompts/promptMessages'
import {trackPromise,usePromiseTracker } from "react-promise-tracker";
import axios from 'axios'
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'



export default function ContributorRequest(){
  const [reason,setReason] = useState("")
  const [msg,setMsg] = useState("")
  const {promiseInProgress} = usePromiseTracker({area:'contributor-request'})

  const sendRequest = () => {
    if(reason !== "" && reason.length < 256) {
      trackPromise(
      axios.post(BASEURL + "/p/contributor-request",{reason})
      .then((res)=>{
          setMsg(res.data.msg)
      }).catch(err => errorPrompt(err.response?.data.msg))
    )
    }
  }

  const handleReason = (e) => {
    if(e.target.value.length > 255) {
      setReason(reason)
    }else {
      setReason(e.target.value)
    }

  }
  return(
    <div id = "contributor-request-container">
    <center>
    <h1>BEING A CONTRIBUTOR ALLOWS YOU TO:</h1>
    <ul>
    <li>upload song lyrics</li>
    <li>edit song lyrics</li>
    </ul>
    <label htmlFor = "contributor-request-reason">
    tell us why we should make you a contributor
    </label>
    <br/>
    <textarea id = "contributor-request-reason" value = {reason} onChange = {handleReason}>
    </textarea><br/>
    <LoadingSpinner height = {30} width = {30} area = {"contributor-request"} />
    {!promiseInProgress && <button  id = "contributor-request-button"
    className = "profile-buttons" onClick = {sendRequest}>request</button> }
    <button className = "profile-buttons" onClick = {() => window.history.back()}>back</button>
    <p>{msg}</p>
    </center>
    </div>
  )
}
