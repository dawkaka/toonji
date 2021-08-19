import React from 'react'
import './topFanQuizCss.css'
import {Link} from 'react-router-dom'
function TopFanQuiz(props) {

  return (
    <div id = "quiz-main-container">
    <div className = "quiz-notification">
     <h1>A TOP FAN ?</h1>
     <p>We are going to give you a series of quizes based on Ksi's lyrics,
     you get points base on how correctly and how fast you answer them.
     Are you ready ?
     </p>
     <div  className = "quiz-notification-confirm">
     <button className = "profile-buttons cancel" onClick = {()=>{
       document.getElementById("quiz-main-container").style.display = "none"
     }}>cancel</button>
     <Link to = {`/top-fan/${props.user}`}>
     <button className = "profile-buttons">Start</button>
     </Link>
     </div>
    </div>
    </div>
  )
}
export default TopFanQuiz;
