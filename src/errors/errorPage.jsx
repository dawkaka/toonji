import React from 'react'
import './errorPage.css'
export default function ErrorPage() {
         // useEffect(()=>  {
         //   document.getElementById("error-page-container").style.height = window.innerHeight + "px";
         // })
  return (
    <div id = 'error-page-container'>
    <h1 id = "error-heading">{'{404}'} page not found</h1>
    <a href = "/">go to home page</a>
    </div>
  )
}
