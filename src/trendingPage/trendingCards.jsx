import React from 'react'
import {Link} from 'react-router-dom'

import {LyricsCardIcon} from '../Icons/allIcons.jsx'
import {IMAGEURL} from '../credentials'
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
export function ChartCardContainer(props) {
  let cls = props.show === "true" ? "chart-card-container-container chart-show": "chart-card-container-container";
  let chartCards = ""
  function getOthersPreview(others) {
    if(others !== undefined && others !== '' && others !== 'undefined'){
      if(others.length < 15) return others
      return others.substr(0,15) + '...'
    }
    return '';
  }
    if(props.param === "Songs"){
      if(props.chartResult){
      chartCards = props.chartResult.map((a,indx)=>{
      let others = getOthersPreview(a.otherArtists);
      return <ChartCard key = {indx}
      views = {!a.view ? "-": a.view}  lyricId = {a.lyricId}
       songTitle = {a.songTitle} songArtist = {a.songArtist}
        position = {indx + 1}  songArtists = {`${a.songArtist}
       ${others !== "" && others !== undefined &&
        others !== 'undefined'? `ft ${others}`:''}`}
      songCover = {a.songCover} rating = {!a.rating ? "-":a.rating }/>
    })
  }
  }else if(props.param === "Punchlines") {
    if(props.barResult){
    chartCards = props.barResult.map((p,indx)=> {
      let others = getOthersPreview(p.otherArtists);
      return <BarsCards key = {indx} punchline = {p.punchline}
       artist = {p.artist} indx = {p.punchlineId} fires = {p.fires}
        songId = {p.songId} songTitle = {p.songTitle}
        songArtist = {p.songArtist}
        artists = {`${p.songArtist}
        ${others !== "" && others !== undefined && others !== 'undefined'?
        `ft ${others}`:''}`}/>
    })
  }
  }else {
    chartCards = props.userResult.map((u,indx)=> {
      return < ChartUserCard key = {indx} name = {u.name} picture = {u.picture}
      points = {u.points} followers = {`${u.followers}`}/>
    })

  }
  return (
  <div className = {cls}  id = {props.id}>
   {chartCards}
  </div>
  )
}

function ChartCard(props){
  return (
     <div className="chart-card-container">
     <div className = "chart-item">
     <p className ="chart-position">{props.position}</p>
     </div>
     <div className = "chart-lyric-info">
     <img src = {`${IMAGEURL}${props.songCover}?tr=w-70,h-70,c-at_max`}
     className = "chart-lyric-info-image"
     alt = "artist"/>
     <div className = "chart-song-info" >
     <Link to = {`/${props.lyricId}`}><p className = "chart-song-title">
     {props.songTitle} </p></Link>
     <Link to = {`/p/${props.songArtist}`}><p className='chart-artist-name'>
     {props.songArtists}</p></Link>
     </div>
     </div>
       <div className = "chart-icons">
     <LyricsCardIcon className = "fas fa-eye icon-active" id="chart-eye-icon"
     number = {props.views}
      total = "total"/>
      <br />
     <LyricsCardIcon className = "fas fa-star icon-active" id="chart-star-icon"
     number = {props.rating} total = "total" allowClick = "true"/>
     </div>
     </div>
  )
}

export function BarsCards(props) {

  // const playAudio = (e)=> {
  //      let target = e.target
  //      if (target.className === "fas fa-play") {
  //         let audio = target.parentNode.previousSibling
  //         audio.play()
  //         target.style.display = "none"
  //         target.parentNode.nextSibling.childNodes[0].style.display = "block"
  //         audio.addEventListener("onended",()=> {
  //           console.log("onended");
  //           target.style.display = "block"
  //           target.parentNode.nextSibling.childNodes[0].style.display = "none"
  //         })
  //
  //      }else {
  //        let audio = target.parentNode.previousSibling.previousSibling
  //        target.style.display = "none"
  //        target.parentNode.previousSibling.childNodes[0].style.display = "block"
  //        audio.pause()
  //      }
  //
  // }

  const handleCopyChartBar = ()=> {
    try{
    let inp = document.createElement("input")
    inp.setAttribute('type',"text");
    inp.setAttribute("disable",true)
    inp.value = `${props.punchline} ~ ${props.songArtist} (toonji.com)`;
    document.getElementsByClassName('chart-bar-card')[0].appendChild(inp);
    inp.select();
    document.execCommand("copy")
    inp.style.display = "none";
    successPrompt("bar copied")
  }catch(e) {
    errorPrompt("bar not copied, try again.")
  }
  }

  return (
       <div className = "chart-bar-card">
         <div className = "chart-bar-header">
         <div className = "chart-bar-detail">
         <Link to = {`/${props.songId}`}>
         <h3> {props.songTitle} </h3>
         </Link>
         <Link to = {`/p/${props.songArtist}`}>
         <h6> {props.artists}</h6>
         </Link>
         </div>
         <LyricsCardIcon className = "fas fa-fire-alt icon-active"
         number = {props.fires} total = "total" />
         </div>
         <Link to = {`/${props.songId}`}>
         <p>{props.punchline}</p>
         </Link>
         <div className = "bars-card-icons-container">
         <LyricsCardIcon className = "fas fa-copy"
         onClick = {handleCopyChartBar}/>
         </div>
         <h5> ~ {props.artist}</h5>
       </div>
  )
}

function ChartUserCard(props) {

  return (
    <div className = "chart-user-card-container">
    <img  src = {`${IMAGEURL}${props.picture}?tr=w-100,h-100,c-at_max`}
    alt = "user" />
    <div className = "chart-user-card-details">
    <Link to = {`/p/${props.name}`}>
    <h3>{props.name}</h3>
    </Link>
    <div className = "chart-user-card-stats">
    <div className = "metric">
    <h5>{props.points}</h5>
    <p>points</p>
    </div>
    <div className = "metric">
    <h5>{props.followers}</h5>
    <p>followers</p>
    </div>
    </div>
    </div>
    </div>
  )
}
