import React,{useState,useEffect} from 'react'
import './headerCss.css'
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
import axios from 'axios'
import {LyricsCardIcon} from '../Icons/allIcons'
import {BASEURL} from '../credentials'
// import trackPromise from 'react-promise-tracker'
import {Link} from 'react-router-dom'
export default function Header(props) {
  const [notifs, setNotifs] = useState({followers:[],awards:[],likes:[],upvotes:[],others:[]})
  const [numOfNotifs,setNumOfNotifs] = useState(0)
   useEffect(()=> {
            axios.get(BASEURL + "/p/notifications")
            .then(res => {
              if(!res.data.type) {
                let newData = Object.assign(notifs,res.data)
                setNotifs(newData)
                setNumOfNotifs(res.data.followers.length  + res.data.awards.length +
                               res.data.likes.length + res.data.upvotes.length +
                               res.data.others.length)
              }
            })
            .catch(e => {
            })
   },[notifs])

  return (
    <>
   <HeaderPopLeft isSignedIn = {props.isSignedIn}
   handleSignedOut = {props.handleSignedOut} numOfNotifs = {numOfNotifs} />
   <NotifsMessages notifs = {notifs} hasNotifs = {numOfNotifs}/>
   <div className = "header-container">
   <Logo />
   <Search />
   <div className = "signup-login-button-container">
    <Humburger />
    {props.isSignedIn ? "" : <SignUp />}
    {props.isSignedIn ? "": <Login />}
    {props.isSignedIn ? <LogOut handleSignedOut = {props.handleSignedOut}/>: ""}
    <Notifs hasNotifs = {numOfNotifs} />
    <Donate />
    </div>
   </div>
   </>
  )
}


export function Logo() {

  return (
    <div className = "logo">
    <img src = "/logo.png" alt = "toonji logo" />
    </div>
  )
}

export function Search() {
       const [searchParam,setSearchParam] = useState('')
       const [searchResult,setSearchResult] = useState('');
       useEffect(()=>{
         if(searchParam.length > 0){
                axios.get(`${BASEURL}/search/${searchParam}`)
                .then((res)=>{
                 setSearchResult(res.data)
              })
               .catch((err)=>{
                 let prompt = document.getElementById("prompt");
                 document.getElementById("message").innerText = err.response?.data.msg
                 prompt.className = "prompt-container animation errorBorder"
                 console.log("done");
                 window.setTimeout(()=>{
                   prompt.className = "prompt-container"
                 },5001)
              })
            }else {
              setSearchResult("")
            }
       },[searchParam])

      const handleSearchChange = (e) => {
         setSearchParam(e.target.value)
      }
      let fetchedSongs = "";
      let fetchedProfiles = "";
      if(searchResult !== '') {
        fetchedSongs = searchResult.songs.map((a,indx)=>{
        return (
          <Link to={`/${a.songId}`} key = {indx} >
          <div className = "result-item">
          <p>{a.songTitle}</p>
          <h5>{a.songArtist}</h5>
          </div>
          </Link>
        )
        })

        fetchedProfiles = searchResult.users.map((a,indx)=> {
          return (
            <Link to={`/p/${a.name}`} key = {indx} >
            <div className = "result-item">
            <p>{a.name}</p>
            <h5>profile</h5>
            </div>
            </Link>
          )
        })
      }
      // console.log(fetchedProfiles);
  return (
    <>
      <div className = "search-container">
       <input className="search-box" type="search"
       placeholder="search toonji" aria-label="Search"
       onChange = {handleSearchChange}/>
       </div>
       <div id="result-container">
        {fetchedSongs}
        {fetchedProfiles}
       </div>
       </>
  )
}

function Notifs(props) {
  const id = props.id || "notifs-container"
  const openNotifs = () => {
    let cont =  document.getElementById("notifs-messages-container")
    cont.style.display = "block";
    let dc  = document.querySelector('.pop-left-container')
    dc.style.right = "-300px";
    dc.style.top = "-300px";
    axios.delete(BASEURL + "/p/notifications")
      .then(res => {
      })
      .catch(e => {

      })
  }

  return (
    <div id = {id} onClick = {openNotifs}>
    <LyricsCardIcon className = "fas fa-bell" />
    {props.hasNotifs > 0 && <span>{props.hasNotifs}</span>}
    </div>
  )
}

function NotifsMessages(props) {
  const closeContainer = (e)=> {
    let doc  = document.getElementById("notifs-messages-container")
    doc.style.display ="none";
  }
  const notifs = props.notifs
  return (
    <div id = "notifs-messages-container">
    <div className="close-container" onClick = {closeContainer}>
    <div className = "close-bar-one"></div>
    <div className = "close-bar-two"></div>
    </div>
    <div id = "notifs-messages">
    {notifs.others.map((a,indx)=> {
      return (
        <div key = {indx} className = "notif-message-container">
        <i className = "far fa-bell"></i>
        <div className = "notif-message-info">
         <h4>{a}</h4>
         </div>
        </div>
      )
    })}
    {notifs.awards.map((a,indx)=> {
      return (
        <div key = {indx} className = "notif-message-container">
        <i className = "fas fa-award"></i>
        <div className = "notif-message-info">
         <h4>{a.userId} <small>gave your {a.type}</small> {a.award}</h4>
         <p> {a.brORcommentId}</p>
         </div>
        </div>
      )
    })}

    {notifs.followers.map((a,indx)=> {
      return (
        <div key = {indx} className = "notif-message-container">
         <i className = "far fa-user"></i>
         <div className = "notif-message-info">
         <h4>{a} <small>followed you</small></h4>
         </div>
        </div>
      )
    })}

    {notifs.upvotes.map((a,indx)=> {
      return (
        <div key = {indx} className = "notif-message-container">
        <i className = "fas fa-angle-up"></i>
        <div className = "notif-message-info">
         <h4>{a.userId} <small>upvoted your breakdown</small></h4>
         <p> {a.brId}</p>
         </div>
        </div>
      )
    })}

    {notifs.likes.map((a,indx)=> {
      return (
        <div key = {indx} className = "notif-message-container">
        <i className = "far fa-thumbs-up"></i>
          <div className = "notif-message-info">
         <h4>{a.userId} <small>liked your comment</small></h4>
         <p>{a.commentId}</p>
         </div>
        </div>
      )
    })}
    {props.hasNotifs < 1 && <h2>No new notifications</h2>}
    </div>
    </div>
  )
}

function HeaderPopLeft(props) {

    function logOutClicked() {
   if(!window.confirm("are you sure you want to logout ?")) return
        axios.post(BASEURL + '/p/log-out')
        .then(res => {
            props.handleSignedOut()
            successPrompt(res.data.msg)
        })
       .catch(e => {
         console.log(e);
         errorPrompt(e.response?.data.msg)
       })
    }

    const showDonationForm = ()=> {
      document.getElementById("donate-modal").style.transform = "scale(1)"
      let doc  = document.querySelector('.pop-left-container')
      doc.style.right = "-300px";
      doc.style.top = "-300px";
    }

   return (
     <div className = "pop-left-container" >
      <div className="close-container" onClick = {()=> {
        let doc  = document.querySelector('.pop-left-container')
        doc.style.right = "-300px";
        doc.style.top = "-300px";
      }}>
      <div className = "close-bar-one"></div>
      <div className = "close-bar-two"></div>
      </div>
      <br />
      <ul className= "pop-left-list">
      {props.isSignedIn ? "" :
      <li id ="li-signup-link" onClick= {()=>{
        document.getElementById("sign-login-collapse").style.transform = 'scale(1)';
        document.getElementById("form-collapse").style.display = "block";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("login-form").style.display = "none";
        let doc  = document.querySelector('.pop-left-container')
        doc.style.right = "-300px";
        doc.style.top = "-300px";
      }}>Signup</li>}
      {props.isSignedIn ? null: <li id ="li-login-link"  onClick= {()=> {
        document.getElementById("sign-login-collapse").style.transform = 'scale(1)';
        document.getElementById("form-collapse").style.display = "block";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
        let doc  = document.querySelector('.pop-left-container')
        doc.style.right = "-300px";
        doc.style.top = "-300px";
      }}>Login</li>}
      {!props.isSignedIn ? null: <li id ="li-logout-link"
       onClick= {logOutClicked}>logout</li>}
      <li onClick = {showDonationForm}>Donate</li>
      <li><Notifs id = "small-device-notifs" hasNotifs = {props.numOfNotifs}/></li>
      </ul>
     </div>
   )
}

function SignUp() {
  return (
    <button className = "signup-login-button" onClick = {()=> {
      document.getElementById("sign-login-collapse").style.transform = 'scale(1)';
      document.getElementById("form-collapse").style.display = "block";
      document.getElementById("signup-form").style.display = "block";
      document.getElementById("login-form").style.display = "none";
    }}>Signup</button>
  )
}
function Login() {
  return (
  <button className = "signup-login-button" onClick = {()=> {
    document.getElementById("sign-login-collapse").style.transform = 'scale(1)';
    document.getElementById("form-collapse").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  }}>Login</button>
)
}
function LogOut(props) {

  function logOutClicked() {
    if(!window.confirm("are you sure you want to logout ?")) return

      axios.post(BASEURL + '/p/log-out')
      .then(res => {
          props.handleSignedOut()
          document.cookie = "_user_id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          successPrompt(res.data.msg)
      })
     .catch(e => {
         errorPrompt(e.response?.data.msg)
     })
  }
  return (
  <button className = "signup-login-button"
  onClick = {logOutClicked}>Logout</button>
)
}

function Donate() {
  const showDonationForm = ()=> {
    document.getElementById("donate-modal").style.transform = "scale(1)"
  }
  return (
    <button id = 'donate-button' onClick = {showDonationForm}>Help</button>
  )
}


function Humburger() {
   function handleHumburgerClick() {
     let doc = document.querySelector('.pop-left-container');
     doc.style.right = "0px";
     doc.style.top = "0px";
   }
  return (
    <div className = "humburger-container" onClick = {handleHumburgerClick}>
    <div className="humburger"></div>
    <div className="humburger"></div>
    <div className="humburger"></div>
    </div>
  )
}
