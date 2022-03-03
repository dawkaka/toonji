import React,{useState} from 'react'
import './reportsCss.css'
import {Link} from 'react-router-dom'
import {trackPromise} from 'react-promise-tracker';
import {BASEURL} from '../credentials'
import LoadingSpinner from '../prompts/loadingComponent';
import {errorPrompt,successPrompt} from '../prompts/promptMessages'
import axios from 'axios'
export default function Reports() {

    const [reportedSongs,setReportedSongs] = useState([])
    const [request,setRequest] = useState([])
    const [bugReports,setBugReports] = useState([])

    const getReportedLyrics = ()=> {
      trackPromise(
       axios.get(BASEURL + '/songs/reported-songs')
        .then(res => {
            setReportedSongs(res.data)
        })
        .catch(e => {
          errorPrompt(e.response?.data.msg)

        })
      )
    }

  const getContributorRequests = () => {
      trackPromise (
        axios.get(BASEURL + "/c/contributor-request")
        .then(res => {
            setRequest(res.data)
        }).catch(e =>{
          errorPrompt(e.response?.data.msg)
        }),"request")
  }

  const getBugReports = () => {
      trackPromise(
        axios.get(BASEURL + "/c/bug-reports")
        .then(res => {
            setBugReports(res.data)
        })
        .catch(e => {
          errorPrompt(e.response?.data.msg)
        })
      )
  }


  return (
    <div id = "reports-view" className = "below-head-view-container">
     <h4>reported songs </h4>
     <button className = "reported-songs-button" onClick = {getReportedLyrics}>get all</button>
     <div className = "reported-songs-container">
     <div className = "spinner-container">
     <LoadingSpinner  heigth = {30} width = {30}/>
     </div>
     {reportedSongs.map((a,i) => {
       return (
         <ReportedSong key = {i} songImage = {a.songCover} songTitle = {a.songTitle}
         songId = {a.songId} songArtist = {a.songArtist} reports = {a.reports}/>
       )
     })}
     </div>
     <h4>contributor request</h4>
     <button className = "reported-songs-button" onClick = {getContributorRequests}>
     get all</button>
     <div className = "reported-songs-container">
     <div className = "spinner-container">
     <LoadingSpinner  heigth = {30} width = {30} area = "request"/>
     </div>
     {request.map((a,i) => {
       return (
         <Request key = {i} name = {a.name} rrMessage = {a.rrMessage}
          points = {a.points} id = {a.id}/>
       )
     })}
     </div>
     <h4>bug report</h4>
     <button className = "reported-songs-button" onClick = {getBugReports} >get all</button>
     <div className = "reported-songs-container">
     <div className = "spinner-container">
     <LoadingSpinner  heigth = {30} width = {30} area = "what"/>
     </div>
     {bugReports.map((a,i) => {
       return (
         <Request key = {i} name = {a.name} rrMessage = {a.rrMessage}
          points = {a.points} id = {a.id} bug = {true}/>
       )
     })}
     </div>
    </div>
  )
}

function Request(props) {

  const acceptRequest = () => {
      axios.post(BASEURL + "/c/request/" + props.id)
      .then(res => {
           successPrompt(res.data.msg)
      }).catch(e =>        errorPrompt(e.response?.data.msg))
  }

  const deleteRequest = () => {
      axios.delete(BASEURL + "/c/request/" + props.id)
      .then(res => {
           successPrompt(res.data.msg)
      }).catch(e => errorPrompt(e.response?.data.msg))
  }

  return (
    <div className = "request-container">
    <div className = "request-details">
    <h3>{props.name} <span>{props.points}</span></h3>
    </div>
    <p>{props.rrMessage}</p>
    <button className = "profile-buttons" onClick = {deleteRequest}> delete </button>
    {!props.bug && <button className = "profile-buttons"
    onClick = {acceptRequest}>accept</button>}
    </div>
  )
}


function ReportedSong(props) {
    const [cancel,setCancel] = useState(false)
    const clearSongReports = (e) => {
       axios.post(BASEURL + '/songs/clear-reports/'+ props.songId)
       .then(res => {
         let msg = res.data.msg;
           setCancel(true)
           successPrompt(msg)
       })
       .catch(e => {
         errorPrompt(e.response?.data.msg)
       })
    }
  return (
    <div className = "report-song-container">
    <div className = {cancel ? 'cancel-out show-cross':'cancel-out'}>
    </div>
    <div className = "report-details">
    <img className = "report-image"
    src = {`${BASEURL}/lyrics/image/${props.songImage}`}
    alt="song cover" />
    <div className = "report-details-text">
    <Link to={`/${props.songId}`}><h3>{props.songTitle}</h3></Link>
    <h5>{props.songArtist}</h5>
    </div>
    </div>
    <ul>
    {
      props.reports.map((b,i)=>{
        return (
          <li key ={i}>{b}</li>
        )
      })
    }
    </ul>
    <button id = "clear-reports" onClick = {clearSongReports}>clear</button>
    </div>
  )
}
