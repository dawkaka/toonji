import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {usePromiseTracker,trackPromise} from "react-promise-tracker";
import {Helmet} from 'react-helmet'

import {errorPrompt,successPrompt} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import {BASEURL} from '../credentials'
import './battleLink.css'

export default function BattleLink() {
  const {promiseInProgress} = usePromiseTracker({area: "battle-link"})
  const [hasName,setHasName] = useState(false)
  const [avLinks,setAvLinks] = useState([])
  const names = useRef()

  useEffect(()=> {
     axios.get(BASEURL + "/battle/battle-link")
     .then(res => {

       let links = res.data.map(a => {
         return {
           battleId: window.location.origin + "/battle/" + a.battleId,
           artists: a.artists
         }
       })
       setAvLinks(links)
     })
     .catch(e => {
        errorPrompt(e.response?.data.msg)
     })
  },[])



  const getLink = () => {
     if(!names.current.value.length) return
    trackPromise(
     axios.post(BASEURL + "/battle/battle-link",{artists: names.current.value.split(",").map(a => a.trim())})
     .then(res => {

        setAvLinks((prev)=> [...prev, {
          battleId: window.location.origin + "/battle/" + res.data.battleId,
          artists: res.data.artists
        }])
     })
     .catch(e =>{
       errorPrompt(e.response?.data.msg)
     }),'battle-link')
  }

  return (
    <>
    <div id = "face-off-main-container" >
    <main>
      <div id = "available-links-container">
      <h3>Available links</h3>
       {avLinks.length < 1 && <p>No valid links</p>}
       <ul id = "links-list">
       {avLinks.length > 0 ? avLinks.map((link, indx) => <LinkItem  {...link} key = {indx}/>):""}
       </ul>
      </div>
      <hr />
    <div id = "new-link-container">
    <h3>Get new link</h3>
    <label htmlFor = "artist-name">Artist name(s): </label><br />
    <input type = "text" id = "artist-name" ref = {names} className = "input-box"
    style = {{width:"80%"}} onChange = {(e)=> e.target.value.length ? setHasName(true):setHasName(false)}/>
    <br />
    <small>use comma (,) to saperate multiple artists</small>
     <div id = "new-link-buttons-container">
     <button  className = "profile-buttons cancel" onClick ={()=> window.history.back()}>back</button>
     <LoadingSpinner height = {50} width = {50} area = "battle-link" />
     {!promiseInProgress && <button type = "submit" onClick = {getLink} className = {`profile-buttons ${ hasName ? "":"disabled"}`}>
     get link
     </button>}
     </div>
     </div>
    </main>
    </div>
    <Helmet>
    <title>My Battle Links</title>
    <meta name="description"
     content = "Customize and buy battle links and use them to compete with friends in real-time"
    />
    </Helmet>
    </>
  )
}

function LinkItem({battleId,artists}) {

 function copyLink(e) {
   try{
         let inp = e.target.previousSibling
         inp.select();
         document.execCommand("copy")
         successPrompt("link copied")
    }catch(e) {
         errorPrompt(e.message)
    }
 }

  return(
    <>
     <span className = "battle-artists">{artists.join(", ")}</span>
     <li className = "battle-link"><input type = "text" value = {battleId} readOnly/><span onClick = {copyLink}>copy</span></li>
    </>
  )
}
