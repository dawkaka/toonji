import React,{useEffect,useState} from 'react';
import axios from 'axios'
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {Link} from 'react-router-dom'

import './profile.css';
import './editProfile.css'
import {BASEURL,IMAGEURL} from '../credentials'
import {errorPrompt,showLoginModal} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import EditProfile from './editProfile'
import {Digest,Followers,Following} from './profile'
import {numberToKOrM} from '../homePage/homeFunctions'
import {EditBr} from '../readPage/autoScroll'
import {BackIcon} from '../Icons/allIcons'

export default function MyProfileView() {
      const [userData,setUserData] = useState({})
      const [userBreaks,setUserBreaks] = useState([])
      const [brLoaderCount,setBrLoaderCount] = useState(0)
      const [faceoffData,setFaceOffData] = useState([])
      const [brEnd,setBrEnd] = useState(false)
      const [brLoadSpinning,setBrLoadSpinning] = useState(false)
      const [followersFetchInfo, setFollowersFetchInfo] = useState({nextFetch:0,isEnd: false})
      const [followingFetchInfo, setFollowingFetchInfo] = useState({nextFetch: 0, isEnd: false})
      const [faceOffFetchInfo, setFaceOffFetchInfo] = useState({nextFetch: 0, isEnd: false})
      const [followingInfo, setFollowingInfo] = useState([])
      const [followersInfo, setFollowersInfo] = useState([])

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
              if(!isCancel){
                setUserData(res.data)
              }
         })
         .catch(err =>{
           if(err.response?.status === 401) {
             showLoginModal()
           }else {
             errorPrompt(err.response?.data.msg)
           }
         })
          let path3 = `/p/my/breakdowns/${0}`
          trackPromise(
           axios.get(BASEURL + path3)
           .then(res => {

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
             if(err.response?.status === 401) {
               showLoginModal()
             }else {
               errorPrompt(err.response?.data.msg)
             }
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
            if(res.data.isEnd) {
              setBrEnd(true)
            }
            let brCopy = [...userBreaks,...res.data.breakdowns];
            setUserBreaks([])
            setUserBreaks(brCopy)
            setBrLoaderCount(res.data.nextFetch)
          })
          .catch(err =>{
            if(err.response?.status === 401) {
              showLoginModal()
            }else {
              errorPrompt(err.response?.data.msg)
            }
          })
       }


       const showFollowers = () => {
         document.getElementById("followers-modal").style.display = "block";
         let path = `/p/my/followers/${followersFetchInfo.nextFetch}`
         setFollowersFetchInfo({...followersFetchInfo, isSpinning: false})
         trackPromise(
         axios.get(BASEURL + path)
         .then(res =>{
               setFollowersInfo([...followersInfo,...res.data.data])
               setFollowersFetchInfo({nextFetch:res.data.nextFetch,isEnd:res.data.isEnd, isSpinning: false})
         })
         .catch(err =>{
           setFollowersFetchInfo({...followersFetchInfo, isSpinning: false})
           if(err.response?.status === 401) {
             showLoginModal()
           }else {
             errorPrompt(err.response?.data.msg)
           }
         }),"followers")
       }

       const showFollowing = () => {
         document.getElementById("following-modal").style.display = "block";
         let path = `/p/my/following/${followingFetchInfo.nextFetch}`
         setFollowingFetchInfo({...followersFetchInfo, isSpinning: false})
         trackPromise(
         axios.get(BASEURL + path)
         .then(res =>{
               setFollowingInfo([...followingInfo,...res.data.data])
               setFollowingFetchInfo({nextFetch: res.data.nextFetch, isEnd: res.data.isEnd, isSpinning: false})
         })
         .catch(err =>{
           setFollowingFetchInfo({...followersFetchInfo, isSpinning: false})
           if(err.response?.status === 401) {
             showLoginModal()
           }else {
             errorPrompt(err.response?.data.msg)
           }
         }),"following")
       }


       const showFaceOff = ()=> {
           document.getElementById("face-off-records-modal").style.display = "block"
           let  path =   `/my/battle-records/${faceOffFetchInfo.nextFetch}`
           if(faceOffFetchInfo.isEnd) return
           trackPromise(
            axios.get(BASEURL + path)
            .then(res =>{
               setFaceOffData(prev => [...prev,...res.data.data])
               setFaceOffFetchInfo({nextFetch: res.data.nextFetch, isEnd: res.data.isEnd})
            }).catch(err =>{
              if(err.response?.status === 401) {
                showLoginModal()
              }else {
                errorPrompt(err.response?.data.msg)
              }
            }),'face-off')
       }

  return (
    <>
    <EditProfile name = {userData.name} bio = {userData.bio}
    picture = {userData.picture} reqURL = {BASEURL + '/profile/edit-profile'}/>
    <Followers followers = {followersInfo} fetchInfo = {followersFetchInfo}  loaderClick = {showFollowers}/>
    <Following following = {followingInfo} fetchInfo = {followingFetchInfo}  loaderClick = {showFollowing}/>
    <FaceoffRecord faceoffData = {faceoffData}
     fetchInfo = {faceOffFetchInfo} loaderClick = {showFaceOff}/>
    <div className = "profile-view-container">
    <div className = "back-icons-container">
    <BackIcon />
    </div>
    <div id= "profile-info-container">
    <img src = {`${IMAGEURL}${userData.picture}?tr=w-350,h-350,c-at_max`} id = "profile-photo" alt = "artist" />
    {<h2 className= "profile-name" id = "profile-name">
    {userData.name === undefined ? "-":userData.name}
    {userData.verified && <i className = "fas fa-certificate"></i>}</h2>}
    <div className = "profile-achievements-container">
    <Achievements id = "points" top = {`${userData.points === undefined ? "-":numberToKOrM(userData.points)}`} bottom = 'points' />
    <Achievements id = "following" top = {`${userData.following === undefined ? "-":numberToKOrM(userData.following)}`}
     bottom = 'following' onClick = {showFollowing} />
    <Achievements id = "followers" top = {`${userData.followers === undefined ? "-":numberToKOrM(userData.followers)}`}
     bottom = 'followers' onClick = {showFollowers}/>
     <Achievements id = "coins" top = {userData.coins} bottom = "coins"/>
     <Achievements id = "face-off-stats" top = {userData.battleRecord}
     bottom = "battles" onClick = {showFaceOff}/>
    </div>
    <p className = "profile-bio" id = "profile-bio" aria-label = "profile bio">{`${userData.bio === undefined ? "":userData.bio}`}</p>
    <button className="profile-buttons" id ="profile-edit-button" onClick = {()=>{
      document.getElementById("edit-profile-main").style.display = "block"
    }}>edit<i className = "fas fa-edit"></i>
    </button>
    <Link to = "/b/battle-link">
    <button className="profile-buttons">battle</button>
    </Link>
    {/* <button className = "profile-buttons">
    <a href = "/buy-coins.html" target = "_SELF">coins</a>
    </button> */}
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


export function ReloadButton(props) {
  return (
    <div className = "reload-container-p">
    {!props.isSpinning && !props.isEnd && <i className = "fas fa-redo"
    onClick = {props.handleLoaderClick}></i>}
    {props.isEnd && <span className = "reload-end">end</span>}
    </div>
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

  const {inProgress} = usePromiseTracker("face-off")

  function hideModal(e) {

    if(e.target.id === "face-off-records-modal") {
      e.target.style.display = "none"
    }
  }

  return (
    <div id = "face-off-records-modal" onClick = {hideModal}>
    <div id = "face-off-records-container">
    <h1>FACE OFFs</h1>

    {
      props.faceoffData.map((a,indx)=> {
        return (
          <Battle userData = {a.userOne} opponentData = {a.userTwo}  key = {indx}/>
        )
      })
    }
    <LoadingSpinner area = "face-off" height = {30} width = {30} />
    {!inProgress && <ReloadButton isSpinning = {props.fetchInfo.isSpinning} isEnd = {props.fetchInfo.isEnd}
    handleLoaderClick = {props.loaderClick}/> }
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
