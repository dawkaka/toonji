import React,{useEffect} from 'react';
import {Link} from 'react-router-dom';
import {FooterIcon} from '../Icons/allIcons'
import "./footer.css"

 export default function Footer(props) {

         useEffect(()=>{
           let target = window.location.pathname;
            switch (target) {
              case '/chart':
                document.getElementById('f-heart-icon').classList.remove('icon-active')
                document.getElementById('f-heart-icon-2').classList.remove('icon-active')
                document.getElementById('f-chart-icon').classList.add('icon-active')
                document.getElementById('f-chart-icon-2').classList.add('icon-active')
                break;
              case '/favourites':
                document.getElementById('f-chart-icon').classList.remove('icon-active')
                document.getElementById('f-chart-icon-2').classList.remove('icon-active')
                document.getElementById('f-heart-icon').classList.add('icon-active')
                document.getElementById('f-heart-icon-2').classList.add('icon-active')
                break;
              case '/':
              document.getElementById('home-icon').classList.add('icon-active')
              document.getElementById('home-icon-2').classList.add('icon-active')
                break;
              default:
              return
            }
         })


  return (
    <>
    <div className = "footer-container">
     <Link to="/"><FooterIcon className = "footer-icon fas fa-home"
     id = "home-icon"/></Link>
     <Link to="/chart"><FooterIcon className = "footer-icon fas fa-chart-bar"
     id = "f-chart-icon"/></Link>
     <Link to="/favourites"><FooterIcon className = "footer-icon fas fa-heart"
     id = 'f-heart-icon'/></Link>
     <Link to="/my/profile"><FooterIcon className = "footer-icon fas fa-user" /></Link>
    </div>
    <div className = "footer-container-2">
    <Link to="/"><FooterIcon className = "footer-icon fas fa-home"
    id = "home-icon-2"/></Link>
    <Link to="/chart"><FooterIcon className = "footer-icon fas fa-chart-bar"
    id = "f-chart-icon-2"/></Link>
    <Link to="/favourites"><FooterIcon className = "footer-icon fas fa-heart"
    id = 'f-heart-icon-2'/></Link>
    <Link to="/my/profile"><FooterIcon className = "footer-icon fas fa-user" /></Link>
    </div>
    </>
  );
}
