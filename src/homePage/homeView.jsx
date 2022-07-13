import React,{useState,useEffect} from 'react';
import axios from 'axios'
import {Helmet} from "react-helmet";
import { trackPromise} from 'react-promise-tracker';
import {errorPrompt} from '../prompts/promptMessages'

import LyricsReviewCard from './lyricsCard.jsx';
import './homeViewCss.css';
import {BASEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent';
axios.defaults.withCredentials = true

export default function HomeView() {
  const [data, setData] = useState({songs:[],newArrivals:[]})

     useEffect(()=> {
       let msg  = "TOONJI, THE BEST SONGS LYRICS PLATFORM."
       let i = 0;
       let str = ""
       let interval = window.setInterval(()=> {
         if(i < msg.length) {
           str += msg[i];
           document.getElementById("welcome-message").innerText = str
           i++
         }
       },100)
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
    axios.get('https://extreme-ip-lookup.com/json/?key=vm2uFXo6jpC3POq9ZHQF',{withCredentials: false})
    .then(res => {
       localStorage.setItem("continent",res.data.continent)
     })
    .catch( _err => {
      console.log(_err)
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
    <title>Toonji | Enjoy music lyrics the best way with Toonji</title>
    <meta name="description"
    content="Toonji is the best song lyrics platform. Rate bars, take quizes based on your favorite artites lyrics, see bars breakdowns, compete with friends in real-time on songs lyric and more" />
     <meta name="keywords" content="toonji, toonji lyrics, best lyrics platform, song lyrics, music lyrics, artist top fans, lyrics-quize, rate bars" />
    </Helmet>
    </>
  )
}
