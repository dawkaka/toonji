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
       document.title = "TOONJI | Home for ksi's songs lyrics"
       let msg  = "TOONJI, HOME FOR KSI'S SONGS LYRICS."
       let i = 0;
       let str = ""
       window.setInterval(()=> {
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
            if(res.data.type === 'ERROR'){
              errorPrompt(res.data.msg)
            }else{
              setData(res.data);
              sessionStorage.setItem("home_data",JSON.stringify(res.data))
            }
          })
          .catch(err =>{
            errorPrompt("something went wrong")
          }),'recommended')
        }else {
          setData(JSON.parse(sessionStorage.getItem("home_data")))
        }


    return ()=> {
      i = 1000000
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
    <img src = "./theBigPicture.jpg" alt = "ksi's main"/>
    <h1 id = "welcome-message">TUNJI, HOME FOR KSI'S SONGS LYRICS</h1>
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
