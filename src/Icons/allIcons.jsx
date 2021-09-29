import React from 'react'
import './IconsCss.css'
import '../fontawesome/fontawesome-free-5.14.0-web/css/all.css'

export function LyricsCardIcon(props) {
let number = props.number ? <span className = {props.total}>{props.number}</span> : "";

  return (
    <div className = "bar-icons">
    <i className= {props.className} id = {props.id}
    onClick = {props.onClick}></i>
    {number}
    </div>
  )
}

export function FooterIcon(props) {

  return (
    <div className = "footer-icons">
    <i className = {props.className} id = {props.id}></i>
    </div>
  )
}

export function BackIcon(props) {
     function goBack() {
       window.history.back()
     }

     let cls = props.profile ? "back-icon-container style-profile":"back-icon-container"
  return (
    <div className = {cls} onClick = {goBack}>
    <i className = "fas fa-arrow-left" onClick = {goBack}></i>
    </div>
  )
}
