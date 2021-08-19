import React from 'react'
import './cookiePrompt.css'

export default function CookiePrompt() {
    const  acceptCookies = ()=> {
      localStorage.setItem('accepts_cookies',true)
      document.getElementById("cookie-prompt-container").style.display = "none"
    }
   return (
     <div id = "cookie-prompt-container">
     <p>cookies are being used on this site.</p>
     <button onClick = {acceptCookies}>Ok</button>
     </div>
   )
}
