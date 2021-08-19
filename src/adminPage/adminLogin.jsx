import React from 'react'
import './adminLogin.css'
export default function AdminLogin(props) {
  return (
    <div id = "admin-login-container">
    <form id = "admin-login-form" method = 'post' onSubmit = {props.handleSubmit} >
    <input type = "name" placeholder="enter user name" className = "admin-input-box"
     autoComplete = "true" name = "name" defaultValue = ""
     id="admin-name"/>
     <br/>
     <input type = "password" placeholder="enter password" className = "admin-input-box"
       name = "password" defaultValue = ""
      id="admin-password"/>
    <br/>
    {props.spin}
    <input type = "submit" value = "login" className = "submitButton"
    onSubmit = {props.handleSubmit}/>
    </form>
    </div>
  )
}
