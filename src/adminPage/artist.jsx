import React,{useState} from 'react'
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
import axios from 'axios'
import { trackPromise} from 'react-promise-tracker';
import {BASEURL,IMAGEURL} from '../credentials'
import {Link} from 'react-router-dom'
import LoadingSpinner from '../prompts/loadingComponent';
import './artist.css'
export default function ArtistPanel() {


  return (
    <div id ="artist-view" className = "below-head-view-container">
    <CreateVerfiedProfile/>
    <div className ="go-right">
    <SongsSection />
    </div>
    </div>
  )
}

function SongsSection() {
   const [songs,setSongs] = useState([])
   const songSearch = (e) => {
          let param = e.target.previousSibling.value;
          if(param.length < 1) return
          trackPromise(
          axios.get(BASEURL + '/songs/user/'+param)
          .then(res => {

              setSongs(res.data)

          })
          .catch(error => {
            errorPrompt(error.response?.data.msg)
          }),'songs-area')
   }
  return (
    <>
    <div id = "songs-section">
    <h3>Songs</h3>
    <div className = "others-search-container">
    <input type = "search" placeholder = "enter song title"
    className = "others-search"/>
    <button className = "others-button" onClick = {songSearch}>search</button>
    </div>
    <div className = "users-cards-container">
    <div className = "spinner-container">
    <LoadingSpinner heigth = {30} width = {30} area = 'songs-area'/>
    </div>

    {
      songs.map((a,indx)=> {
        return (
          <OthersSongCard key = {indx} songTitle = {a.songTitle}
          songImage = {a.songCover} songArtist = {a.songArtist} songId = {a.songId}/>
        )
      })
    }
    </div>
    </div>
    </>
  )
}

function OthersSongCard(props) {
  const [deleted,setDeleted] = useState(false)
  const deleteSong = () => {
   if(!window.confirm(`sure want to delete the song ${props.songTitle} by ${props.songArtist}?`)) return
    axios.post(BASEURL + '/songs/delete/'+props.songId)
    .then(res => {
        setDeleted(true)
        successPrompt(res.data.msg)
    })
    .catch(e => {
      errorPrompt(e.response?.data.msg)
    })
  }

const editSong = (e) => {
 document.getElementById("others-view").style.display = "none"
 document.getElementById("others").classList.remove('side-bar-item-active')
 document.getElementById("edit-view").style.display = "block"
 document.getElementById("edit").classList.add('side-bar-item-active')
 document.getElementById("edit-song-search").value = props.songId
}

  return (
    <div className = "report-song-container">
    <div className = "report-details">
    <img className = "report-image"
    src = {`${IMAGEURL}${props.songImage}`}
    alt="song's cover" />
    <div className = "report-details-text">
    <Link to={`/${props.songId}`}><h3>{props.songTitle}</h3></Link>
    <h5>{props.songArtist}</h5>
    </div>
    </div>
    <div className = "user-card-actions">
    <button className = "user-card-action"
     onClick = {deleteSong}>{deleted ? "deleted":"delete"}</button>
    <button className = "user-card-action"
     onClick = {editSong}>edit</button>
    </div>
    </div>
  )
}

function CreateVerfiedProfile(){
    const [name,setName] = useState('')
    const [bio,setBio] = useState('')
    const [picture,setPicture] = useState('')
  function handleChange(e) {
            switch (e.target.id) {
              case "verified-profile-file":
              let myimg = document.getElementById("verified-profile-photo");
               let input = document.getElementById("verified-profile-file");
               setPicture(input.files[0])
               if (input.files && input.files[0]) {
                 let reader = new FileReader();
                 reader.readAsDataURL(input.files[0]);
                 reader.onload = function (e) {
                   myimg.src = e.target.result;
                 }
               }
                break;
              case "verified-profile-name":
                 setName(e.target.value)
                break;
              case "verified-profile-bio":
                if(e.target.value.length < 127){
                  setBio(e.target.value)
                };
                break;
              default:
                 return
            }
          }
  function handleFileChangeFinish() {
    let myimg = document.getElementById("verified-profile-photo");
     let input = document.getElementById("verified-profile-file");
     if (input.files && input.files[0]) {
       var reader = new FileReader();
       reader.readAsDataURL(input.files[0]);
       reader.onload = function (e) {
         try {
           myimg.src = e.target.result;
         } catch (e) {
         }
       }
     }
  }
  const handleEditSubmit = (e) => {
    e.preventDefault()
     const formData = new FormData()
     formData.append("name",name);
     formData.append("bio",bio);
     formData.append("picture",picture)
     document.getElementById("add-artist").style.display = "none"
    trackPromise(
    axios({
      method: 'post',
      url: BASEURL + '/c/users/create-verified-profile',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then((res)=>{
      document.getElementById("add-artist").style.display = "block"
         successPrompt(res.data.msg)
  })
   .catch(e=>{
    errorPrompt(e.response?.data.msg)
  }),'add-verified-artist')
  }
 return (
   <div id = "verified-profile-main" >
   <h4>ADD NEW ARTIST</h4>
   <div id = "verified-profile-container">
   <img src = '/star.png' id = "verified-profile-photo" alt = "artist" />
   <form id='verified-profile-form' onSubmit = {handleEditSubmit}>
   <input type="file" id = "verified-profile-file" onChange = {handleChange}
   aria-label= "change your profile picture"/><br/>
   <input type="text" placeholder = "enter name" className = "verified-profile field"
   aria-label = "change your profile name" id = "verified-profile-name"
   onChange = {handleChange} value = {name} /><br/>
   <textarea placeholder = "bio" className = "verified-profile textArea"
   aria-label = "change your profile bio" id = "verified-profile-bio"
   onChange = {handleChange} value = {bio}></textarea><br/>
   <LoadingSpinner height = {30} width = {30}
    area = 'add-verified-artist' />
   <input type="submit" value="Add Artist" id = 'add-artist' className = "verified-profile button"
   aria-label = "submit edit profile changes" onClick = {handleFileChangeFinish}/>
   </form>
   </div>
   </div>

 )
}
