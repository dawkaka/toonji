import React,{useState} from 'react';
import axios from 'axios'

import '../uploadPage/contributorRequest.css';
import {errorPrompt} from '../prompts/promptMessages'
import {trackPromise,usePromiseTracker } from "react-promise-tracker";

import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'



export default function ReportBug(){
  const [reason,setReason] = useState("")
  const [msg, setMsg] = useState("")
  const {promiseInProgress} = usePromiseTracker({area:'contributor-request'})

  const sendRequest = () => {
    if(reason !== "" && reason.length < 256) {
      trackPromise(
      axios.post(BASEURL + "/p/bug-report",{reason})
      .then((res)=>{

        if(res.data.type === 'ERROR') {
          errorPrompt(res.data.msg)
        }else {
          setReason("")
          setMsg(res.data.msg)
        }
      }).catch(e => {}),'contributor-request')
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
    <h1>REPORT A BUG</h1>
    <label htmlFor = "contributor-request-reason">
    describe the bug, help us make toonji better
    </label>
    <br/>
    <textarea id = "contributor-request-reason" value = {reason} onChange = {handleReason}>
    </textarea><br/>
    <LoadingSpinner height = {30} width = {30} area = {"contributor-request"} />
    {!promiseInProgress && <button  id = "contributor-request-button"
    className = "profile-buttons" onClick = {sendRequest}>submit</button> }
    <button className = "profile-buttons" onClick = {() => window.history.back()}>back</button>
    <p className = "rrMsg">{msg}</p>
    </center>
    </div>
  )
}
