import React,{useState,useEffect} from 'react';
import axios from 'axios'
import {Helmet} from "react-helmet";
import { trackPromise} from 'react-promise-tracker';
import {errorPrompt} from '../prompts/promptMessages'

import LyricsReviewCard from './lyricsCard.jsx';
import './homeViewCss.css';
import {BASEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent';

export default function HomeView() {
  const [data, setData] = useState({songs:[],newArrivals:[]})

     useEffect(()=> {
       document.title = "TOONJI |Best song lyrics platform"
       let msg  = "TOONJI, BEST SONGS LYRICS PLATFORM."
       let i = 0;
       let str = ""
       let interval = window.setInterval(()=> {
         if(i < msg.length) {
           str += msg[i];
           document.getElementById("welcome-message").innerText = str
           i++
         }
       },100)
       axios.defaults.withCredentials = true
    if(!sessionStorage.getItem("home_data")){
       trackPromise(
          axios.get(BASEURL)
          .then(res => {
              setData(res.data);
              sessionStorage.setItem("home_data",JSON.stringify(res.data))
          })
          .catch(err =>{
              errorPrompt(err.response?.data.msg)
          }),'recommended')
        }else {
          setData(JSON.parse(sessionStorage.getItem("home_data")))
        }

    return ()=> {
      clearInterval(interval)
    }
  },[])

  useEffect(()=> {
    if(!localStorage.getItem("continent")){
    fetch('https://extreme-ip-lookup.com/json/')
    .then( res => res.json())
    .then(response => {
       localStorage.setItem("continent",response.continent)
     })
    .catch((data) => {
    })
   }
  },[])

  window.addEventListener("load",()=> {
     sessionStorage.clear()
  })

  const lyricsList = data.songs.map((a,indx)=> {
    return <LyricsReviewCard key = {indx} songId = {a.songId}
    hottesBar = {a.barPreview} songTitle = {a.songTitle}
    songArtist = {a.songArtist} fullHottestBar = {a.hottesBar}
    fires = {`${a.fires}`} cover = {a.songCover}
    views = {`${a.views}`} isInFavourites = {a.isFav} raters = {a.raters}
    comments = {`${a.comments}`} rating = {a.rating} otherArtist = {a.otherArtists}
    favourited = {a.favourited}/>
  })
  const newLyricsList = data.newArrivals.map((a,indx)=> {
    return <LyricsReviewCard key = {indx} songId = {a.songId}
    hottesBar = {a.barPreview} songTitle = {a.songTitle}
    songArtist = {a.songArtist} fullHottestBar = {a.hottesBar}
    fires = {`${a.fires}`} cover = {a.songCover}
    views = {`${a.views}`} isInFavourites = {a.isFav} raters = {a.raters}
    comments = {`${a.comments}`} rating = {a.rating} otherArtist = {a.otherArtists}
    favourited = {a.favourited}/>
  })

  return (
    <>
    <div id = "the-big-picture-container">
    <img src = "./theBigPicture.jpg" alt = "Toonji's artist of the week"/>
    <h1 id = "welcome-message"></h1>
    </div>
    <hr />
    <div id="home-view-container">
    <div className="recommended-container">
    <h2>Recommended</h2>
    <LoadingSpinner height = {80} width = {80} area = 'recommended'/>
    <div className="recommended-lyrics show-lyrics">
     {lyricsList}
    </div>
    </div>
    <div className="new-arrivals-container show-lyrics">
    <h2>New arrivals</h2>
    <LoadingSpinner height = {80} width = {80} area = 'new-arrivals'/>
    <div className="new-arrivals-lyrics">
    {newLyricsList}
    </div>
    </div>
    </div>
    <Helmet>
    <meta name="description"
    content="Toonji, a website made for Ksi's songs lyrics. Provide breakdowns, Rate punchlines, Rate lyrics, Add comments and see artists performance on a song" />
    </Helmet>
    </>
  )
}
