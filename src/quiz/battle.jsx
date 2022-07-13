import React,{useEffect,useState} from 'react'
import io from "socket.io-client"
import strSimilarity from 'string-similarity'
import {Helmet} from "react-helmet"

import './battle.css'
import {BASEURL, SOCKETURL} from "../credentials"
import './startQuizCss.css'
import {toggleBattlePointsAnimation} from './battleFunctions'
import {errorPrompt,successPrompt,showLoginModal} from '../prompts/promptMessages'

let socket;
export default function BattlePage() {
  const [getQuestions,setGetQuestions] = useState(false)
  const [questions,setQuestions] = useState([])
  const [joined,setJoined] = useState(false)
  const [isValidLink,setIsValidLink] = useState(true)
  const [showGetQuestion,setShowGetQuestions]  = useState(false)
  const [waitingForOwner,setWaitingForOwner] = useState(false)
  const [linkFull,setLinkFull] = useState(false)
  const [opponentName,setOpponentName] = useState("")
  const [ownersName, setOwnersName] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [battleInProcess,setBattleInProcess] = useState(false)
  const roomId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1)

    useEffect(()=> {
      socket = io(BASEURL +"-battle",{transports: ["websocket"]});
      document.title = "TOONJI | battle quiz"
      socket.on("connect_error", (err) => {
       console.log(err)
       errorPrompt("something went wrong")
       socket.disconnect()
     });

      socket.on("connect",msg => {
        socket.emit("join-room",roomId)
      })

     socket.on("all-set",(msg)=> {
       setShowGetQuestions(true)
       setOpponentName(msg)
     })
     socket.on("opponent-disconnected",() => {
       if(!hasStarted) {
         setShowGetQuestions(false)
         errorPrompt("oppnent has disconnected, please refresh your browser")
       }else {
         successPrompt("opponent has disconnected, but you can continue")
       }
     })

     socket.on("login required",msg => {
       errorPrompt(msg)
       showLoginModal()
       socket.disconnect()
     })

     socket.on("invalid link", msg => {
       setIsValidLink(false)
     })

     socket.on("in-process", msg => {
       setBattleInProcess(true)
     })

     socket.on("questions", msg => {
       setQuestions(msg)
       setGetQuestions(true)
     })

     socket.on("joined", msg => {
        setJoined(true)
     })
     socket.on("set", msg => {
        setWaitingForOwner(true)
        setOwnersName(msg)
     })

     socket.on("opponent-ended",msg => {
        successPrompt(msg)
     })
     socket.on("link-full", () => {
       setLinkFull(true)
     })
    return ()=> {
      socket.disconnect()
    }
  },[])


  const emitForQuestions = () => {
    try{
    socket.emit("get-questions",roomId)
    setHasStarted(true)
   } catch (e) {
     errorPrompt("error connecting to battle server")
   }
  }
  return (
    <>
    <div className = "battle-view-container">
      {!getQuestions && <NotStartQuiz isValidLink = {isValidLink} joined = {joined}
      sGetQuestions = {emitForQuestions} showGetQuestion = {showGetQuestion}
       waitingForOwner = {waitingForOwner} linkFull = {linkFull} opponentName = {opponentName} inP = {battleInProcess}/>}
      {getQuestions && <StartQuiz questions = {questions} socket = {socket}  oppName = {opponentName} owName = {ownersName}/>}
    </div>
    <Helmet>
    <title>TOONJI BATTLE</title>
    <meta name="description"
     content = "Battle with friends based on lyrics of selected artists. Prove you are a lyrics warrior"
    />
    </Helmet>
    </>
  )
}

function NotStartQuiz(props) {
  return (
    <div id = "not-start-container">
    {!props.isValidLink && <InvalidLink />}
    {props.inP && <BattleInProgress />}
    {props.linkFull && !props.joined && <LinkFull />}
    {props.joined && !props.showGetQuestion && ! props.waitingForOwner && <JoinedLink />}
    {props.waitingForOwner && <WaitingForOwner />}
    {props.showGetQuestion && <ShowGetQuestions opponent = {props.opponentName} sGetQuestions = {props.sGetQuestions}/>}
    </div>
  )
}

function InvalidLink() {
  return (
    <h4 className = "invalid-battle-link">this link has expired or it's invalid </h4>
  )
}

function BattleInProgress() {
  return (
    <h4 className = "invalid-battle-link">there's a battle in progress on this link</h4>
  )
}

function JoinedLink() {
  return (
    <div className = "battle-progress-container">
    <h4 className = "invalid-battle-link">waiting for opponent to join </h4>
    <div className = "animation-dots-container">
    <div className = "animation-dot one"></div>
    <div className = "animation-dot two"></div>
    <div className = "animation-dot three"></div>
    </div>
    </div>
  )
}


function ShowGetQuestions(props) {
   const [hasclick,setHasClick] = useState(false)
   const startClick = () => {
       if(!hasclick) {
         props.sGetQuestions()
       }
        setHasClick(true)
   }
  return (
    <div id = "show-get-q-container">
    <h4 className = "invalid-battle-link">{props.opponent} joined click start to begin</h4>
    {!hasclick && <button onClick = {startClick}>start</button>}
    {hasclick && <p>loading...</p>}
    </div>
  )
}

function WaitingForOwner() {
  return (
    <div className = "battle-progress-container">
    <h4 className = "invalid-battle-link">all set waiting for link owner to start battle </h4>
    <div className = "animation-dots-container">
    <div className = "animation-dot one"></div>
    <div className = "animation-dot two"></div>
    <div className = "animation-dot three"></div>
    </div>
    </div>
  )
}

function LinkFull() {
  return (
    <h1 className = "invalid-battle-link">this battle link is currently full </h1>
  )
}

function StartQuiz(props) {
       const [current,setCurrent] = useState(0);
       const [timeStart,setTimeStart] = useState(0);
       const [totalPoints,setTotalPoints] = useState(0)
       let generatedQuestions = props.questions;
       const [opponentPoints,setOpponentPoints] = useState(0)

         useEffect(()=>{
              setTimeStart(Date.now())
              socket.on("opponent-points", points => {
                setOpponentPoints(oldPoints => oldPoints + parseInt(points))
                let opponent = document.getElementById("opponent-points")
                let userPoints = document.getElementById("user-points")
                const currentPoint = parseInt(points) + parseInt(opponent.innerText)
                opponent.innerText = currentPoint
                const opponentPoints = parseInt(userPoints.innerText)
                if(currentPoint > opponentPoints) {
                  opponent.classList.remove("battle-points-trailing")
                  opponent.classList.add("battle-points-leading")
                  userPoints.classList.remove("battle-points-leading")
                  userPoints.classList.add("battle-points-trailing")
                }else if (currentPoint < opponentPoints) {
                  opponent.classList.remove("battle-points-leading")
                  opponent.classList.add("battle-points-trailing")
                  userPoints.classList.remove("battle-points-trailing")
                  userPoints.classList.add("battle-points-leading")
                }else {
                  userPoints.classList.remove("battle-points-leading")
                  userPoints.classList.remove("battle-points-trailing")
                  opponent.classList.remove("battle-points-leading")
                  opponent.classList.remove("battle-points-trailing")
                }
                toggleBattlePointsAnimation(opponent)
              })
         },[])

    function updatePoint(newPoint) {
       let userPoints = document.getElementById("user-points")
       let opponent = document.getElementById("opponent-points")
       const oldPoint = parseInt(userPoints.innerText)
       const currentPoint = newPoint + oldPoint
       userPoints.innerText = currentPoint;
       const opponentPoints = parseInt(opponent.innerText)
       if(currentPoint > opponentPoints) {
         userPoints.classList.remove("battle-points-trailing")
         userPoints.classList.add("battle-points-leading")
         opponent.classList.remove("battle-points-leading")
         opponent.classList.add("battle-points-trailing")
       }else if (currentPoint < opponentPoints) {
         userPoints.classList.remove("battle-points-leading")
         userPoints.classList.add("battle-points-trailing")
         opponent.classList.remove("battle-points-trailing")
         opponent.classList.add("battle-points-leading")
       }else {
         userPoints.classList.remove("battle-points-leading")
         userPoints.classList.remove("battle-points-trailing")
         opponent.classList.remove("battle-points-leading")
         opponent.classList.remove("battle-points-trailing")
       }

       toggleBattlePointsAnimation(userPoints)
    }

    let questions = ""
    if(generatedQuestions && generatedQuestions.length > 0){
    questions = generatedQuestions.map((q,indx)=>{
        return <QuizQuestion key = {indx} questionTitle = {q.questionTitle}
        questionText = {q.questionText} id = {indx} inputId = {`${indx}-answer`}
        questionAnswer = {q.questionAnswer} resultId = {`${indx}-result`}
        action = {current === generatedQuestions.length - 1 ? "finish":"next"}
        qDisplay = {indx === current ? "start-quiz-main show-question":"start-quiz-main"}
         submitClick = {(e)=>{
             let inpt = document.getElementById(`${indx}-answer`).value.toLowerCase();
             let ans = q.questionAnswer.toLowerCase()
             ans = ans.replace(/in'/g,'ing')
             ans = ans.replace(/\W/g,'')
             inpt = inpt.replace(/in'/g,'ing')
             inpt =  inpt.replace(/\W/g,'')
             let isCorrect = strSimilarity.compareTwoStrings(ans,inpt)
             let timeUsed = Date.now() - timeStart;
             let newPoint = 0
             if(isCorrect > 0.8) {
               if(timeUsed <= 10000) {
                 newPoint = 10
               }else if(timeUsed <= 15000 && timeUsed > 10000) {
                  newPoint = 7
               }else if(timeUsed <= 20000 && timeUsed > 15000) {
                 newPoint = 5
               }else {
                 newPoint = 3
               }
               if(isCorrect <= 0.85) {
                 newPoint += 1
               }else if(isCorrect <= 0.90 && isCorrect > 0.85) {
                 newPoint += 2
               }else if(isCorrect <= 0.95 && isCorrect > 0.90) {
                 newPoint += 3
               }else {
                 newPoint += 5
               }
               setTotalPoints(totalPoints + newPoint)
               document.getElementById(`${indx}-result`).classList.add("show-result-correct")
             }else {
               document.getElementById(`${indx}-result`).childNodes[0].innerText = "Wrong answer"
               document.getElementById(`${indx}-result`).classList.add("show-result-wrong")
             }
             let roomId = window.location.pathname.substr(window.location.pathname.lastIndexOf("/") + 1)
             props.socket.emit("new-points",[newPoint,roomId])
             if(newPoint > 0) {
               updatePoint(newPoint)
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
           let roomId = path.substr(path.lastIndexOf('/') + 1)
           props.socket.emit("user-ended",roomId)
           document.getElementById("quiz-finish-result").style.display = "block"
         }
       }}
         />
    })
  }else {
    questions = "couldn't get question refresh page to try again"
  }

  return (
    <>
    <UserInfo name = "opponent-name" id = "opponent-points" userName = {props.oppName || props.owName}/>
    <UserInfo left = {true} name = "user-name" id = "user-points" userName = "You"/>
    <div id= "start-quiz-container">
    {questions}
    </div>
    <div id="quiz-finish-result">
    <h2>End of Battle</h2>
    <p>your points <span>{totalPoints}</span> : opponent's points <span>{opponentPoints}</span></p>
    <button className = "profile-buttons" onClick = {()=> window.history.back()}>ok</button>
    </div>
    <Helmet>
      <title>Toonji | Multi player real time battle</title>
      <meta>Toonji lyrics multi player battle</meta>
    </Helmet>
    </>
  )
}

function UserInfo(props) {

  let cls = props.left ? "battle-user-info battle-left": "battle-user-info"
  return (
    <div className = {cls}>
    <p className = "battle-points" id = {props.id}>0</p>
    <p className = "battle-user-name" id = {props.name}>{props.userName}</p>
    </div>
  )
}

function QuizQuestion(props) {

  return (
    <>
    <div className = {props.qDisplay} id = {props.id}>
    <h1>{props.questionTitle}</h1>
    <p>{props.questionText}</p>
    <input type="text" placeholder = "enter answer" className = "quiz-answer-input"
    aria-label ="enter your answer" id = {props.inputId}/>
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
