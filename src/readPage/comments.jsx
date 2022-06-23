import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {usePromiseTracker,trackPromise} from "react-promise-tracker";
import {Link} from 'react-router-dom'
import {successPrompt,errorPrompt,showLoginModal} from '../prompts/promptMessages'
import {BASEURL,IMAGEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent';
import {numberToKOrM} from './readFunctions';
import {AwardBadge} from './punchlines'
import './comments.css'


export default function CommentSideView(props) {
      const [comment, setComment] = useState('');
      const [comments, setComments] = useState([])
      const [commentLoadSpinning,setCommentLoadSpinning] = useState(false)
      const [commentEnd,setCommentEnd] = useState(false)
      const [loadCount,setLoadCount] = useState(0)
      const {promiseInProgress} = usePromiseTracker({area:'add-comment'})
       useEffect(()=> {
         let didCancel = false;
         // trackPromise(
         //  axios.get(BASEURL + `/comments${window.location.pathname}/${0}`)
         //  .then(res => {
         //      if(res.data.type === 'ERROR'){
         //        errorPrompt(res.data.msg)
         //      }else {
         //          if(!didCancel){
         //        setComments([])
         //        setComments(res.data.comments)
         //        if(res.data.isEnd) {
         //          setCommentEnd(true)
         //          setLoadCount(0)
         //        }
         //        setLoadCount(res.data.nextFetch)
         //      }
         //    }
         //  })
         //  .catch(e => {
         //    errorPrompt("something went wrong")
         //  }),'comments')
            createObserver(didCancel)
          return ()=> didCancel = true;
       },[])

     function createObserver(didCancel) {

        let observer = new IntersectionObserver(()=> {
          if(!didCancel){
            trackPromise(
              axios.get(BASEURL + `/comments${window.location.pathname}/${0}`)
              .then(res => {
                    setComments([])
                    setComments(res.data.comments)
                    if(res.data.isEnd) {
                      setCommentEnd(true)
                      setLoadCount(0)
                    }
                    setLoadCount(res.data.nextFetch)
                    didCancel = true
              })
              .catch(err => {
                if(err.response?.status === 401) {
                  showLoginModal()
                }else {
                  errorPrompt(err.response?.data.msg)
                }
              }),'comments')
          }
        })
        const commentContainer = document.querySelector("#comments-container")
        observer.observe(commentContainer)
     }



       const commentDeleted = (e) => {
         e.target.parentNode.parentNode.parentNode.style.display = "none"
       }

       let lyricComments = comments.map((a,indx) => {
           return (
             <LyricsComments key = {indx}
             commentImage = {`${IMAGEURL}${a.picture}?tr=w-45,h-45,c-at_max`}
              commentor = {a.name}
                   commentDate = {new Date(a.date).toDateString() +"  "+ new Date(a.date).toTimeString().substr(0,9)} id = {a.id}
                   comment = {a.comment} likes = {`${a.likes}`}
                   liked = {a.liked} isThisUser = {a.isThisUser}
                   isDeleted = {commentDeleted} points = {a.points} awards = {a.commAwards}
               />
           )
         })

    const handleComment = ()=> {
      if(comment === '') return
      trackPromise(
      axios({
        method: 'post',
        url: BASEURL + '/comment'+window.location.pathname,
        data: {
         comment
        }
      })
      .then((res)=>{
         let message = res.data.msg;
          setComment('')
          let comm = [...res.data.userComment,...comments]
          setComments([])
          setComments(comm)
          successPrompt(message)
    })
     .catch((err)=>{
       if(err.response?.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
    }),'add-comment')
    }

    function handleChange(e) {
      if(e.target.value.length <= 226){
      setComment(e.target.value)
    }
    }
   const commentsLoaderClick = ()=> {
     setCommentLoadSpinning(true)
     axios.get(BASEURL + `/comments${window.location.pathname}/${loadCount}`)
     .then(res => {
       setCommentLoadSpinning(false)
          if(res.data.isEnd){
            setCommentEnd(true)
            setComments([...comments,...res.data.comments])
            setLoadCount(0)
          }else {
            setComments([...comments,...res.data.comments])
            setLoadCount(res.data.nextFetch)
          }
     })
     .catch(err => {
       if(err.response?.status === 401) {
         showLoginModal()
       }else {
         errorPrompt(err.response?.data.msg)
       }
     })
   }

  return (
    <div id = "comment-side-container">
    <div className = "read-side-header-container">
      <h2 id = "song-title">Comments</h2>
    </div>
     <div id = "comments-container">
     <div id = "add-comment-container">
     <textarea resize = "none" rows = "1" colums = "50"
     placeholder= "add comment" onChange = {handleChange} value = {comment}>
      </textarea>
    <button id = "add-comment">
    <LoadingSpinner color = "white" height = {20} width = {20} area = "add-comment"/>
    {!promiseInProgress && <i className = "fas fa-paper-plane" onClick = {handleComment}></i>}
      </button>
     </div>
     <LoadingSpinner height = {30} width = {30} area = "comments"/>
     {lyricComments}
     <div className = "comments-reload">
     <ReloadButton isSpinning = {commentLoadSpinning} isEnd = {commentEnd}
     handleLoaderClick = {commentsLoaderClick}/>
     </div>
      </div>
    </div>
  )
}

export function ReloadButton(props) {
  return (
    <div className = "reload-container">
    {!props.isSpinning && !props.isEnd && <i className = "fas fa-redo"
    onClick = {props.handleLoaderClick}></i>}
    {props.isSpinning && <i className = "fas fa-redo fa-spin"></i>}
    {props.isEnd && <span className = "reload-end">end</span>}
    </div>
  )
}

function LyricsComments(props) {
       const [numberOfLikes,setNumberOfLikes] = useState(parseInt(props.likes))
       const [commentLiked,setCommentLike] = useState(props.liked)

   function handleReaction(e){
     let className = e.target.className.split(' ').filter(a => a !== "icon-active").join("")
     let reaction = "";
     if(className === "fasfa-thumbs-up"){
       reaction = "LIKED"
     }else if(className === 'fasfa-thumbs-down'){
       reaction = "DISLIKED"
     }
     axios.post(`${BASEURL}/comment-reactions${window.location.pathname}/${props.id}/${reaction}`)
     .then((res)=>{
      let message = res.data.msg;
       if(res.data.type === "SUCCESS"){
     if(message === "liked"){
       commentLiked === "DISLIKED" ? setNumberOfLikes(numberOfLikes + 2) : setNumberOfLikes(numberOfLikes + 1)
       setCommentLike("LIKED")
     }else if(message === "disliked"){
       commentLiked === "LIKED" ? setNumberOfLikes(numberOfLikes - 2) : setNumberOfLikes(numberOfLikes - 1)
       setCommentLike("DISLIKED")
     }else {
        if(commentLiked === "LIKED") {
          setNumberOfLikes(numberOfLikes - 1)
          setCommentLike(false)
        }else {
          setNumberOfLikes(numberOfLikes + 1)
          setCommentLike(false)
        }
     }
     successPrompt(message)
   }
   })
    .catch((err)=>{
      if(err.response?.status === 401) {
        showLoginModal()
      }else {
        errorPrompt(err.response?.data.msg)
      }
   })
   }

  function giveAward() {
    let awardStore = document.getElementById("award-br-container")
    awardStore.style.display = "block"
    awardStore.className = `comment-${window.location.pathname.substr(
      window.location.pathname.lastIndexOf('/') + 1)}-${props.id}`
    }
  return (
    <div className = "comment-container">
    <Options isUser = {props.isThisUser} options = {{userOnly:['delete'],allUsers: ["award"]}} item = "comment"
     songId = {window.location.pathname.substr(
       window.location.pathname.lastIndexOf('/') + 1)}
     commentId = {props.id} isDeleted = {props.isDeleted} giveAward = {giveAward}/>
    <div className = "comment-details">
    <img className = "comment-image" src = {props.commentImage} alt="user" />
    <div className = "comment-details-text">
    <Link to={`/p/${props.commentor}`}><h5>{props.commentor} <small>{props.points} points</small></h5></Link>
    <small>{props.commentDate}</small>
    </div>
    </div>
    <div className = "awards-acumulated-container">
    <AwardBadge image = "/platinum.png" numOfTimesAWarded = {props.awards ? props.awards.platinum ? props.awards.platinum: "0" : "0" } />
    <AwardBadge image = "/diamond.png" numOfTimesAWarded = {props.awards ? props.awards.diamond ?  props.awards.diamond : "0" : "0"} />
    <AwardBadge image = "/gold.png" numOfTimesAWarded = {props.awards ? props.awards.gold ?  props.awards.gold : "0" : "0"} />
    <AwardBadge image = "/silver.jpg" numOfTimesAWarded = {props.awards ? props.awards.silver ?  props.awards.silver : "0" : "0"} />
    <AwardBadge image = "/bronze.jpg" numOfTimesAWarded = {props.awards ? props.awards.bronze ?  props.awards.bronze : "0" : "0"} />
    <AwardBadge image = "/copper.jpg" numOfTimesAWarded = {props.awards ? props.awards.copper ?  props.awards.copper : "0" : "0"} />
    </div>
    <p className= "comment-text">{props.comment}</p>
    <div className = "comment-icon-container">
    <i className = {`fas fa-thumbs-up${commentLiked === "LIKED" ? " icon-active":""}`}
    onClick = {handleReaction}></i>
    <p>{numberToKOrM(numberOfLikes)}</p>
    <i className = {`fas fa-thumbs-down${commentLiked === "DISLIKED"? " icon-active":""}`} onClick = {handleReaction}/>
    </div>
    </div>
  )
}

export function Options(props) {

  const showOptions = (e) => {
    let target = e.target.parentNode.childNodes[1]

    if(e.target.className === "option-dot") {
      target = e.target.parentNode.parentNode.childNodes[1]
    }

    if(target.style.display === "block") {
      target.style.display = "none"
    }else {
      target.style.display = "block"
    }
  }
 const handleDelete = (e) =>  {
   e.persist()
   let path = ''
   if(props.item === 'breakdown'){
     path = BASEURL + `/delete/${props.item}/${props.songId}/${props.punchId}/${props.barId}`
   }else {
     path = BASEURL + `/delete/${props.item}/${props.songId}/${props.commentId}`
   }
   if(!window.confirm("are you sure you want to delete ?")) return
      axios.post(path)
      .then(res => {
          if(props.item ==='breakdown'){
            props.isDeletedBr()
          }else {
            props.isDeleted(e)
          }
          successPrompt(res.data.msg)
      })
      .catch(err => {
        if(err.response?.status === 401) {
          showLoginModal()
        }else {
          errorPrompt(err.response?.data.msg)
        }
      })
 }

const handleEdit = (e)=> {
  document.getElementById("editBr-container").style.display = "block"
  let originalBreakdown = document.getElementById(props.barId).innerText
  document.getElementById('editBr-textarea').value = originalBreakdown
  document.getElementById('editBr-submit-button').className = `${props.songId}-${props.punchId}-${props.barId}`
}

  return (
    <div className = "options-container" >
    <div onClick = {showOptions} className = "option-dots-container">
    <div className = "option-dot"></div>
    <div className = "option-dot"></div>
    <div className = "option-dot"></div>
    </div>
    <ul className = "options-list-container">
    <span className = "dots-close" onClick = {(e)=> e.target.parentNode.style.display = "none" }>x</span>
    {props.isUser && props.options.userOnly.map((a,indx) => {
      return <li key = {indx}
      className = "option-list" onClick = {a === 'delete' ? handleDelete : handleEdit}>{a}</li>
    })}
    {!props.isUser &&  props.options.allUsers.map((a,indx)=> {
        return <li key = {indx} className = "option-list"
        onClick = {a === "award" ? props.giveAward: ()=>{}}>{a}</li>
      })
    }
    </ul>
    </div>
  )
}
