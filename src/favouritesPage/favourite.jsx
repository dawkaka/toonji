import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { trackPromise} from 'react-promise-tracker';
import {Helmet} from 'react-helmet'
import {Link} from 'react-router-dom'

import {errorPrompt,successPrompt,showLoginModal} from '../prompts/promptMessages'
import "./favouriteCss.css";
import {Logo} from '../header-footer/header'
import LyricsReviewCard from '../homePage/lyricsCard';
import {BASEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent';
import {LyricsCardIcon} from '../Icons/allIcons'

export default function Favourite() {
const [favData,setFavData] = useState([])
const [favBars,setFavBars] = useState([])
const [favParam,setFavParam] = useState('songs')

  useEffect(()=>{
    trackPromise(
     axios.get(BASEURL + '/my/favourites/' + favParam)
       .then((res)=>{
       favParam === "songs" ? setFavData(res.data) : setFavBars(res.data)
     })
     .catch(err => {
       if(err.response?.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
     })
  )
},[favParam])

  let lyricsList,barsList;
  if(favParam === "songs"){
     lyricsList = favData.map((a,indx)=> {
    return  <LyricsReviewCard key = {indx} songId = {a.songId}
    hottesBar = {a.barPreview} songTitle = {a.songTitle}
    songArtist = {a.songArtist} fullHottestBar = {a.hottesBar}
    fires = {`${a.fires}`} cover = {a.songCover}
    views = {`${a.views}`} isInFavourites = {a.isFav} raters = {a.raters}
    comments = {`${a.comments}`} rating = {a.rating} otherArtist = {a.otherArtists}
    favourited = {a.favourited}/>
  })
}else if (favParam === "bars") {
  function getOthersPreview(others) {
    if(others !== undefined && others !== '' && others !== 'undefined'){
      if(others.length < 15) return others
      return others.substr(0,15) + '...'
    }
    return '';
  }
  barsList = favBars.map((p,indx) => {
    let others = getOthersPreview(p.otherArtists);
    return <FavouriteBarCard key = {indx} punchline = {p.bar}
      artist = {p.saidBy} id = {p.id}
      songId = {p.songId} songTitle = {p.songTitle}
      songArtist = {p.songArtist} userFav = {p.userFav}
      artists = {`${p.songArtist}
      ${others !== "" && others !== undefined && others !== 'undefined'?
      `ft ${others}`:''}`}/>
  })
}
const handleSelectChange = (e) => {
   setFavParam(e.target.value)
}

  return (
   <>
   <FavouritesHeader />
   <div id = "f-space-1"></div>
   <div id = "home-view-container">
   <select id = "favourites-select" onChange = {handleSelectChange}>
   <option>songs</option>
   <option>bars</option>
   </select>
   <LoadingSpinner height = {80} width = {80}/>
   <div className = "favourite-lyrics-container show-lyrics">
    {lyricsList}
    </div>
    <div id = "favourite-bar-container">
    {barsList}
    </div>
    <div id= "f-space-2"></div>
   </div>
   <Helmet>
   <title>Favorite lyrics and bars</title>
   <meta name = "description" content = "Your favorite song lyrics and bars all in one place." />
   </Helmet>
   </>
  )
}
function FavouritesHeader() {

  return (
    <div className = "trending-header-container">
     <Logo />
     <Search />
    </div>
  )
}



function FavouriteBarCard(props) {
  const [userFav,setUserFav] = useState(props.userFav)

  const handleCopyChartBar = ()=> {
    try{
    let inp = document.createElement("input")
    inp.setAttribute('type',"text");
    inp.setAttribute("disable",true)
    inp.value = `${props.punchline} ~ ${props.songArtist} (toonji.com)`;
    document.getElementById('favourite-bar-container').appendChild(inp);
    inp.select();
    document.execCommand("copy")
    inp.style.display = "none";
    successPrompt("bar copied")
  }catch(e) {
    errorPrompt("bar not copied, try again.")
   }
  }

  const addBarToFavourites = () => {
     axios.post(`${BASEURL}/bar-favourited/${props.songId}/${props.id}`)
     .then(res => {
        let message = res.data.msg
          setUserFav(!userFav)
          successPrompt(message)
     })
     .catch(err => {
       if(err.response?.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
     })
  }

  return (
    <div className = "fav-bars-card">
    <div className = "fav-bar-header">
    <div className = "fav-bar-detail">
    <Link to = {`/${props.songId}`}>
    <h3> {props.songTitle} </h3>
    </Link>
    <Link to = {`/p/${props.songArtist}`}>
    <h6>{props.artists}</h6>
    </Link>
    </div>
    </div>
    <p>{props.punchline}</p>
    <div className = "fav-bars-icons-container">
    <LyricsCardIcon className = "fas fa-copy"
    onClick = {handleCopyChartBar}/>
    <LyricsCardIcon className = {userFav ? "fas fa-heart icon-active":"fas fa-heart"} onClick = {addBarToFavourites}/>
    </div>
    <h5> ~ {props.artist}</h5>
    </div>
  )
}

function Search() {
  const favouriteSearch = (e) => {
    let searchValue = e.target.value;
    let len = searchValue.length;
    let songs = document.getElementsByClassName("home-song-title")
      for(let elm of Array.from(songs)) {
        let title = elm.innerText.toLowerCase()
        if(searchValue.toLowerCase() === title.substr(0,len) && len>0){
          elm.style.backgroundColor = "var(--main-color)"
        }else {
          elm.style.backgroundColor = "transparent"
        }
      }
  }
  return(
    <form className = "trending-header-form">
       <input className="trending-search-box" type="search"
       placeholder="search favourites" aria-label="Search"
       onChange = {favouriteSearch}/>
     </form>
  )
}
