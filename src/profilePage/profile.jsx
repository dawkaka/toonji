import React,{useEffect,useState} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {trackPromise} from 'react-promise-tracker';
import './profile.css';
import './editProfile.css'
import LyricsReviewCard from '../homePage/lyricsCard';
import {BASEURL,IMAGEURL} from '../credentials'
import {ReloadButton} from '../readPage/comments'
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import {numberToKOrM} from '../homePage/homeFunctions'
import {Breakdowns} from '../readPage/punchlines'
import LoadingSpinner from '../prompts/loadingComponent';
import TopFanQuiz from './topFanQuiz'
import {EditBr,AwardBr} from '../readPage/autoScroll'
import {FaceoffRecord} from './myprofile'
import {BackIcon} from '../Icons/allIcons'
export default function ProfileView() {
      const [userData,setUserData] = useState({name: ''})
      const [isFollowing,setIsFollowing] = useState(false)
      const [following,setFollowing] = useState(0);
      const [topFan,setTopFan] = useState({data:[],header:false})
      const [userSongs,setUserSongs] = useState([])
      const [userBreaks,setUserBreaks] = useState([])
      const [loaderCount,setLoaderCount] = useState(0)
      const [songsLoadSpinning,setSongsLoadSpinnig] = useState(false)
      const [songsEnd,setSongsEnd] = useState(false)
      const [brLoaderCount,setBrLoaderCount] = useState(0)
      const [brEnd,setBrEnd] = useState(false)
      const [brLoadSpinning,setBrLoadSpinning] = useState(false)
      const [faceoffData,setFaceOffData] = useState([])
      const [param,setParam] = useState('')


       useEffect(()=>{
         let isCancel = false;
         let pathname  = window.location.pathname;
         let profileUser = document.cookie.split(";")
                                          .join("=").split("=").map(a => a.trim())
                                          .includes(pathname.substr(pathname.lastIndexOf('/') + 1))
         if(profileUser){
          window.location.href= "/my/profile"
         }
         if(window.innerWidth > 700){
         document.getElementById("profile-info-container").style.height
         = `${window.innerHeight}px`;
         document.getElementById('profile-feed').style.height
         = `${window.innerHeight}px`;
       }

         if(!isCancel){
         document.title = "TOONJI - User Profile"
         document.getElementById("top-fans-modal").style.display = "none"
          }
         if(!isCancel){
           setParam(pathname.substr(pathname.lastIndexOf('/')))
         }
         let path = `/p${pathname.substr(pathname.lastIndexOf('/'))}`
         axios.get(BASEURL + path)
         .then(res => {
           if(res.data.type === "ERROR"){
             errorPrompt(res.data.msg)
             return;
           }
           if(!isCancel){
           setUserData(res.data);
           setFollowing(res.data.followers);
           setIsFollowing(res.data.following)
         }
         })
         .catch(err =>{
         })

        let path2 = `/p/songs${pathname.substr(pathname.lastIndexOf('/'
      ))}/${0}`
        trackPromise(
         axios.get(BASEURL + path2)
         .then(res => {
           if(res.data.type === "ERROR"){
             errorPrompt(res.data.msg)
             return;
           }
           if(!isCancel){
           if(res.data.isEnd) {
             setSongsEnd(true)
             setLoaderCount(0)
             setUserSongs(res.data.songs)
           }else {
             setLoaderCount(res.data.nextFetch)
             setUserSongs(res.data.songs)
           }
         }
         })
         .catch(err =>{
         }),'profile-songs')

         let path3 = `/p/breakdowns${pathname.substr(pathname.lastIndexOf('/'))}/${0}`
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
          }),'profile-songs')

         return ()=>{
           isCancel = true
         }
       },[param])


let interval = window.setInterval(()=> {
  let pathname  = window.location.pathname;
  setParam(pathname.substr(pathname.lastIndexOf('/')))
},1)

useEffect(()=>{
  return () => {
    clearInterval(interval)
  }
})

function showTopFans(e) {
  document.getElementById("top-fans-modal").style.display = "block";
  let pathname  = window.location.pathname;
  let path ="";
  let detailsToShow = e.target.className === "achievements" ?
  e.target.id : e.target.parentNode.id;
  if(detailsToShow === "top-fans") {
    path =   `/p/top-fans${pathname.substr(pathname.lastIndexOf('/'))}`
  }else if (detailsToShow === "followers"){
    path = `/p/followers${pathname.substr(pathname.lastIndexOf('/'))}`
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
        setTopFan({data:res.data,header:"top fans"})
      }
   }
   })
   .catch(e =>{
     errorPrompt("something went wrong")
   }),'top-fans')
}
const showFaceOff = ()=> {
    document.getElementById("face-off-records-modal").style.display = "block"
    let pathname  = window.location.pathname;
    let  path =   `/battle-records${pathname.substr(pathname.lastIndexOf('/'))}`
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

const handleFollowClick = (e) => {
  let pathname  = window.location.pathname;
    let path = `/p/follow${pathname.substr(pathname.lastIndexOf('/'))}`
    if(!following) {
      setIsFollowing(true)
      setFollowing(following + 1)
    }else {
      setIsFollowing(false)
      setFollowing(following - 1)
    }
    axios({
         method: 'post',
         url: BASEURL + path,
         data:{}
       })
   .then(res=>{
     let message = res.data.msg;
      if(res.data.type === "ERROR"){
        if(message === 'log in required') {
          showLoginModal()
        }
          errorPrompt(message)
      }else {
          successPrompt(res.data.msg)
      }
   })
   .catch(err=>{
         errorPrompt("something went wrong")
      })
}

 const songsLoaderClick = ()=> {
   let pathname = window.location.pathname;
   let path2 = `/p/songs${pathname.substr(pathname.lastIndexOf('/'))}/${loaderCount}`
   setSongsLoadSpinnig(true)
  axios.get(BASEURL + path2)
    .then(res => {
      setSongsLoadSpinnig(false)
      if(res.data.type === "ERROR"){
        errorPrompt(res.data.msg)
        return;
      }else {
        if(res.data.isEnd) {
          setSongsEnd(true)
        }
          setLoaderCount(res.data.nextFetch)
          let userSongsCopy = [...userSongs,...res.data.songs]
          setUserSongs([])
          setUserSongs(userSongsCopy)
      }
    })
    .catch(err =>{
      errorPrompt('something went wrong')
    })
 }

 const brLoaderClick = ()=> {
   let pathname = window.location.pathname
   let path3 = `/p/breakdowns${pathname.substr(pathname.lastIndexOf('/'
 ))}/${brLoaderCount}`
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

  return (
    <>
    <TopFans topFans = {topFan.data} header = {topFan.header}/>
    <TopFanQuiz user = {userData.name}/>
    <FaceoffRecord faceoffData = {faceoffData} />
    <div className = "profile-view-container">
    <div id= "profile-info-container">
    <div id= "profile-info-container-2">
    <img src =  {`${IMAGEURL}${userData.picture}?tr=w-500,h-350,c-at_max`} id = "profile-photo" alt = "artist" />
    {<h2 className= "profile-name" id = "profile-name">
    {userData.name === undefined ? "-":userData.name}
    {userData.verified && <i className = "fas fa-certificate"></i>}</h2>}
    <div className = "profile-achievements-container">
    {userData.verified &&  <Achievements id = "songs" top = {`${userData.noSongs === undefined ?
       '-':userData.noSongs}`} bottom = 'songs' />}
    <Achievements id = "points" top = {`${userData.points === undefined ? '-':numberToKOrM(userData.points)}`} bottom = 'points' />
    <Achievements id = "followers" top = {`${userData.followers === undefined ? "-":numberToKOrM(following)}`}
     bottom = {following === 1 ? "follower":"followers"} onClick = {showTopFans} />
   {userData.verified && <Achievements id = "top-fans" top = {`${userData.topFans === undefined ? "-":userData.topFans}`}
    bottom ='top fans' onClick = {showTopFans} />}
    {!userData.verified && <Achievements id = "face-off-stats" top = {userData.battleRecord}
    bottom = "battles" onClick = {showFaceOff}/> }
    </div>
    <p className = "profile-bio" aria-label = "profile bio">
    {userData.bio || "-"} </p>
    <button className="profile-buttons" onClick = {handleFollowClick}>
    {isFollowing ? "following":"follow"}
    </button>
    {userData.verified && <button className = "profile-buttons" onClick = {()=>{
      document.getElementById("quiz-main-container").style.display = "flex"
    }}>top fan ?</button>}
    </div>
    </div>
    <div id = "profile-feed">
    <FeedFilters verified = {userData.verified}/>
    <div id= "space"></div>
    <div id="feed-songs-container"
     className = {`feed-view ${userData.verified ? 'feed-show' : ''}`}>
    <div className = "loading-container">
    <LoadingSpinner area = "profile-songs" heigh = {30} width = {30}/>
    </div>
    {
      userSongs.map((a,indx)=> {
      return <LyricsReviewCard key = {indx} songId = {a.songId}
      hottesBar = {a.barPreview} songTitle = {a.songTitle}
      songArtist = {a.songArtist} fullHottestBar = {a.hottesBar}
      fires = {`${a.fires}`} cover = {a.songCover} favourited = {a.favourited}
      views = {`${a.views}`} isInFavourites = {a.isFav} raters = {a.raters}
      comments = {`${a.comments}`} rating = {a.rating} otherArtist = {a.otherArtists}
      />
     })   }
     <div className = "reload-container">
     <ReloadButton isSpinning = {songsLoadSpinning} isEnd = {songsEnd}
     handleLoaderClick = {songsLoaderClick}/>
     </div>
    </div>
    <div id="feed-digests-container"
    className = {`feed-view ${userData.verified ? '':'feed-show'}`}>
    <div className = "loading-container">
    <LoadingSpinner area = "profile-songs" heigh = {30} width = {30}/>
    </div>
    <AwardBr />
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

function FeedFilters(props) {
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
    {props.verified && <span id = "feed-songs" className = "feed-filter feed-active" onClick = {feedFilterToggle}
    aria-label= "navigate to songs">Songs</span>}
    {!props.verified && <span id = "feed-digests" className = "feed-filter" onClick = {feedFilterToggle}
    aria-label= "navigate to digests">Breakdowns</span>}
    <BackIcon profile = {true} />
    </div>
  )
}
export function  Achievements(props) {

  return (
    <div className = "achievements" id = {props.id} onClick = {props.onClick}>
    <p>{props.top}</p>
    <p>{props.bottom}</p>
    </div>
  )
}

export function Digest(props) {

  return (
    <div className = "digets-container">
    <Link to = {`/${props.songId}`}>
    <h5>{props.songTitle}</h5>
    </Link>
    <h6>{props.artist}</h6>
    <Link to = {`/${props.songId}`}>
    <p> {props.bar}</p>
    </Link>
    <Breakdowns breakdown = {props.breakdown}
    date = {new Date(props.date).toDateString()}
    user = {props.name } indx = {props.id} punchId = {props.punchId}
    totalVotes = {props.totalVotes} userVote = {props.userVote}
    breakdownPic = {`${IMAGEURL}${props.picture}`}
    isThisUser = {props.isThisUser} songId = {props.songId}
    points = {props.points} awards = {props.awards}/>
    </div>
  )
}

export function TopFans(props) {
  return (
    <div id="top-fans-modal" onClick = {(e)=>{
      if(e.target.id === "top-fans-modal"){
      e.target.style.display= "none"
    }
    }}>
    <ul>
    <LoadingSpinner area = "top-fans" height = {30} width = {30} />
    <h1>{props.header}</h1>
    {
      props.topFans.map((f,indx) =>{
        return <TopFan key = {indx} pos = {props.header === "top fans" ?indx + 1:""} name = {f.name}
        points = {f.points}
        picture = {`${IMAGEURL}${f.picture}?tr=w-45,h-45,c-at_max`}/>
      })
    }

    </ul>
    </div>
  )
}

export function TopFan(props) {
  return (
    <li>
    <h4 className ="top-fan-position">{props.pos}</h4>
    <img className = "top-fan-image" src = {props.picture} alt="user" />
    <Link to={`/p/${props.name}`}><h4 className="top-fan-name">{props.name}</h4></Link>
    <h4 className = "top-fan-points">{props.points} points</h4>
    </li>
  )
}
