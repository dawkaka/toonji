import React,{useState,useEffect} from 'react';
import axios from 'axios'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {Link} from 'react-router-dom'
import {Helmet} from "react-helmet"

import {Logo} from '../header-footer/header'
import './readLyricsCss.css'
import {LyricsCardIcon} from '../Icons/allIcons'
import Punchline from './punchlines'
import CommentSideView from './comments'
import {BASEURL} from '../credentials'
import {AutoScroll,EditBr,AwardBr} from './autoScroll'
import {numberToKOrM} from './readFunctions';
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import {BackIcon} from '../Icons/allIcons'
export default function ReadLyricsView() {
  const [lyricData,setLyricData] = useState([])
  const [performanceData,setPerformanceData] = useState([])
     useEffect(()=>{
       if(!sessionStorage.getItem(window.location.pathname)){
       trackPromise(
        axios.get(BASEURL + window.location.pathname)
        .then(res =>{
          let message = res.data.message
          if(res.data.type === 'ERROR') {
            errorPrompt(message)
          }else {
           setLyricData(res.data.modefiedData)
           setPerformanceData(res.data.performanceData)
           sessionStorage.setItem(window.location.pathname,JSON.stringify(res.data))
           let title = `${res.data.modefiedData.songArtist.toUpperCase()} -
           ${res.data.modefiedData.songTitle}`
           document.title = title;
           axios.post(`${BASEURL}/lyrics/viewed${window.location.pathname}`)
             .then(res => {
             })
             .catch(err => {
                errorPrompt("something went wrong")
             })
         }
        })
        .catch(err => {
          errorPrompt('something went wrong')
        }),'read-lyrics')
      }else {
        let sessionData = JSON.parse(sessionStorage.getItem(window.location.pathname))
        setLyricData(sessionData.modefiedData)
        setPerformanceData(sessionData.performanceData)
      }

    },[]);
 window.addEventListener("load",()=> {
   sessionStorage.clear()
 })
  const { promiseInProgress } = usePromiseTracker();
  return (
    <>
    <div className="read-page-container">
    <ReadHeader />
    <div className = "read-loader-container">
    <LoadingSpinner height = {50} width = {50} area = "read-lyrics"/>
    </div>
   <div className = "read-view-container">
   {!promiseInProgress &&
     <ReadSideView  lyricData = {lyricData}
       pData = {performanceData}/>}
   <CommentSideView />
   </div>
   </div>
   <Helmet>
   <meta name="description"
    content = {`Song lyrics for ${lyricData.songArtist}'s ${lyricData.songTitle}. Toonji.com the best lyrics platform on the internet`}
   />
   </Helmet>
   </>
  )
}

function ReadHeader() {
     const punchlineSearch = (e) => {
       let searchParam = e.target.value
       let punchlines = document.getElementsByClassName("punchline");
       for(let p of Array.from(punchlines)) {
         let innerHtml  = p.innerText;
         let start = innerHtml.indexOf(searchParam)
         let before = innerHtml.substring(0,start)
         let after = innerHtml.substring(start + searchParam.length)
         if(start > -1) {
           p.innerHTML = before + "<span>"+searchParam+"</span>"+after;
         }
       }
     }
  return (
    <div className = "trending-header-container">
     <Logo />
     <input className="trending-search-box" type="search"
     placeholder="search bars" aria-label="Search"
     onChange = {punchlineSearch} />
     <BackIcon />
    </div>
  )
}



function ReadSideView(props) {


  let others = props.lyricData.otherArtists
  return (
    <div className = "read-side-container">
    <ReadSideHeader songTitle={props.lyricData.songTitle}
    artist = {props.lyricData.songArtist}
    artists = {`${props.lyricData.songArtist}
    ${others !== "" && others !== undefined && others !== 'undefined'? `ft ${others}`:''}`}
    views={props.lyricData.views === undefined ? "-":`${props.lyricData.views}`}
    rating = {`${props.lyricData.rating === undefined ? '-': props.lyricData.rating}
    (${props.lyricData.raters === undefined ? "-":props.lyricData.raters})`}
    />

    <ReadPunchlines lyricData = {props.lyricData.punchlines} youtubeVideo = {props.lyricData.youtubeVideo}
    isInFavourites = {props.lyricData.favourited} stars = {props.lyricData.userRating}
    noFavourited = {props.lyricData.noFavourited} pData = {props.pData} />
    </div>
  )
}
function ReadSideHeader(props) {

  return (
    <div className = "read-side-header-container">
      <h2 id = "song-title">{props.songTitle ? props.songTitle:"-"}</h2>
      <div id = "below-title">
      <Link to = {`/p/${props.artist}`}><h6 id = "song-artists">{props.artist ? props.artists : "-"}</h6></Link>
      <div id = "below-title-icons">
      <LyricsCardIcon className = "fas fa-eye icon-active" number = {props.views} total = "total sm" />
      <LyricsCardIcon className = "fas fa-star icon-active" number = {props.rating} total = "sm" />
      </div>
      </div>
    </div>
  )
}

function ReadPunchlines(props) {
       const [favActive,setFavActive] = useState('');
       const [noFavourited,setNoFavourited] = useState(props.noFavourited)
       useEffect(()=>{
         if(window.innerWidth > 700){
         document.getElementById("read-side-punchlines-container").style.height
         = `${window.innerHeight - 115}px`;
         document.getElementById('comments-container').style.height
         = `${window.innerHeight - 115}px`;
       }
       document.getElementById("autoscroll-container").style.height
       = `${window.innerHeight - 190}px`
         if(props.lyricData !== ""){
           for(let i = 0; i < props.stars; i++){
               let starsContainer = document.getElementById("rate-song-lyrics")
                  starsContainer.childNodes[i].classList.add('icon-active')
             }
       }

         document.getElementById("toggle-puncline-icons").click();
       setNoFavourited(props.noFavourited)
     },[props.lyricData,props.stars,props.noFavourited])

       let punchlines = []
          if(props.lyricData !== undefined){
            punchlines =  props.lyricData.map((p,indx)=>{
              let punchline = p.punchline;
              if(p.hasIcons === false) {
                punchline = p.punchline.substring(0,p.punchline.length - 3)
              }
             return (<Punchline key = {indx} punchline = {punchline} artist = {p.artist}
              indx = {indx} id = {p._id} raters = {p.rating}
              hasFire = {p.rated} userFav = {p.userFav} hasIcons = {p.hasIcons}/>
            )
           })
         }

      function checkboxChange(e) {
        let leftIcons = document.getElementsByClassName('punchline-icons');
        if(e.target.checked) {
          for(let elm of Array.from(leftIcons)) {
            elm.style.display = 'flex'
          }
        }else{
          for(let elm of Array.from(leftIcons)) {
            elm.style.display = 'none'
          }
        }
    }
    function addtoFavourites(e) {
      if(!favActive) {
        setFavActive(true)
        setNoFavourited(noFavourited + 1)
      }else {
        setFavActive(false)
        setNoFavourited(noFavourited - 1)
      }
      axios.post(BASEURL + '/favourited' + window.location.pathname)
      .then(res => {
        let message = res.data.msg;
        if(res.data.type === "SUCCESS"){
        successPrompt(message)
        }
         if(res.data.type === "ERROR"){
           if(res.data.msg === "log in required") {
             showLoginModal()
           }
           errorPrompt(message)
        }
    })
     .catch(err =>{
       errorPrompt("something went wrong")
    })
  }


    function rateSongLyricsClicked(e) {
      let numberOfStar = parseInt(e.target.id)
      let starsContainer = document.getElementById("rate-song-lyrics")
      if(starsContainer.childNodes[0].className === "fas fa-star icon-active"){
        return;
      }
      for(let i = 0; i < numberOfStar; i++){
         starsContainer.childNodes[i].classList.add('icon-active')
      }
      axios.post(`${BASEURL}/lyrics/rate/${numberOfStar}${window.location.pathname}`)
        .then(res =>{
           if(res.data.type === "ERROR") {
             if(res.data.msg === "log in required"){
               showLoginModal()
             }
            errorPrompt(res.data.msg)
          }
        })
        .catch(e =>{
          errorPrompt("something went wrong")
        })
    }

    function reportIconClicked() {
      let reports = document.getElementById("reports-container");
     reports.style.display === "block" ? reports.style.display = "none":reports.style.display = "block";
    }
   const reportSubmited = (e)=> {
     e.preventDefault()
     let first = "", second = "", third = "";
     let inputs = Array.from(document.getElementsByTagName("input")).filter(a => a.checked)
     for(let i = 0; i < inputs.length; i++){
       switch (inputs[i].name) {
         case "first":
           first = inputs[i]
           break;
         case "second":
           second = inputs[i]
           break;
         case "third":
           third = inputs[i]
           break;
         default:
           continue;
       }
     }

  axios({
       method: 'post',
       url: BASEURL + '/report' + window.location.pathname,
       data: {
         [`${first.name}`]: first.value,
         [`${second.name}`]: second.value,
         [`${third.name}`]: third.value
       }
     })
     .then(res =>{
       let message = res.data.msg;
       if(res.data.type === "SUCCESS"){
       document.getElementById("reports-container").style.display = "none"
       successPrompt(message)
   }
    if(res.data.type === "ERROR"){
      errorPrompt(message)
   }
   })
    .catch(err =>{
      errorPrompt('something went wrong')
   })
   }

  return (
    <div id= "read-side-punchlines-container">
    <EditBr />
    <AwardBr />
    <div className='read-side-controls'>
    <div className = "checkbox-container">
    <div className = "tooltip">
    <input type= "checkbox" id="toggle-puncline-icons" onChange={checkboxChange} />
    <span className ="checkmark"></span>
    <span className ="tooltiptext">toggle icons</span>
    </div>
    </div>
    <div id = "heart-down">
    <LyricsCardIcon className ={`fas fa-heart ${favActive === '' ?
    props.isInFavourites ? "icon-active":"" : favActive ? "icon-active":''}`}
    number = {noFavourited === undefined ? '-': numberToKOrM(noFavourited)} total = "total" onClick = {addtoFavourites}/>
    </div>
    <div id = "rate-song-lyrics">
    <i className= "fas fa-star" id="1" onClick = {rateSongLyricsClicked}></i>
    <i className= "fas fa-star" id="2" onClick = {rateSongLyricsClicked}></i>
    <i className= "fas fa-star" id="3" onClick = {rateSongLyricsClicked}></i>
    <i className= "fas fa-star" id="4" onClick = {rateSongLyricsClicked}></i>
    <i className= "fas fa-star" id="5" onClick = {rateSongLyricsClicked}></i>
    </div>
    <div id = "report-lyrics">
    <div className = "tooltip">
    <i className = "fas fa-info" onClick = {reportIconClicked}></i>
    <span className ="tooltiptext">report</span>
     </div>
      <form id = "reports-container" onSubmit = {reportSubmited}>
      <label><input type = "checkbox"
            value = "Wrong lyrics" name = "first"/>
            Wrong lyrics </label>
            <br/>
      <label>
      <input type = "checkbox" name = "second"
            value = "wrong punchline(s) artist refrence" />
            wrong punchline(s) artist refrence </label>
            <br/>
      <label>
      <input type = "checkbox" name = "third"
            value = "Puncline appears before it's normal position" />
            Punchline(s) appears before it's normal position  </label>
          <br/>
      <input type = "submit" id = "report-submit"/>
      </form>
   </div>
    </div>
     <AutoScroll />
      <div className = "puchline-container" id = "main">
      {punchlines}
      </div>
      <div id = "song-info">
      <h2>Artist Performance</h2>
      {props.pData.map((a,indx) => {
        return <InfoItem key = {indx} label = {a.artist}
        value = {a.points === 1 ? '1 point': a.points + ' points'}/>
      })}
      </div>
      <h2>song video</h2>
      <iframe className = "youtube-video"
      src= {"https://www.youtube.com/embed/" + props.youtubeVideo}
      title="YouTube video player" frameBorder="0" allow="accelerometer;
       autoplay; clipboard-write; encrypted-media; gyroscope;
       picture-in-picture"
        allowFullScreen></iframe>
    </div>
  )
}

function InfoItem(props) {
  return (
    <div className = "info-item-container">
    <p>{props.label}</p>
    <p className = "artist-points">{props.value}</p>
    </div>
  )
}
