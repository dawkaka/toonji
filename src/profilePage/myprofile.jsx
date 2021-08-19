import React,{useEffect,useState} from 'react';
import axios from 'axios'
import {usePromiseTracker,trackPromise} from "react-promise-tracker";
import {Link} from 'react-router-dom'

import './profile.css';
import './editProfile.css'
import {BASEURL,IMAGEURL} from '../credentials'
import {errorPrompt,successPrompt,showLoginModal} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import EditProfile from './editProfile'
import {Digest,TopFans} from './profile'
import {numberToKOrM} from '../homePage/homeFunctions'
import {ReloadButton} from '../readPage/comments'
import {EditBr} from '../readPage/autoScroll'
import {BackIcon} from '../Icons/allIcons'

export default function MyProfileView() {
      const [userData,setUserData] = useState({})
      const [userBreaks,setUserBreaks] = useState([])
      const [brLoaderCount,setBrLoaderCount] = useState(0)
      const [topFan,setTopFan] = useState({data:[],header:false})
      const [faceoffData,setFaceOffData] = useState([])
      const [brEnd,setBrEnd] = useState(false)
      const [brLoadSpinning,setBrLoadSpinning] = useState(false)


       useEffect(()=>{

         document.title = "TOONJI - My Profile"
         if(window.innerWidth > 700){
         document.getElementById("profile-info-container").style.height
         = `${window.innerHeight}px`;
         document.getElementById('profile-feed').style.height
         = `${window.innerHeight}px`;
       }
         let isCancel = false
         axios.get(BASEURL + '/my/profile')
         .then(res =>{
           if(res.data.type === "ERROR") {
             if(res.data.msg === 'log in required') {
               showLoginModal()
             }
              errorPrompt(res.data.msg)
            }else {
              if(!isCancel){
                setUserData(res.data)
              }
           }
         })
         .catch(err =>{
           errorPrompt('something went wrong')
         })
          let path3 = `/p/my/breakdowns/${0}`
          trackPromise(
           axios.get(BASEURL + path3)
           .then(res => {
             if(res.data.type === "ERROR"){
               errorPrompt(res.data.msg)
               return;
             }
             if(!isCancel){
             if(res.data.isEnd) {
               setBrEnd(true)
             }
             let brCopy = [...res.data.breakdowns];
             setUserBreaks([])
             setUserBreaks(brCopy)
             setBrLoaderCount(res.data.nextFetch)
           }
           })
           .catch(err =>{
             errorPrompt('something went wrong')
           }),'profile-songs')
         return ()=> {
           isCancel = true;
         }
       },[])

       const brLoaderClick = ()=> {
         let path3 = `/p/my/breakdowns/${brLoaderCount}`
       setBrLoadSpinning(true)
      axios.get(BASEURL + path3)
          .then(res => {
            setBrLoadSpinning(false)
            if(res.data.type === "ERROR"){
              errorPrompt(res.data.msg)
              return;
            }
            if(res.data.isEnd) {
              setBrEnd(true)
            }
            let brCopy = [...userBreaks,...res.data.breakdowns];
            setUserBreaks([])
            setUserBreaks(brCopy)
            setBrLoaderCount(res.data.nextFetch)
          })
          .catch(err =>{
            errorPrompt('something went wrong')
          })
       }

       function showTopFans(e) {
         document.getElementById("top-fans-modal").style.display = "block";
         let path ="";
         let detailsToShow = e.target.className === "achievements" ?
         e.target.id : e.target.parentNode.id;
         if(detailsToShow === "following") {
           path =   `/p/my/following`
         }else if (detailsToShow === "followers"){
           path = `/p/my/followers`
         }

         trackPromise(
          axios.get(BASEURL + path)
          .then(res =>{
            if(res.data.type === 'ERROR'){
              errorPrompt(res.data.msg)
            }else {
             if(detailsToShow === "followers"){
               setTopFan({data:res.data,header: "followers"})
             }else {
               setTopFan({data:res.data,header:"following"})
             }
          }
          })
          .catch(e =>{
            errorPrompt("something went wrong")
          }),'top-fans')
       }

       const showFaceOff = ()=> {
           document.getElementById("face-off-records-modal").style.display = "block"
           let  path =   `/my/battle-records`
           trackPromise(
            axios.get(BASEURL + path)
            .then(res =>{
              if(res.data.type === 'ERROR'){
                errorPrompt(res.data.msg)
                return
              }
               setFaceOffData(res.data)
            }).catch(e =>{
              errorPrompt("something went wrong")
            }),'face-off')
       }

  return (
    <>
    <EditProfile name = {userData.name} bio = {userData.bio}
    picture = {userData.picture} reqURL = {BASEURL + '/profile/edit-profile'}/>
    <TopFans topFans = {topFan.data} header = {topFan.header}/>
    <FaceoffRecord faceoffData = {faceoffData}/>
    <Faceoff />
    <div className = "profile-view-container">
    <div id= "profile-info-container">
    <img src = {`${IMAGEURL}${userData.picture}?tr=w-350,h-350,c-at_max`} id = "profile-photo" alt = "artist" />
    {<h2 className= "profile-name" id = "profile-name">
    {userData.name === undefined ? "-":userData.name}
    {userData.verified && <i className = "fas fa-certificate"></i>}</h2>}
    <div className = "profile-achievements-container">
    <Achievements id = "points" top = {`${userData.points === undefined ? "-":numberToKOrM(userData.points)}`} bottom = 'points' />
    <Achievements id = "following" top = {`${userData.following === undefined ? "-":numberToKOrM(userData.following)}`}
     bottom = 'following' onClick = {showTopFans} />
    <Achievements id = "followers" top = {`${userData.followers === undefined ? "-":numberToKOrM(userData.followers)}`}
     bottom = 'followers' onClick = {showTopFans}/>
     <Achievements id = "coins" top = {userData.coins} bottom = "coins"/>
     <Achievements id = "face-off-stats" top = {userData.battleRecord}
     bottom = "battles" onClick = {showFaceOff}/>
    </div>
    <p className = "profile-bio" id = "profile-bio" aria-label = "profile bio">{`${userData.bio === undefined ? "":userData.bio}`}</p>
    <button className="profile-buttons" id ="profile-edit-button" onClick = {()=>{
      document.getElementById("edit-profile-main").style.display = "block"
    }}>edit<i className = "fas fa-edit"></i>
    </button>
    <button className="profile-buttons" onClick = {()=>{
      document.getElementById("face-off-main-container").style.display = "flex"
    }}>battle</button>
    <button className = "profile-buttons"><a href = "/buy-coins.html" target = "_SELF">coins</a></button>
    </div>
    <div id = "profile-feed">
    <FeedFilters />
    <div id= "space"></div>
    <div id="feed-digests-container" className = "feed-view feed-show">
    <div className = "loading-container">
    <LoadingSpinner area = "profile-songs" heigh = {30} width = {30}/>
    </div>
    <EditBr />
    {
      userBreaks.map((a,indx)=> {
        return <Digest key = {indx} bar = {a.bar}
        name = {a.breakdown.name} date = {a.breakdown.date}
        picture = {a.breakdown.picture} userVote = {a.breakdown.userVote}
        breakdown = {a.breakdown.breakdown} songTitle = {a.songTitle}
        totalVotes = {a.breakdown.totalVotes} artist = {a.artist}
        songId = {a.songId} punchId = {a.punchIndx}
        points = {a.breakdown.points} id = {a.breakdown.id}
        isThisUser = {a.breakdown.isThisUser} awards = {a.breakdown.brAwards}/>
      })
    }
    <div className = "reload-container">
    <ReloadButton isSpinning = {brLoadSpinning} isEnd = {brEnd}
    handleLoaderClick = {brLoaderClick}/>
    </div>
    </div>
    </div>
    </div>
    </>
  )
}

function FeedFilters() {
     function feedFilterToggle(e) {
        for(let elm of Array.from(document.getElementsByClassName("feed-filter"))){
          elm.classList.remove("feed-active")
        }
        e.target.classList.add("feed-active")
        let str = e.target.id;
        for(let elm of Array.from(document.getElementsByClassName("feed-view"))){
          elm.classList.remove("feed-show");
        }
        switch (str) {
          case "feed-songs":
            document.getElementById("feed-songs-container").classList.add("feed-show")
            break;
            case "feed-digests":
              document.getElementById("feed-digests-container").classList.add("feed-show")
              break;
              case "feed-albums":
                document.getElementById("feed-albums-container").classList.add("feed-show")
                break;
          default:

        }
     }
  return (
    <div id = "feed-filters">
    <span id = "feed-digests" className = "feed-filter" onClick = {feedFilterToggle}
    aria-label= "navigate to digests">Breakdowns</span>
    <BackIcon profile = {true}/>
    </div>
  )
}

function  Achievements(props) {

  return (
    <div className = "achievements" id = {props.id} onClick = {props.onClick}>
    <p>{props.top}</p>
    <p>{props.bottom}</p>
    </div>
  )
}


export function FaceoffRecord(props) {

  function hideModal(e) {
    if(e.target.id === "face-off-records-modal") {
      e.target.style.display = "none"
    }
  }

  return (
    <div id = "face-off-records-modal" onClick = {hideModal}>
    <div id = "face-off-records-container">
    <h1>FACE OFFs</h1>
    <LoadingSpinner area = "face-off" height = {30} width = {30} />
    {
      props.faceoffData.map((a,indx)=> {
        return (
          <Battle userData = {a.userOne} opponentData = {a.userTwo}  key = {indx}/>
        )
      })
    }
    </div>
    </div>
  )
}

function Battle(props) {
    let userPoints = props.userData.points
    let oppPoints = props.opponentData.points
  return (
    <div className = "battle-container">
     <div className = "battle-user-side">
     <img src = {`${IMAGEURL}${props.userData.picture}`} className = "battle-images" alt = "user"/>
     <Link to = {"/p/" + props.userData.name}><h3>{props.userData.name}</h3></Link>
     <p className = {userPoints > oppPoints ? "won-green":
     userPoints < oppPoints ? "lost-red":""}>{userPoints}</p>
     </div>
     <h4> vs </h4>
     <div className = "battle-opponent-side">
     <img src = {`${IMAGEURL}${props.opponentData.picture}`} className = "battle-images" alt = "user"/>
     <Link to = {"/p/" + props.opponentData.name}><h3>{props.opponentData.name}</h3></Link>
     <p className = {userPoints > oppPoints ? "lost-red":
      userPoints < oppPoints ? "won-green":""}>{oppPoints}</p>
     </div>
    </div>
  )
}


function Faceoff() {
  const {promiseInProgress} = usePromiseTracker({area: "battle-link"})
  const location = window.location.origin + "/battle/"
  const [battleLink,setBattleLink] = useState("")
  const [linkFetched,setLinkFetched] = useState(false)
  const getLink = () => {
    if(linkFetched) {
       document.getElementById("face-off-main-container").style.display = "none"
       return
    }
    trackPromise(
     axios.get(BASEURL + "/battle/battle-link")
     .then(res => {
       if(res.data.type === 'ERROR'){
         errorPrompt(res.data.msg)
       }else {
        setBattleLink(location + res.data.battleId)
        setLinkFetched(true)
       }
     })
     .catch(e =>{
       errorPrompt("something went wrong")
     }),'battle-link')
  }
  const copyBattleLink = (e) => {
    try{
    let inp = document.createElement("input")
    inp.setAttribute('type',"text");
    inp.value = document.getElementById("display-battle-link").value
    document.getElementById("face-off-main-container").appendChild(inp);
    inp.select();
    document.execCommand("copy")
    inp.style.display = "none";
    successPrompt("link copied")
  }catch(e) {
    errorPrompt("something went wrong")
  }
  }
  return (
    <div id = "face-off-main-container" >
    <div className = "quiz-notification">
     <h1>READY FOR A FACE OFF ?</h1>
     <p>We are going to give you a link you can share with friends to
     challenge them to Ksi songs lyrics face off, Are you ready?
     <br />
     <small> link only valid for 24 hours </small>
     </p>
     <div  className = "quiz-notification-confirm">
     <button className = "profile-buttons cancel" onClick = {()=>{
       document.getElementById("face-off-main-container").style.display = "none"
     }}>back</button>
     <LoadingSpinner height = {30} width = {30} area = "battle-link" />
     {!promiseInProgress && <button className = "profile-buttons" onClick = {getLink}>{linkFetched ? "exit" : "Yes"}</button>}
     </div>
     <input id = "display-battle-link" type = "text" value = {battleLink} readOnly/>
     <button id = "copy-battle-link" onClick = {copyBattleLink}>copy</button>
     <br/>
     <br/>
     <br/>
     <small> open a new browser tab and paste the link to start </small>
    </div>
    </div>
  )
}
