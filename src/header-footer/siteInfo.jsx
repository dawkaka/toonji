import React,{useEffect,useState} from 'react'
import './siteInfo.css'
import {Link} from 'react-router-dom';
export default function SiteInfo() {
  const[isCont,setCont] = useState(false)
   useEffect(()=> {
     setCont(document.cookie.split(";").map(a => a.trim()).some(a => a === "contributor=true"))
   },[])
  return (
   <div id = "site-info-container">
   <a href="https://twitter.com/mo_yussif" target ="_BLANK"
   rel="noopener noreferrer"> my twitter <i className="fab fa-twitter">
   </i></a>
   <Link to ="/c/be-a-contributor">
   {!isCont && <p>be a contributor</p>}
   </Link>
   <Link to ="/c/report-bug">
   <p>report a bug</p>
   </Link>
   <p>toonji © {new Date().getFullYear()}, some rights reserved.</p>
   </div>
  )
}
