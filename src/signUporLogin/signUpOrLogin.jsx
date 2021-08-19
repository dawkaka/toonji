import React,{useState} from 'react'
import "./signUpOrLogin.css"
import { trackPromise} from 'react-promise-tracker';
import {successPrompt,errorPrompt} from '../prompts/promptMessages'
import {BASEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent'
import axios from 'axios'
export default function SignUpOrLogIN(props) {
    const [userName,setUserName] = useState('');
    const [userEmail,setUserEmail] = useState('');
    const [userPassword,setUserPassword] = useState('');
    const [rPassword, setRPassword] = useState('');
    const [userNameError,setUserNameError] = useState('');
    const [userEmailError,setUserEmailError] = useState('');
    const [userPasswordError,setPasswordError] = useState('');
    const [rPasswordError,setRPasswordError] = useState('');
    const [avatarLetter,setAvatarLetter] = useState('J')
    const [errorMessages,setErrorMessages] = useState([])

   function handleUserFieldChange(e){
      let field = e.target.id;
      switch (field) {
        case 'user-name-field':
        let newName = e.target.value;
        if(newName.match(/\W/)) {
          setUserNameError("only english characters allowed")
        }else {
        let newAvatarLetter =  newName[0] ? newName[0].toUpperCase(): 'J';
        setAvatarLetter(newAvatarLetter)
        setUserName(newName)
        e.target.value === "" ? setUserNameError('name field is required'):
         setUserNameError("");
       }
          break;
        case 'name-field':
         let newNameL = e.target.value;
         let newAvatarLetterL =  newNameL[0] ? newNameL[0].toUpperCase(): 'J';
         setAvatarLetter(newAvatarLetterL)
         setUserName(newNameL)
         e.target.value === "" ? setUserNameError('name field is required'):
          setUserNameError("");
          break;
        case 'user-email-field':
          let email = e.target.value;
          setUserEmail(email)
          setUserEmailError('')
          break;
        case 'user-password-field':
          setUserPassword(e.target.value);
          e.target.value.length < 6 ? setPasswordError('should be 6 or more characters'):
          setPasswordError("")
          if(document.getElementById("user-rPassword-field").value !== '') {
            e.target.value === rPassword ? setRPasswordError("") : setRPasswordError("passwords don't match")
          }
          break;
        case 'password-field':
          setUserPassword(e.target.value);
          e.target.value.length < 6 ? setPasswordError('should be 6 or more characters'):
          setPasswordError("")
          break;
        case 'user-rPassword-field':
          setRPassword(e.target.value)
          userPassword === e.target.value ? setRPasswordError(''): setRPasswordError("passwords don't match")
          break;
        default:
        return
      }

    }

   function toggleSignupAndLogin(e) {
     if(e.target.id === "signup-link") {
        document.getElementById('login-form').style.display = "none";
       document.getElementById("signup-form").style.display = "block";
     }else {
        document.getElementById("signup-form").style.display = 'none';
       document.getElementById('login-form').style.display = "block";
     }
   }


   function handleSubmit(e){
     e.preventDefault();
   if(e.target.value === "signup"){
    if(userNameError !== '' || userPasswordError !== ''
    ||rPasswordError !== '' || userEmailError !== '' || userName === ''
    ||userPassword === '' || userEmail === '' || rPassword === ''){
      alert("check your inputs and try again")
    }else {
      trackPromise(
        axios({
        method: 'post',
        url: BASEURL + '/signup',
        data:  {
          name: userName,
          email: userEmail,
          password:userPassword,
          repeatPassword:rPassword
        }
        })
    .then( res => {
              let message = res.data.msg;
              if(res.data.type === "SUCCESS"){
            document.getElementById("sign-login-collapse").style.transform = "scale(0)"
            props.handleSignedIn();
            successPrompt(message)

            }
           if(res.data.type === "ERROR") {
             setErrorMessages([...res.data.data])
             errorPrompt(message)
           }
        })
    .catch(error => {
              errorPrompt("something went wrong")
            }),'signup-area')
     }
   }else if(e.target.value === "login"){
     if(userNameError !== '' || userPasswordError !== ''
       || userName === ''||userPassword === ''){
       alert("nope you've got some errors");
     }else {

       trackPromise(
     axios({
     method: 'post',
     url: BASEURL + '/login',
     data: {
       name: userName,
       password:userPassword,
     }
        })
         .then(res => {
        let message = res.data.msg;
            if(res.data.type === "SUCCESS"){
             document.getElementById("sign-login-collapse").style.transform = "scale(0)"
             props.handleSignedIn();
             successPrompt(message)
           }
            if(res.data.type === "ERROR") errorPrompt(message)
         })
         .catch( error => {
             errorPrompt("something went wrong")
         }),'login-area')
     }
   }
   }

  return (

    <div onClick = {(e)=> {
      if(e.target.id === "sign-login-collapse") {
        document.getElementById("sign-login-collapse").style.transform = 'scale(0)';
  }
    }} className = "sign-login-modal" id = "sign-login-collapse">

    <div className = "form-container" id="form-collapse">
    <center>
    <div className = "avatar-container">
    <div id = "avatar">
    <h3 id ="avatar-letter">{avatarLetter}</h3>
    </div>
    </div>
    <form id = "signup-form">
    <input type = "text" onChange ={handleUserFieldChange}
    placeholder="your prefered name" id= "user-name-field"
    value = {userName}
    className = "input-box" autoComplete="true" name = "userName"/>
    <br/>
    {userNameError !== "" ? <small className = "field-info">{userNameError}</small> : ""}
    <br/>
    <input type = "email" placeholder="enter email" className = "input-box"
     id= "user-email-field" autoComplete="true" name = "userEmail"
     onChange ={handleUserFieldChange}/>
     <br/>
     {userEmailError!== ""? <small className = "field-info">{userEmailError}</small> : ""}
    <br/>
    <input type = "password" placeholder="enter password" className = "input-box"
    id= "user-password-field" name = "userPassword" autoComplete = "true"
     onChange ={handleUserFieldChange}/>
     <br/>
    {userPasswordError !== ""? <small className = "field-info">{userPasswordError}</small> : ""}
    <br/>
    <input type = "password" placeholder="repeat password" className = "input-box"
    id= "user-rPassword-field"name = "repeatPassword" autoComplete = "true"
     onChange ={handleUserFieldChange}/>
     <br/>
     {rPasswordError !== ""? <small className = "field-info">{rPasswordError}</small> : ""}
    <br/>
    {
      errorMessages.map((a,indx) => {
        return <p className = "signin-error-messages" key = {indx}>{a}</p>
      })
    }
      <LoadingSpinner height = {30} width = {30} area = "signup-area" />
    <input type = "submit" value="signup" className= "submitButton"
    onClick = {handleSubmit}/>
    <p>already have an account ? <span onClick = {toggleSignupAndLogin} id = "login-link"
    className = "signup-login-link">login</span></p>
    </form>
    <form id = "login-form">
    <input type = "name" placeholder="enter user name" className = "input-box"
     autoComplete = "true" name = "userName" onChange = {handleUserFieldChange}
     id="name-field"/>
     <br/>
     {userNameError !== ""? <small className = "field-info">{userNameError}</small> : ""}
    <br/>
    <input type = "password" placeholder="Enter password" className = "input-box"
    autoComplete = "true" name = "userPassword" onChange = {handleUserFieldChange}
    id="password-field"/>
    <br/>
    {userPasswordError !== ""? <small className = "field-info">{userPasswordError}</small> : ""}
    <br/>
    <LoadingSpinner height = {30} width = {30} area = "login-area" />
    <input type = "submit" value = "login" className = "submitButton"
    onClick = {handleSubmit}/>
    <p>don't have an account ? <span onClick = {toggleSignupAndLogin} id = "signup-link"
    className = "signup-login-link">signup</span></p>
    </form>
    </center>
    </div>
    </div>
  )
}
