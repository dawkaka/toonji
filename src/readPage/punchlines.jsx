import React,{useState} from 'react'
import LoadingSpinner from '../prompts/loadingComponent';
import { trackPromise} from 'react-promise-tracker';
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import {Options} from './comments'
import axios from 'axios'
import {BASEURL,IMAGEURL} from '../credentials'
import {LyricsCardIcon} from '../Icons/allIcons'
import {Link} from 'react-router-dom'
import {numberToKOrM} from './readFunctions.js'
import { usePromiseTracker } from "react-promise-tracker";
import "./punchlines.css"

export default function Punchline(props) {
      const [fires,setFires] = useState(props.raters)
      const [fired,setFired] = useState(props.hasFire)
      const [brDowns,setBrDowns] = useState([])
      const [brText,setBrText] = useState('');
      const [addBrOpened,setAddBrOpened] = useState(false)
      const {promiseInProgress} = usePromiseTracker({area:'add-breakdown'})
      const [userFav,setUserFav] = useState(props.userFav)


    function handleClick(e)  {
      document.getElementById("reports-container").style.display = "none";
      let iconsOpen = e.target.nextSibling;
      if(iconsOpen.style.display === "none") {
        iconsOpen.style.display = "flex";
      }else {
         iconsOpen.style.display = "none"
      }
    }

const axiosGetBreakdowns = () => {
  trackPromise(
    axios.get(`${BASEURL}/breakdowns${window.location.pathname}/${props.indx}`)
    .then(res => {
       setBrDowns([])
       setBrDowns(res.data)
    })
    .catch(err => {
      if(err.response.status === 401) {
        showLoginModal()
      }else {
        errorPrompt(err.response?.data.msg)
      }
    }),'breakdown-area')
}
    function openBreakdowns(e) {
      let target = e.target.parentNode.parentNode;
      let scrollDiv = document.getElementById("read-side-punchlines-container")
      if((window.innerHeight-e.pageY) < 300) {
         scrollDiv.scrollTop += (350 + 20 - (window.innerHeight-e.pageY))
      }

      if(target.nextSibling.className.split(" ").some(a => a === "breakdown-show")) {
        e.target.style.color = "";
        target.nextSibling.classList.remove("breakdown-show")
      }else {
        e.target.style.color = "var(--main-color)";
        target.nextSibling.classList.add("breakdown-show");
        axiosGetBreakdowns()

      }
    }

   const addBarToFavourites = () => {
      setUserFav(!userFav)
      axios.post(`${BASEURL}/bar-favourited${window.location.pathname}/${props.id}`)
      .then(res => {
         let message = res.data.msg
         if(res.data.type === "SUCCESS") {
           successPrompt(message)
         }else {
           setUserFav(!userFav)
         }
      })
      .catch(err => {
        if(err.response.status === 401) {
          showLoginModal()
        }else {
          errorPrompt(err.response?.data.msg)
        }
      })
   }

    function handleFireclick(e) {
      if(!fired){
        setFires(fires + 1)
        setFired(true)
      }else {
        setFires(fires - 1)
        setFired(false)
      }
       axios.post(`${BASEURL}/lyrics/fire${window.location.pathname}/${props.indx}`)
         .then(res =>{
           let message = res.data.msg
       if(res.data.type === "SUCCESS"){
         successPrompt(message)
       }
       })
        .catch((err)=>{
          if(err.response.status === 401) {
            showLoginModal()
          }else {
            errorPrompt(err.response?.data.msg)
          }
       })
    }

    // function playAudio(e) {
    //   if (e.target.className === "fas fa-play sm") {
    //      let targetAudio = e.target.parentNode.previousSibling
    //      let pauseIcon = e.target.parentNode.nextSibling
    //      e.target.style.display = "none"
    //      pauseIcon.childNodes[0].style.display = "block"
    //      targetAudio.play()
    //   }else {
    //     let targetAudio = e.target.parentNode.previousSibling.previousSibling
    //     let playIcon = e.target.parentNode.previousSibling
    //     e.target.style.display = "none"
    //     playIcon.childNodes[0].style.display = "block"
    //     targetAudio.pause()
    //   }
    // }

    function copyPunchline(e) {
      try{
      let inp = document.createElement("input")
      inp.setAttribute('type',"text");
      inp.setAttribute("disable",true)
      inp.value = `${props.punchline} ~ ${props.artist} (toonji.com)`;
      document.getElementById("main").appendChild(inp);
      inp.select();
      document.execCommand("copy")
      inp.style.display = "none";
      successPrompt("bar copied")
    }catch(e) {
      errorPrompt("bar not copied")
    }
    }

   function sendBreakdown() {
     if(brText.trim() === '') return
     trackPromise(
     axios({
       method: 'post',
       url: BASEURL + '/breakdown'+window.location.pathname+"/"+props.indx,
       data: {
        breakdown: brText.trim()
       }
     })
     .then((res)=>{
       let message = res.data.msg
       if(res.data.type === "SUCCESS"){
     setBrText('')
     axios.get(`${BASEURL}/breakdowns${window.location.pathname}/${props.indx}`)
     .then(res => {
        setBrDowns([])
        setBrDowns(res.data)
     })
     .catch(err => {
       if(err.response.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
     })
     successPrompt(message)
   }
   })
    .catch((err)=>{
      if(err.response.status === 401) {
        showLoginModal()
      }else {
        errorPrompt(err.response?.data.msg)
      }
   }),'add-breakdown')
   }
 const brDeleted = () => axiosGetBreakdowns()
  return (
    <>
    <p className = "punchline" onClick = {handleClick}>
     {props.punchline}
    </p>
    <div className = "punchline-icons" >
    <LyricsCardIcon className = {userFav ? "fas fa-heart icon-active sm" : "fas fa-heart sm"}
    onClick = {addBarToFavourites}/>
    <LyricsCardIcon className = 'fas fa-copy sm' id="copy-punchline"
    onClick = {copyPunchline} />
    {(props.hasIcons === undefined || props.hasIcons) &&
     <LyricsCardIcon className="fas fa-lightbulb sm" onClick = {openBreakdowns}/>}
    {(props.hasIcons === undefined || props.hasIcons) &&
    <LyricsCardIcon number = {`${numberToKOrM(fires)}`} total = "total sm"
      onClick = {handleFireclick} ind = {props.indx}
     className ={`fas fa-fire-alt sm ${fired ? "icon-active":''}`}/>}
     </div>
    {(props.hasIcons === undefined || props.hasIcons) &&
     <div className = "breakdowns-container">
    <button id = "add-br-toggle" onClick = {()=> setAddBrOpened(!addBrOpened)}>
    {addBrOpened ? "x":"+"}</button>
    {addBrOpened && <div id = "add-container">
     <textarea resize = "none" rows = "10" colums = "50" value = {brText}
     placeholder= "explain the line" onChange = {(e)=>
       (e.target.value.length <= 500) ? setBrText(e.target.value):""
       }>
      </textarea>
      <button id = "add-breakdown" onClick = {sendBreakdown}>
      <LoadingSpinner color = 'white' height = {20} width = {20} area = "add-breakdown"/>
      {!promiseInProgress && <i className = "fas fa-paper-plane"></i>}
      </button>
     </div>}
     <LoadingSpinner area = "breakdown-area" height = {30} width = {30}/>
     {brDowns.map((b,indx)=>{
       return <Breakdowns  key = {indx} breakdown = {b.breakdown} date = {new Date(b.date).toDateString()}
       user = {b.name } indx = {b.id} punchId = {props.indx}
       totalVotes = {b.totalVotes} userVote = {b.userVote}
       breakdownPic = {`${IMAGEURL}${b.picture}?tr=w-45,h-45,c-at_max`}
       isThisUser = {b.isThisUser} points = {b.points}
       songId = {window.location.pathname.substr(1)}
       addClass = 'shift-vote-total' isDeletedBr = {brDeleted}
       awards = {b.brAwards ? b.brAwards : {}} />
     })}

    </div>
  }
    <span></span>
    </>
  )
}

export function Breakdowns (props) {
  const [totalVotes,setTotalVotes] = useState(props.totalVotes)
  const [userVote,setUserVote] = useState(props.userVote)
    function handleVote(e) {
      if(e.target.className.split(' ').some(a => a === "up-vote"||
       a === 'down-vote')) return
      let vote = '';
       if(e.target.className === 'fas fa-angle-down bg') {
        vote = 'DOWNVOTE'
      }else if(e.target.className === 'fas fa-angle-up bg') {
        vote = 'UPVOTE'
      }

      axios.post(`${BASEURL}/breakdown-vote/${
        props.songId
      }/${props.punchId}/${props.indx}/${vote}`)
      .then((res)=>{
        let message  = res.data.msg;
        let hasVoted = userVote ? true: false
        if(res.data.type === "SUCCESS"){
          setUserVote(vote)
          if(vote === 'UPVOTE') {
            hasVoted ? setTotalVotes(totalVotes + 2):setTotalVotes(totalVotes + 1)
          }else {
            hasVoted ? setTotalVotes(totalVotes - 2):setTotalVotes(totalVotes - 1)
          }
         successPrompt(message)
    }

    })
     .catch((err)=>{
       if(err.response.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
     })
    }

    function handleAwardBr(e) {
       let awardStore = document.getElementById("award-br-container")
       awardStore.style.display = "block"
       awardStore.className = `breakdown-${props.songId}-${props.punchId}-${props.indx}`
    }
  return (
    <div className = "breakdowns">
     <div className = "breakdown">
     <div>
     <Options isUser = {props.isThisUser} options = {{userOnly:['delete','edit'],allUsers:['award']}}
     item = "breakdown" songId = {props.songId} punchId = {props.punchId}
      barId = {props.indx} isDeletedBr = {props.isDeletedBr} edit = {props.editBr}
       giveAward = {handleAwardBr}/>
     <div className = "comment-details">
     <img className = "comment-image" src = {props.breakdownPic}
     alt="user" />
     <div className = "comment-details-text">
     <Link to ={`/p/${props.user}`}><h5>{props.user} <small>{props.points} points</small></h5></Link>
     <small>{props.date}</small>
     </div>
     </div>
     <div className = "awards-acumulated-container">
     <AwardBadge image = "/platinum.png" numOfTimesAWarded = {props.awards ? props.awards.platinum ? props.awards.platinum: "0" : "0" } />
     <AwardBadge image = "/diamond.png" numOfTimesAWarded = {props.awards ? props.awards.diamond ?  props.awards.diamond : "0" : "0"} />
     <AwardBadge image = "/gold.png" numOfTimesAWarded = {props.awards ? props.awards.gold ?  props.awards.gold : "0" : "0"} />
     <AwardBadge image = "/silver.jpg" numOfTimesAWarded = {props.awards ? props.awards.silver ?  props.awards.silver : "0" : "0"} />
     <AwardBadge image = "/bronze.jpg" numOfTimesAWarded = {props.awards ? props.awards.bronze ?  props.awards.bronze : "0" : "0"} />
     <AwardBadge image = "/copper.jpg" numOfTimesAWarded = {props.awards ? props.awards.copper ?  props.awards.copper : "0" : "0"} />
     </div>
     <p className= "brd-text" id = {props.indx}>
      {props.breakdown}
     </p>
     </div>
     </div>
     <div className = "breakdown-icons">
     <LyricsCardIcon
      className = {`fas fa-angle-up bg${userVote==='UPVOTE'?" up-vote":"" }`}
     onClick = {handleVote}/>
     <p className = {props.addClass}>{numberToKOrM(totalVotes)}</p>
     <LyricsCardIcon
     className = {`fas fa-angle-down bg${userVote ==='DOWNVOTE'?" down-vote":"" }`}
      onClick = {handleVote}/>
     </div>
     </div>
  )
}

export function AwardBadge(props) {
  return (
    <>
    {props.numOfTimesAWarded > 0 && <div className = "badge-container">
    <img src = {props.image} className = "awards-acumulated-image" alt = "award" />
    <span>{props.numOfTimesAWarded}</span>
    </div>}
    </>
  )
}
