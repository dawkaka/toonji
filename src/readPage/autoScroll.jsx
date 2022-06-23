import React,{useState,useEffect} from 'react'
import { trackPromise} from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import axios from 'axios'
import {BASEURL} from '../credentials'
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import LoadingSpinner from '../prompts/loadingComponent';
import './autoscroll.css'

let scrollRate = 0;
export function AutoScroll() {
   const [canDrag,setCanDrag] = useState(false)
  useEffect(() => {
    let scrollDiv = document.getElementById("read-side-punchlines-container")
    window.setInterval(()=> {
      let targetSpeed = (scrollRate/30) || 0
      scrollDiv.scrollTop += targetSpeed
    },50)

    return ()=> {
      scrollRate = 0;
    }
  },[])

   const handleBulbDown = (e) => {
     setCanDrag(true)
   }


   const handleMouseUp = () => {
     setCanDrag(false)
   }

   const handleBulbMove = (e) => {
    if(!canDrag) return
    let indicator = document.getElementById("autoscroll")
    let scrollY = indicator.getBoundingClientRect().y
    indicator.style.height = `${e.pageY - scrollY}px`
    scrollRate = e.pageY - scrollY
   }

   const handleScrollClick  = (e) => {
     let indicator = document.getElementById("autoscroll")
     let scrollY = indicator.getBoundingClientRect().y
     indicator.style.height = `${e.pageY - scrollY}px`
     scrollRate = e.pageY - scrollY
   }

  return (
    <div id = "autoscroll-container" onClick = {handleScrollClick}>
    <div id = "autoscroll" onClick = {handleScrollClick}>
    </div>
    <div id = "autoscroll-bulb" onMouseDown = {handleBulbDown}
    onMouseMove = {handleBulbMove} onMouseUp ={handleMouseUp}>
    </div>
    </div>
  )
}


export function AwardBr() {
  const {promiseInProgress} = usePromiseTracker({area:'award-br'})
  const awards = [{name:"platinum",image:"/platinum.png",numberOfCoins:5000},
                      {name:"diamond",image:"/diamond.png",numberOfCoins:1000},
                      {name:"gold",image:"/gold.png",numberOfCoins:500},
                      {name:"silver",image:"/silver.jpg",numberOfCoins: 70},
                      {name:"bronze",image:"/bronze.jpg",numberOfCoins:30},
                      {name:"copper",image:"/copper.jpg",numberOfCoins:5}]

    function giveAWard() {

      let awardStore = document.getElementById("award-br-container")
      let awards = Array.from(document.getElementById("awards-container").childNodes)
      let selectedAwards = awards.filter(a => {
        return a.className.split(" ").some(a => a === "award-selected")
      }).map(a => a.childNodes[0].innerText)
      if(selectedAwards.length < 1) return
      let awardInfo = awardStore.className.split("-")
      let songId,punchId,brId,commentId,reqURL;
       songId = awardInfo[1]

       let data = {}
       if(awardInfo[0] === "breakdown") {
         reqURL = BASEURL + '/award-breakdown'
         punchId = awardInfo[2]
         brId = awardInfo[3]
         data = {
          awardsGiven: selectedAwards,
          songId,
          punchId,
          brId
        }
       }else {
         reqURL = BASEURL + '/award-comment'
         commentId = awardInfo[2]
         data = {
           awardsGiven: selectedAwards,
           songId,
           commentId
         }
       }

      trackPromise(
        axios({
           method: 'POST',
           url: reqURL,
           data
         })
        .then((res)=>{
            let message = res.data.msg
            successPrompt(message)
            document.getElementById("award-br-container").style.display = "none"
          })
        .catch((err)=>{
          if(err.response?.status === 401) {
            showLoginModal()
          }else {
            errorPrompt(err.response?.data.msg)
          }
        }),'award-br')
    }

  return (
    <div id = "award-br-container">
    <div id = "awards-container">
     {
       awards.map((a,indx)=> {
         return <Award key = {indx} image = {a.image} name = {a.name} numberOfCoins = {a.numberOfCoins} />
       })
     }
     </div>
     <div id = "award-br-buttons-container">
     <button id = "awardBr-cancel-button" onClick = {()=> {
       const awardContainers = document.getElementsByClassName("award-container")
       Array.from(awardContainers).forEach((awardContainer, i) => {
            awardContainer.classList.remove("award-selected")
       });
       document.getElementById("award-br-container").style.display = "none"
     }}>close</button>
     <button id = "awardBr-submit-button" onClick = {giveAWard}>
     <LoadingSpinner color = 'white' height = {20} width = {20} area = 'award-br'/>
     {!promiseInProgress && 'award'}</button>
     </div>
    </div>
  )
}

function Award(props) {

    function awardSelected(e) {
      if(e.target.parentNode.id !== "awards-container"){
        if(e.target.parentNode.className.split(" ").some(a => a === "award-selected")){
          e.target.parentNode.classList.remove("award-selected")
        }else {
          e.target.parentNode.classList.add("award-selected")
        }
      }else {
        if(e.target.className.split(" ").some(a => a === "award-selected")){
            e.target.classList.remove("award-selected")
        }else {
        e.target.classList.add("award-selected")
        }
      }
    }

  return (
    <div className = "award-container" onClick = {awardSelected}>
    <p>{props.name}</p>
    <img src = {props.image} className = "award-image" alt = {props.name + " award"}/>
    <p>{props.numberOfCoins} </p>
    </div>
  )
}

export function EditBr(){
 const {promiseInProgress} = usePromiseTracker({area:'edit-br'})
 const updateBarBreakdown = (e)=>{
    let newBreakdown = document.getElementById('editBr-textarea').value
    if(newBreakdown.length < 1) return
    let absPath = e.target.className.split('-')
    let path =`/${absPath[0]}/${absPath[1]}/${absPath[2]}`
    trackPromise(
   axios({
        method: 'post',
        url: BASEURL + '/edit-breakdown'+path,
        data: {
          newBreakdown
        }
      })
      .then(res => {
        
          successPrompt(res.data.msg)
          document.getElementById('editBr-container').style.display = "none"

      })
      .catch(err => {
        if(err.response?.status === 401) {
          showLoginModal()
        }else {
          errorPrompt(err.response?.data.msg)
        }
      }),'edit-br')
 }

  return (
    <div  className = "editBr-container" id = {`editBr-container`}>
    <textarea id = "editBr-textarea" rows = '10' onChange = {(e)=> {
      let brLength = e.target.value.length;
      let brValue = e.target.value;
      if(brLength > 500) {
        e.target.value = brValue.substr(0,500)
      }
    }}>
    </textarea><br/>
    <button id = "editBr-cancel-button" onClick = {()=> {
      document.getElementById("editBr-container").style.display = "none"
    }}>cancel</button>
    <button id = "editBr-submit-button"
    onClick = {updateBarBreakdown}>
      <LoadingSpinner color = 'white' height = {20} width = {20} area = 'edit-br'/>
      {!promiseInProgress&&'update'}</button>
    </div>
  )
}
