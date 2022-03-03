import React,{useState} from 'react';
import './adminPageCss.css'
import EditSongs from './EditSong'
import Upload from '../uploadPage/upload'
import {Logo} from '../header-footer/header'
import {BASEURL} from '../credentials'
import Reports from './reports'
import Others from './others'
import { trackPromise} from 'react-promise-tracker';
import {errorPrompt} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent'
import AdminLogin from './adminLogin'
import ArtistPanel from './artist'
import axios from 'axios'

export default function AdminPanel() {
   const [isAdmin,setIsAdmin] = useState(false)

   function adminLogin(e) {
     e.preventDefault()
  trackPromise(
   axios({
   method: 'post',
   url: BASEURL +'/c/contributor-login',
   data: {
     name: document.getElementById("admin-name").value,
     password: document.getElementById('admin-password').value,
   }
  })
     .then(res => {
            setIsAdmin(true)

       })
       .catch( error => {
           errorPrompt(error.response?.data.msg)
       }),'admin-login')
     }

  return (
    <div id = "admin-main">
    {isAdmin && <AdminSideBar />}
    <div id = "not-side">
    <AdminHeader />
    {!isAdmin && <AdminLogin handleSubmit = {adminLogin}
    spin = {<LoadingSpinner area = 'admin-login'
     height = {30} width = {30}/>}/>}
    {isAdmin && <Upload /> }
    {isAdmin && <EditSongs />}
    {isAdmin && <Reports /> }
    {isAdmin && <Others /> }
    {isAdmin && <ArtistPanel/>}
    </div>
    </div>
  )
}
export function AdminHeader() {
  return (
    <div className = "trending-header-container">
    <Logo />
    </div>
  )
}
function AdminSideBar() {

  return (
    <div id = "side-main">
    <SideBarItem active label = "upload" />
    <SideBarItem label = "edit" />
    <SideBarItem label = "reports" />
    <SideBarItem label = "others" />
    <SideBarItem label = "artist" />
    </div>
  )
}
function SideBarItem(props) {

  function sideBarItemClicked(e) {
    Array.from(document.getElementsByClassName("side-bar-item")).map(a=>{
       return a.classList.remove("side-bar-item-active")
    })
    e.target.classList.add("side-bar-item-active")
    let navs = ["upload-view","edit-view","reports-view",
    'others-view','artist-view'];
    navs.map(a => {
      return document.getElementById(a).style.display = "none"
    })
    let target = document.getElementById(`${e.target.textContent}-view`);
    if(target !== null){
      target.style.display = "block"
    }
  }
  return (
  <li
  className = {props.active ?
    "side-bar-item side-bar-item-active":"side-bar-item" }
  id = {props.label}
    onClick = {sideBarItemClicked}>
  {props.label}
  </li>
)
}
