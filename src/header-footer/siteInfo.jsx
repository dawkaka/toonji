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
   <Link to ="/c/be-a-contributor">
   {!isCont && <p>Upload lyrics</p>}
   </Link>
   <Link to ="/c/report-bug">
   <p>report a bug</p>
   </Link>
   <p>toonji © {new Date().getFullYear()}, some rights reserved.</p>
   </div>
  )
}
