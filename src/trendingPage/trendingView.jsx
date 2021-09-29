import React,{useState,useEffect} from 'react'
import {Logo} from '../header-footer/header.jsx'
import './trendingViewCss.css'
import {errorPrompt} from '../prompts/promptMessages'
import {BASEURL} from '../credentials'
import axios from 'axios'
import LoadingSpinner from '../prompts/loadingComponent';
import { trackPromise} from 'react-promise-tracker';
import {ChartCardContainer} from './trendingCards'
import {BackIcon} from '../Icons/allIcons'

export default function TrendingView() {
      const [chartResult, setChartResult] = useState({today:[],week:[],allTime:[]})
      const [chartResultBar, setChartResultBar] = useState([])
      const [chartResultUser, setChartResultUser] = useState([])
      const [chartParam,setChartParam] = useState("Songs")
         useEffect(()=>{
           document.title = "TOONJI - CHARTS"

           if(!sessionStorage.getItem(`${chartParam}`)){
           trackPromise(
            axios.get(BASEURL + '/charts/'+chartParam)
            .then(res =>{
              if(res.data.type === "ERROR"){
                errorPrompt(res.data.msg)
              }else {
                if(chartParam === "Songs"){
                setChartResult(res.data)
                sessionStorage.setItem("Songs",JSON.stringify(res.data))
              }else if(chartParam === "Punchlines") {
                setChartResultBar(res.data)
                sessionStorage.setItem("Punchlines",JSON.stringify(res.data))
              }else {
                setChartResultUser(res.data)
                sessionStorage.setItem("Users",JSON.stringify(res.data))
              }
              }
            })
            .catch(err => {
              errorPrompt("something went wrong")
            })
         )}else {
           switch (chartParam) {
             case "Songs":
               setChartResult(JSON.parse(sessionStorage.getItem("Songs")))
               break;
             case "Punchlines":
               setChartResultBar(JSON.parse(sessionStorage.getItem("Punchlines")))
               break;
             default:
               setChartResultUser(JSON.parse(sessionStorage.getItem("Users")))
           }
         }
       },[chartParam])

      const optionChange = (e) => {
        setChartParam(e.target.value)
      }

      window.addEventListener("load",()=> {
         sessionStorage.clear()
      })


  return (
    <>
    <TrendingHeader />
    <div className = "trending-view-container">
    <h1 className = "h1">Chart</h1>
      <select id="trending-select" onChange = {optionChange}>
      <option value="Songs">Songs</option>
      <option value="Punchlines">Punchlines</option>
      <option value="Users">Users</option>
      </select>
    {chartParam === "Users" && <h6 className ="chart-info">only all time available for users</h6>}
    <ChartFilter />
    <div className = "t-w-a-container">
    <LoadingSpinner height = {80} width = {80}/>
    <ChartCardContainer id = "chart-today" show ="true"
    chartResult={chartResult.today}
    param = {chartParam} filter = 'TODAY' barResult = {chartResultBar.day}
    userResult = {chartResultUser}/>
    <ChartCardContainer id = "chart-week"
    chartResult = {chartResult.week}
    param = {chartParam} filter = 'WEEK' barResult = {chartResultBar.week}
    userResult = {chartResultUser}/>
    <ChartCardContainer id = "chart-all-time"
    chartResult = {chartResult.allTime}
    param = {chartParam} filter = 'ALL-TIME' barResult = {chartResultBar.allTime}
    userResult = {chartResultUser}/>
    </div>
    </div>
    </>
  )
}
function ChartFilter() {
    function filterToggle(e) {
      let str = e.target.id;
      document.getElementById("today").classList.remove("filter-active")
      document.getElementById("week").classList.remove("filter-active")
      document.getElementById("all-time").classList.remove("filter-active")
      e.target.classList.add('filter-active')
      let elmts = document.getElementsByClassName('chart-card-container-container');
      for(let elmt of Array.from(elmts)) {
        elmt.classList.remove("chart-show")
      }
      switch (str) {
        case 'today':
          document.getElementById("chart-today").classList.add("chart-show")
          break;
        case 'week':
          document.getElementById("chart-week").classList.add("chart-show")
          break;
        case 'all-time':
          document.getElementById("chart-all-time").classList.add("chart-show")
          break;
        default:
          return
      }
    }
  return (
    <div className = "chart-filter-container">
    <h5 onClick = {filterToggle} id="today" className = "chart-filter filter-active">Today</h5>
    <h5 onClick = {filterToggle} id="week" className = "chart-filter">Week</h5>
    <h5 onClick = {filterToggle} id="all-time" className = "chart-filter">All Time</h5>
    </div>
  )
}


function TrendingHeader() {

  return (
    <div className = "trending-header-container">
     <Logo />
     <Search />
     <BackIcon />
    </div>
  )
}

function Search() {
         function handleChartSearch(e) {
           let ss = e.target.value
           let targets = document.getElementsByClassName("chart-song-title")
           for(let elm of Array.from(targets)) {
             if((elm.innerText.toLowerCase().substr(0,ss.length) === ss.toLowerCase())&& ss.length > 0){
               elm.style.backgroundColor = "var(--main-color)"
             }else {
               elm.style.backgroundColor = "transparent"
             }
           }
         }
  return(
       <input className="trending-search-box" type="search"
       placeholder="search chart" aria-label="Search"
       onChange = {handleChartSearch}/>

  )

}
