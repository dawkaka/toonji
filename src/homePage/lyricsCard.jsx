import React,{useState} from 'react';
import './lyricsCardCss.css'
import {LyricsCardIcon} from '../Icons/allIcons.jsx'
import {Link} from "react-router-dom"
import {BASEURL,IMAGEURL} from '../credentials'
import {numberToKOrM} from './homeFunctions'
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import axios from 'axios'
export default function LyricsReviewCard(props) {
   const [favActive,setFavActive] = useState(props.isInFavourites);
   const [noFavourited,setNoFavourited] = useState(props.favourited)

  function handleAddToFavourites(e){
    axios.post(BASEURL + '/favourited/' + props.songId)
    .then(res => {
      let message = res.data.msg
      if(res.data.type === "SUCCESS"){
        if(message === "added to favourites"){
          setFavActive(true)
          setNoFavourited(noFavourited + 1)
        }else {
          setFavActive(false)
          setNoFavourited(noFavourited - 1)
        }
    successPrompt(message)
  }
   if(res.data.type === "ERROR"){
     if(message === 'log in required') {
       showLoginModal()
     }
    errorPrompt(message)
  }
  })
   .catch((err)=>{
     errorPrompt("something went wrong")
  })
}

   // function playAudio(e) {
   //     if (e.target.className === "fas fa-play") {
   //        let targetAudio = e.target.parentNode.parentNode.parentNode.parentNode.nextSibling
   //        let pauseIcon = e.target.parentNode.nextSibling
   //        e.target.style.display = "none"
   //        pauseIcon.childNodes[0].style.display = "block"
   //        targetAudio.play()
   //     }else {
   //       let targetAudio = e.target.parentNode.parentNode.parentNode.parentNode.nextSibling
   //       let playIcon = e.target.parentNode.previousSibling
   //       e.target.style.display = "none"
   //       playIcon.childNodes[0].style.display = "block"
   //       targetAudio.pause()
   //     }
   // }

  function copyPunchline(e) {
    try{
    let inp = document.createElement("input")
    inp.setAttribute('type',"text");
    inp.setAttribute("disable",true)
    inp.value = `${props.fullHottestBar} ~ ${props.songArtist} (toonji.com)`;
    document.getElementById("home-view-container").appendChild(inp);
    inp.select();
    document.execCommand("copy")
    inp.style.display = "none";
    successPrompt("bar copied")
  }catch(e) {
    errorPrompt("bar not copied")
  }
  }
   function getOthersPreview(others) {
     if(others !== undefined && others !== '' && others !== 'undefined'){
       if(others.length < 15) return others
       return others.substr(0,15) + '...'
     }
     return '';
   }
   let others = getOthersPreview(props.otherArtist)
  return (
   <div className="lyrics-card-container">
   <div className= "image-and-gradient-container">
    <img src = {`${IMAGEURL}${props.cover}?tr=w-250,h-250,c-at_max`} className = "artist-image" alt = "artist" />
    <div className = "card-gradient"></div>
    </div>
    <div className = "song-info">
    <Link to = {'/'+props.songId}><h4 className = "home-song-title">{props.songTitle}</h4></Link>
    <Link to = {'/p/'+props.songArtist}> <span className='artist-name'>{props.songArtist}
    {others !== '' ? ` ft ${others}`:''}
       </span></Link>
    <i className= "fas fa-star" id = "card-star"><span>{props.rating}</span></i>
    </div>
    <Link to = {'/'+props.songId}>
    <div className = "punchline-block">
    <p className="hottest-bar">
    {props.hottesBar}
    </p>
    </div>
    </Link>
    <div className = "lyrics-card-icons-container">
    <div className = "left-side">
     <LyricsCardIcon className = 'fas fa-copy' id="copy-punchline"
     onClick = {copyPunchline} />
     <LyricsCardIcon
     className = {`fas fa-heart ${favActive === '' ?
     props.isInFavourites ? "icon-active":"" : favActive ? "icon-active":''}`}
     onClick = {handleAddToFavourites} songId = {props.songId}
      number = {numberToKOrM(noFavourited)} total = "total"/>
     </div>
     <div className = "right-side">
     <LyricsCardIcon className = "fas fa-comment icon-active" id="comment-icon"
     number= {props.comments} total = "total"/>
     <LyricsCardIcon className = "fas fa-eye icon-active" id="eye-icon" number = {props.views}
     total = "total"/>
     <LyricsCardIcon className = "fas fa-fire-alt icon-active" id="fire-icon"
     number = {props.fires}  total = "total" />
     </div>
    </div>
    <audio>
     <source src = "Beautiful-Africa.mp3" type = "audio/mpeg" />
    </audio>
   </div>

  )
}
