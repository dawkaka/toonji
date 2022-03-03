import React,{useEffect,useState} from 'react';
import './uploadCss.css';
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
import axios from 'axios'
import { trackPromise,usePromiseTracker} from 'react-promise-tracker';
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'
import FormObject from 'form-data'
export default function EditSongs() {
   useEffect(()=> {

   })
  return (
    <div className = "below-head-view-container">
    <EditForm />
    </div>
  )
}

export function EditForm(props) {
    const [songLyrics, setSongLyrics] = useState("write song lyrics here and put ';' between punchlines");
    const { promiseInProgress } = usePromiseTracker({area: 'edit-song'});
    const [artist,setArtist] = useState('')
    const [songTitle,setSongTitle] = useState('')
    const [songGenre,setSongGenre] = useState('')
    const [producer,setProducer] = useState('')
    const [otherArtists,setOtherArtists] = useState('')
    const [releaseDate,setReleaseDate] = useState('')
    const [cover,setCover] = useState('')
    const [writers,setWriters] = useState('')
    const [youtube,setYoutube] = useState('')

    useEffect(()=> {
      let start = window.location.pathname.lastIndexOf("/")
      let searchP = window.location.pathname.substr(start + 1)

      axios.get(`${BASEURL}/edit-lyrics/${searchP}`)
        .then(res => {
            let {artist,songTitle,songGenre,lyrics,
               otherArtists,producer,releaseDate,writers,youtubeVideo} = res.data;
            setArtist(artist)
            setProducer(producer)
            setSongGenre(songGenre)
            setOtherArtists(otherArtists)
            setReleaseDate(releaseDate)
            setSongTitle(songTitle)
            setYoutube(youtubeVideo)
            setWriters(writers)
            let lyric = ``
            for(let i = 0; i < lyrics.length; i++) {
              lyric += lyrics[i].punchline
              if(i !== lyrics.length - 1){
                lyric += ';\n'
              }
            }
            setSongLyrics(lyric)
        })
        .catch(err => {
            errorPrompt(err.response?.data.msg)
        })
    },[])

  function handleInputChange(e) {
    switch (e.target.id) {
      case "edit-artist-name":
         setArtist(e.target.value)
        break;
      case "edit-song-title":
         setSongTitle(e.target.value)
        break;
      case "edit-song-tags":
          setSongGenre(e.target.value)
        break;
      case "edit-featured-acts":
          setOtherArtists(e.target.value)
      break;
      case "edit-song-producer":
          setProducer(e.target.value)
        break;
      case "edit-release-date":
          setReleaseDate(e.target.value)
        break;
      case "song-video":
          setYoutube(e.target.value)
        break;
      case "song-writers":
          setWriters(e.target.value)
        break;
      case "edit-picture-field":
        setCover(e.target.files[0]);
        break;
      default:
         return;
    }
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
     formData.append("writers",writers)
     formData.append("youtubeVideo",youtube)

     let start = window.location.pathname.lastIndexOf("/")
     let searchP = window.location.pathname.substr(start + 1)
  trackPromise(
    axios({
      method: 'post',
      url: BASEURL + '/edit-lyrics/'+searchP,
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then((res)=>{
      let message = res.data.msg
      if(res.data.type === "SUCCESS"){
    setArtist('');setSongTitle('');setSongGenre("");setProducer("");setOtherArtists('');
    setReleaseDate('');setYoutube(""); setWriters("")
    successPrompt(message)
  }
  })
   .catch((err)=>{
       errorPrompt(err.response?.data.msg)
  }),'edit-song')
}

const handleTextArea = (e)=>{
  setSongLyrics(e.target.value)
}
  return (
  <>
  <form id="edit-lyric-form"  onSubmit = {handleSubmit}>
  <div id= "textArea-container">
  <UploadTextArea handleTextChange = {handleTextArea}
   value = {songLyrics}/>
  </div>
  <div id = "fields-area-container">
  <div className = "input-container">
  <label htmlFor="upload-song-title">song title</label> <br/>
  <input type = "text" id= "edit-song-title" name="songTitle" value = {songTitle}
  className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="artist-name">artist name</label><br />
  <input type = "text" id= "edit-artist-name" name="artist" value = {artist}
   className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="featured-acts">artist(s) featured</label><br />
  <input type = "text" id= "edit-featured-acts" name="otherArtists" value = {otherArtists}
  className = "upload-input-field" onChange={handleInputChange}/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-producer">song producer</label><br />
  <input type = "text" id= "edit-song-producer" name="producer" value = {producer}
  className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="release-date">release date</label><br />
  <input type = "date" id= "edit-release-date" name="releaseDate" value = {releaseDate}
  className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-video">yoube video link</label><br />
  <input type = "text" id= "song-video" name="youtubeVideo"
   className = "upload-input-field" value = {youtube} onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-writers">song writers</label><br />
  <input type = "text" id= "song-writers" name="writers"
   className = "upload-input-field" value = {writers}
   onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="song-tags">song tags</label><br />
  <input type = "text" id= "edit-song-tags" name="songGenre" value = {songGenre}
   className = "upload-input-field" onChange={handleInputChange} required/>
  </div>
  <div className = "input-container">
  <label htmlFor="file-field">song cover <small>(.jpg)</small></label><br/>
  <input type = "file" id= "edit-picture-field" name="cover"
  className = "upload-input-field file-field" onChange={handleInputChange}/>
  <small>image can not be greater than 3Mb </small>
  </div>
  <LoadingSpinner height = {30} width = {30} area = 'edit-song'/>
  {!promiseInProgress && <button id = "edit-button"  type = "submit">
  Update<i className = 'fas fa-upload'></i>
  </button>}
  </div>
    </form>
    </>
)
}

function UploadTextArea(props) {

   useEffect(()=>{
     document.getElementById("edit-textarea").style.height =
     `${window.innerHeight - 120}px`;
   })
  return (
    <textarea name = "lyrics" id = "edit-textarea"
     className = "big-textarea"
     onChange = {props.handleTextChange} value={props.value}>
     </textarea>
  )
}
