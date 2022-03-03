import React,{useState} from 'react'
import './others.css'
import './reportsCss.css'
import axios from 'axios'
import {trackPromise} from 'react-promise-tracker';
import {BASEURL,IMAGEURL} from '../credentials'
import {Link} from 'react-router-dom'
import LoadingSpinner from '../prompts/loadingComponent';
import {errorPrompt,successPrompt} from '../prompts/promptMessages'
import EditProfile from '../profilePage/editProfile'
export default function Others() {

  return (

    <div id ="others-view" className = "below-head-view-container">
    <div id = "users-songs-section-container">
    <UsersSection />
    <SongsSection />
    </div>
    </div>
  )
}

function UsersSection() {
  const [users,setUsers] = useState([])
  const [editUser,setEditUser] = useState({
    name:'',
    bio:'',
    pic:''
  })
  const userSearch = (e) => {
         let param = e.target.previousSibling.value;
         if(param.length < 1) return
         trackPromise(
         axios.get(BASEURL + '/users/'+param)
         .then(res => {
             setUsers(res.data)
         })
         .catch(e => {
           errorPrompt(e.response?.data.msg)
         })
       )
  }

  function updateUser(userInfo){
    setEditUser(userInfo)
  }
  return (
    <>
    <EditProfile name = {editUser.name}
    bio = {editUser.bio} picture = {editUser.pic} reqURL = {BASEURL + '/admin/profile/edit-profile'}/>
    <div id = "users-section">
    <h3>Users</h3>
    <div className = "others-search-container">
    <input type = "search" placeholder = "enter user name"
    className = "others-search"/>
    <button className = "others-button" onClick = {userSearch}>search</button>
    </div>
    <div className = "users-cards-container">
    <div className = "spinner-container">
    <LoadingSpinner heigth = {30} width = {30}/>
    </div>
    {
      users.map((a,indx) => {

        return (
          <OthersUserCard key = {indx} userName = {a.name} userImage = {a.picture}
           verified = {a.verified} bio = {a.bio}
          updateUser = {updateUser}/>
        )
      })
    }
    </div>
     </div>
     </>
  )
}

function OthersUserCard(props) {
   const [verified,setVerified] = useState(props.verified)
   const [deleted,setDeleted] = useState(false)
   const verifyUserClicked = () => {
     axios.post(BASEURL + '/users/verify/'+props.userName)
     .then(res => {
       let msg = res.data.msg;
         setVerified(!verified)
         successPrompt(msg)
     })
     .catch(e => {
       errorPrompt(e.response?.data.msg)
     })
   }
   const deleteUser = () => {
    if(!window.confirm("are you sure you want to delete this user?")) return
     axios.post(BASEURL + '/users/delete/'+props.userName)
     .then(res => {
         setDeleted(true)
         successPrompt(res.data.msg)
     })
     .catch(e => {
       errorPrompt(e.response?.data.msg)
     })
   }
   let userInfo = {
     name: props.userName,
     bio: props.bio,
     pic: props.userImage
   }
  return (
    <div className = "report-song-container">
    <div className = "report-details">
    <img className = "report-image"
    src = {IMAGEURL + props.userImage} alt="user's" />
    <div className = "report-details-text">
    <Link to={`/p/${props.userName}`}><h3>{props.userName}</h3></Link>
    <h5>profile</h5>
    </div>
    </div>
    <div className = "user-card-actions">
    <button className = "user-card-action"
     onClick = {deleteUser}>{deleted ? "deleted":"delete"}</button>
    <button className = "user-card-action"
     onClick = {verifyUserClicked}>{verified ? "unverify":"verify"}</button>
    <button className = "user-card-action" onClick = {() => {
      document.getElementById('edit-profile-main').style.display = "block"
      props.updateUser(userInfo)
    }
    }>edit</button>
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
          axios.get(BASEURL + '/songs/title/'+param)
          .then(res => {
              setSongs(res.data)
          })
          .catch(e => {
            errorPrompt(e.response?.data.msg)
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
