import React,{useEffect,useState} from 'react';
import {Logo} from '../header-footer/header';
import './uploadCss.css';
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
import {trackPromise,usePromiseTracker } from "react-promise-tracker";
import axios from 'axios'
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'
import FormObject from 'form-data'

export default function Upload() {
  return (
    <div id= "upload-view">
    <div className = "below-head-view-container" >
    <UploadForm />
    </div>
    </div>
  )
}

export function UploadHeader() {
  return (
    <div className = "trending-header-container">
    <Logo />
    </div>
  )
}

export function UploadForm(props) {
  const [songLyrics, setSongLyrics] = useState(`write song lyrics here and put ';'
  between punchlines`);
  const {promiseInProgress} = usePromiseTracker({area: 'upload-song'})
    const [artist,setArtist] = useState('')
    const [songTitle,setSongTitle] = useState('')
    const [songGenre,setSongGenre] = useState('')
    const [producer,setProducer] = useState('TBD')
    const [otherArtists,setOtherArtists] = useState('')
    const [releaseDate,setReleaseDate] = useState('')
    const [cover,setCover] = useState('')
    const [writers,setWriters] = useState('TBD')
    const [youtube,setYoutube] = useState('TBD')
  function handleInputChange(e) {
    switch (e.target.name) {
      case "artist":
         setArtist(e.target.value)
        break;
      case "songTitle":
         setSongTitle(e.target.value)
        break;
      case "songGenre":
          setSongGenre(e.target.value)
        break;
      case "otherArtists":
          setOtherArtists(e.target.value)
      break;
      case "producer":
          setProducer(e.target.value)
        break;
      case "releaseDate":
          setReleaseDate(e.target.value)
        break;
      case "youbute":
          setYoutube(e.target.value)
        break;
      case "writers":
          setWriters(e.target.value)
        break;
      case "cover":
        setCover(e.target.files[0]);
        break;
      default:
         return;
    }
  }


    const handleTextArea = (e)=>{
      setSongLyrics(e.target.value)
    }

  function handleSubmit(e) {
    e.preventDefault()
     const formData = new FormObject()
     formData.append("cover",cover)
     formData.append("releaseDate",releaseDate)
     formData.append("otherArtists",otherArtists)
     formData.append("producer",producer)
     formData.append("artist",artist)
     formData.append("songTitle",songTitle)
     formData.append("songGenre",songGenre)
     formData.append("lyrics",songLyrics)
     formData.append("youtubeVideo",youtube)
     formData.append("writers",writers)

  trackPromise(
    axios({
      method: 'post',
      url: BASEURL + '/upload-lyrics',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then((res)=>{
      let message = res.data.msg
      if(res.data.type === "SUCCESS"){
    setArtist('');setSongTitle('');setSongGenre("");setProducer("");setOtherArtists('');
    setReleaseDate('');setWriters('');setYoutube("")
    successPrompt(message)
  }
   if(res.data.type === "ERROR"){
     errorPrompt(message)
  }
  })
   .catch((err)=>{
     errorPrompt("something went wrong")
  }),'upload-song')
}

  return (
  <form id="upload-form"  onSubmit = {handleSubmit}>
  <div id= "textArea-container">
  <UploadTextArea handleChange = {handleTextArea} value = {songLyrics}/>
  </div>
  <div id = "fields-area-container">
  <div className = "input-container">
  <label htmlFor="upload-song-title">song title</label> <br/>
  <input type = "text" id= "song-title" name="songTitle"
  className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="artist-name">artist name</label><br />
  <input type = "text" id= "artist-name" name="artist"
   className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="featured-acts">artist(s) featured</label><br />
  <input type = "text" id= "featured-acts" name="otherArtists"
  className = "upload-input-field" onChange={handleInputChange}/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-producer">song producer</label><br />
  <input type = "text" id= "song-producer" name="producer"
  className = "upload-input-field" defaultValue = {producer} onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="release-date">release date</label><br />
  <input type = "date" id= "release-date" name="releaseDate"
  className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-video">yoube video link</label><br />
  <input type = "text" id= "song-video" name="youtubeVideo"
   className = "upload-input-field" defaultValue = {youtube} onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-writers">song writers</label><br />
  <input type = "text" id= "song-writers" name="writers"
   className = "upload-input-field" defaultValue = {writers}
   onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-tags">song tags</label><br />
  <input type = "text" id= "song-tags" name="songGenre"
   className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="file-field">song cover <small>(.jpg)</small></label><br/>
  <input type = "file" id= "picture-field" name="cover"
  className = "upload-input-field file-field" onChange={handleInputChange} required/>
  <small>image can not be greater than 3Mb </small>
  </div>
  <LoadingSpinner height = {30} width = {30} area = 'upload-song'/>
  {!promiseInProgress && <button id = "upload-button"  type = "submit">
  UPLOAD<i className = 'fas fa-upload'></i>
  </button>}
  </div>
    </form>
)
}

function UploadTextArea(props) {

   useEffect(()=>{
     document.getElementById("upload-textarea").style.height =
     `${window.innerHeight - 120}px`;
   })
  return (
    <textarea name = "lyrics" id = "upload-textarea" className = "big-textarea"
     onChange = {props.handleChange} value={props.value}>
     </textarea>
  )
}
