import React,{useState,useEffect} from 'react';
import axios from 'axios'
import {errorPrompt,successPrompt} from '../prompts/promptMessages'
import {trackPromise,usePromiseTracker} from 'react-promise-tracker';
import LoadingSpinner from '../prompts/loadingComponent';
import {IMAGEURL} from '../credentials'

function EditProfile(props){
  const {promiseInProgress} = usePromiseTracker({area:'edit-user'})
    const [name,setName] = useState('')
    const [bio,setBio] = useState('')
    const [picture,setPicture] = useState(undefined)
    useEffect(()=>{
      setName(props.name)
      setBio(props.bio)
    },[props.name,props.bio])
  function handleChange(e) {
            switch (e.target.id) {
              case "edit-profile-file":
              let myimg = document.getElementById("edit-profile-photo");
               let input = document.getElementById("edit-profile-file");
               setPicture(input.files[0])
               if (input.files && input.files[0]) {
                 let reader = new FileReader();
                 reader.readAsDataURL(input.files[0]);
                 reader.onload = function (e) {
                   myimg.src = e.target.result;
                 }
               }
                break;
              case "edit-profile-name":
                 setName(e.target.value)
                break;
              case "edit-profile-bio":
                if(e.target.value.length < 127){
                  setBio(e.target.value)
                };
                break;
              default:
                 return
            }
          }
  function handleFileChangeFinish() {
    let myimg = document.getElementById("profile-photo");
     let input = document.getElementById("edit-profile-file");
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
     document.getElementById("profile-name").innerText = name;
     document.getElementById("profile-bio").innerText = bio
     document.getElementById("edit-profile-main").style.display = "none"
  }
  const handleEditSubmit = (e) => {
    e.preventDefault()
     const formData = new FormData()
     // let imageFile = cover;
     formData.append("name",name);
     formData.append("bio",bio);
     formData.append("picture",picture)
     formData.append('prevName',props.name)
     trackPromise(
    axios({
      method: 'post',
      url: props.reqURL,
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then((res)=>{
      handleFileChangeFinish()
     successPrompt(res.data.msg)
  })
   .catch((err)=>{
       errorPrompt(err.response?.data.msg)
  }),'edit-user')
  }
 return (
   <div id = "edit-profile-main" onClick = {(e)=>{
     if(e.target.id !== "edit-profile-main") return;
     if(e.target.style.display === "none") {
       e.target.style.display = "block"
     }else {
       document.getElementById("edit-profile-container").classList.remove('toggle-edit')
        document.getElementById("edit-profile-main").style.display = "none"
       }
   }} aria-label = "close edit profile window">
   <div id = "edit-profile-container">
   <div className="edit-close-container" onClick = {()=> {
     document.getElementById('edit-profile-main').style.display = "none"
   }} aria-label = "close edit profile window">
   <div className = "edit-bar-one" ></div>
   <div className = "edit-bar-two"></div>
   </div>
   <img src = {`${IMAGEURL}${props.picture}`} id = "edit-profile-photo" alt = "artist" />
   <form id='edit-profile-form' onSubmit = {handleEditSubmit}>
   <input type="file" id = "edit-profile-file" onChange = {handleChange}
   aria-label= "change your profile picture"/>
   <small>image can not be greater than 3Mb </small><br/>
   <input type="text" placeholder = "enter name" className = "edit-profile field"
   aria-label = "change your profile name" id = "edit-profile-name"
   onChange = {handleChange} defaultValue = {name} /><br/>
   <textarea placeholder = "bio" className = "edit-profile textArea"
   aria-label = "change your profile bio" id = "edit-profile-bio"
   onChange = {handleChange} defaultValue = {bio}></textarea><br/>
   <LoadingSpinner height = {30} width = {30} area = 'edit-user' />
  {!promiseInProgress&&<input type="submit" value="save" className = "edit-profile button"
   aria-label = "submit edit profile changes" />
 }
   </form>
   </div>
   </div>

 )
}
export default EditProfile;
