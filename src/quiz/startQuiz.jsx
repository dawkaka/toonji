import React,{useState,useEffect} from 'react'
import axios from 'axios'
import strSimilarity from 'string-similarity'
import { trackPromise} from 'react-promise-tracker';
import {Helmet} from 'react-helmet'

import './startQuizCss.css'
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'
import {errorPrompt,successPrompt,showLoginModal} from '../prompts/promptMessages'

function StartQuiz() {
       const [current,setCurrent] = useState(0);
       const [timeStart,setTimeStart] = useState(0);
       const [totalPoints,setTotalPoints] = useState(0)
       const [generatedQuestions,setQuestions] = useState([]);
       const [getCoins,setGetCoins] = useState(false)
         useEffect(()=>{
           document.title = "toonji - top fan quiz"
           let path = window.location.pathname;
           let param = path.substr(path.lastIndexOf('/'))
               trackPromise(
                 axios.get(`${BASEURL}/top-fan-quiz${param}`)
                   .then(res => {
                       setQuestions(res.data)

                   })
                   .catch(err => {
                     if(err.response?.status === 401) {
                       showLoginModal()
                     }else {
                       errorPrompt(err.response?.data.msg)
                     }
                   })
               )
              setTimeStart(Date.now())
         },[])

    let questions = ""
    if(generatedQuestions.length > 0){
    questions = generatedQuestions.map((q,indx)=>{
        return <QuizQuestion key = {indx} questionTitle = {q.questionTitle}
        questionText = {q.questionText} id = {indx} inputId = {`${indx}-answer`}
        questionAnswer = {q.questionAnswer} resultId = {`${indx}-result`}
        action = {current === generatedQuestions.length - 1 ? "finish":"next"}
        qDisplay = {indx === current ? "start-quiz-main show-question":"start-quiz-main"}
         submitClick = {(e)=>{
             let inpt = document.getElementById(`${indx}-answer`).value.toLowerCase();
             if(inpt === "") return
             let ans = q.questionAnswer.toLowerCase()
             ans = ans.replace(/in'/g,'ing')
             ans = ans.replace(/\W/g,'')
             inpt = inpt.replace(/in'/g,'ing')
             inpt =  inpt.replace(/\W/g,'')
             let isCorrect = strSimilarity.compareTwoStrings(ans,inpt)
             let timeUsed = Date.now() - timeStart;

             if(isCorrect > 0.8) {
               if(timeUsed <= 10000) {
                 setTotalPoints(totalPoints + 10)
               }else if(timeUsed <= 15000 && timeUsed > 10000) {
                 setTotalPoints(totalPoints + 7)
               }else if(timeUsed <= 20000 && timeUsed > 15000) {
                 setTotalPoints(totalPoints + 5)
               }else {
                 setTotalPoints(totalPoints + 3)
               }
               if(isCorrect <= 0.85) {
                 setTotalPoints(totalPoints + 1)
               }else if(isCorrect <= 0.90 && isCorrect > 0.85) {
                 setTotalPoints(totalPoints + 2)
               }else if(isCorrect <= 0.95 && isCorrect > 0.90) {
                 setTotalPoints(totalPoints + 3)
               }else {
                 setTotalPoints(totalPoints + 5)
               }
               document.getElementById(`${indx}-result`).classList.add("show-result-correct")
             }else {
               document.getElementById(`${indx}-result`).childNodes[0].innerText = "Wrong answer"
               document.getElementById(`${indx}-result`).classList.add("show-result-wrong")
             }
             e.target.style.display = "none"
         }}
       nextClick = {(e)=>{
         document.getElementById(`${indx}-result`).classList.remove("show-result-correct")
         document.getElementById(`${indx}-result`).classList.remove("show-result-wrong")
         setTimeStart(Date.now())
         setCurrent(current + 1);
         if(e.target.innerText === "finish") {
           let path = window.location.pathname;
           let param = path.substr(path.lastIndexOf('/'))
           axios.post(`${BASEURL}/top-fan${param}/${totalPoints}`)
             .then(res => {
               let msg = res.data.msg;
                 successPrompt(msg)
             })
             .catch(err => {
               if(err.response?.status === 401) {
                 showLoginModal()
               }else {
                 errorPrompt(err.response?.data.msg)
               }
             })
           document.getElementById("quiz-finish-result").style.display = "block"
         }
       }}
         />
    })
  }else {
    questions = ""
  }

  return (
    <>
    <LoadingSpinner height = {80} width = {80} />
    <div id= "start-quiz-container">
    {questions}
    {getCoins && <div>
      <button className = "profile-buttons"><a href="/buy-coins.html" target ="_BLANK"
      rel="noopener noreferrer">buy coins</a></button>
      <button className = "profile-buttons" onClick = {() => window.history.back()}>back</button>
    </div>}
    </div>
    <div id="quiz-finish-result">
    <h2>Thank you for taking the top fan quiz</h2>
    <p>you had a total points of <span>{totalPoints}</span></p>
    <button className = "profile-buttons" onClick = {() => window.history.back()}>ok</button>
    </div>
    <Helmet>
    <title>Top Fan Quiz - Toonji</title>
    <meta name = "description"
          content = "Answer questions based on selected artist lyrics to earn points and climb the artist top fan list"/>
    </Helmet>
    </>
  )
}

export function QuizQuestion(props) {
   useEffect(()=> {
     if(props.qDisplay === "start-quiz-main show-question") {
       document.getElementById(props.id).childNodes[2].focus()
     }

     let input = document.getElementById(props.inputId)
     let mainDiv = document.getElementById(props.id)
     mainDiv.addEventListener("keypress",e => {
        e.stopImmediatePropagation()
       if(e.key === "Enter" && input.value !== "") {
         if(input.nextSibling.childNodes[1].style.display === "none"){
           mainDiv.nextSibling.childNodes[1].click()
         }else {
            input.nextSibling.childNodes[1].click()
         }
       }
     })

   })

  return (
    <>
    <div className = {props.qDisplay} id = {props.id}>
    <h1>{props.questionTitle}</h1>
    <p>{props.questionText}</p>
    <input type="text" placeholder = "enter answer" className = "quiz-answer-input"
    aria-label ="enter your answer" id = {props.inputId} />
    <div className = "start-quiz-notification-confirm">
    <button className = "profile-buttons cancel" onClick = {props.nextClick}>{props.action === 'finish' ? 'finish':'skip'}</button>
    <button className = "profile-buttons" onClick = {props.submitClick}>submit</button>
    </div>
    </div>
    <div className = "answer-result" id = {props.resultId}>
    <p>correct answer</p>
    <button className = "profile-buttons" onClick = {props.nextClick}>{props.action}</button>
    </div>
    </>
  )
}
export default StartQuiz;
