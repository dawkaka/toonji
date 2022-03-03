import React,{useState,useEffect} from 'react'
import axios from "axios"
import {usePromiseTracker, trackPromise} from 'react-promise-tracker';
import {Helmet} from "react-helmet";

import {errorPrompt,showLoginModal} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'
import './flutterwave.css'

export default function FlutterWave() {
  const [amount, setAmount] = useState(5)
  const [coins, setCoins] = useState(500)
  const {promiseInProgress} = usePromiseTracker({area: "payment"})
  const initiatePayment = (e) => {
     e.preventDefault()
     trackPromise(
       axios.post(`${BASEURL}/buy-coins/flutterwave`,{amount: amount})
       .then(res => {

           window.location.assign(res.data.data.link)

       })
       .catch(err => {
         if(err.response.status === 401) {
           showLoginModal()
         }else {
           errorPrompt(err.response?.data.msg)
         }
       }),"payment")
  }

  return (
    <>
    <div id = "flutterwave-form-container" className = "testbox">
      <form >
          <h1>BUY COINS</h1>
        <label>Amount in USD  <br />
        <input type = "number" value = {amount} onChange = {(e)=> {
           if(e.target.value >= 1) {
             setAmount(e.target.value)
             setCoins(e.target.value * 100)
           }
        }}/>
        <br />
        </label>
        <label>Number of coins <br />
        <input type = "number" disabled value = {coins}/>
        </label>
        <div className ="btn-block">
          <button className = "profile-buttons" onClick = {(e)=> {
            e.preventDefault()
            window.history.back()
          }}>back </button>
          <LoadingSpinner height = {30} width = {30} color = "white" area = "payment"/>
          {!promiseInProgress && <button className = "profile-buttons cancel" type="submit"
          onClick = {initiatePayment}>initiate payment</button> }
        </div>
      </form>
    </div>
    <Helmet>
    <meta name="description"
     content="Buy coins to unlock god mode on the toonji platform. You'll be able to take quizes based on your favorite artist lyrics, get links to battle with friends and also award breakdowns and comments"
    />
    </Helmet>
    </>
  )
}
