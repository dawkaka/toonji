import React,{useState,useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import axios from 'axios'
import './App.css'
import Footer from './header-footer/footer'
import Header from './header-footer/header'
import HomeView from './homePage/homeView'
import SignUpOrLogIN from './signUporLogin/signUpOrLogin'
import Favourite from "./favouritesPage/favourite";
import TrendingView from './trendingPage/trendingView';
import ReadLyricsView from './readPage/readLyrics';
import ProfileView from './profilePage/profile'
import Prompt from './prompts/prompts'
import StartQuiz from './quiz/startQuiz'
import MyProfileView from './profilePage/myprofile'
import AdminPanel from './adminPage/adminPage'
import SiteInfo from './header-footer/siteInfo'
import {DonateForm} from './payments/paypalForm'
import CookiePrompt from './header-footer/cookiePrompt'
import ErrorPage from './errors/errorPage'
import BattlePage from './quiz/battle'
import ContributorRequest from './uploadPage/contributorRequest'
import ReportBug from './header-footer/reportBug'
import EditSongs from './uploadPage/edit'
import Upload from './uploadPage/upload'

export default function App() {
  axios.defaults.withCredentials = true;
    const [globalState,setGlobalState] = useState({
      isSignedIn: false,
    })

    useEffect(()=>{
      if((document.cookie.split(";").some(e => e.startsWith(" _user_id=") || e.startsWith("_user_id=")))) {
        setGlobalState({isSignedIn:true})
      };
    if(!localStorage.getItem('accepts_cookies')){
      document.getElementById("cookie-prompt-container"
    ).style.display = "block";
    }
    },[])

     const handleSignedIn = ()=>{
       setGlobalState({isSignedIn: true})
     }
     const handleSignedOut = () => {
       setGlobalState({isSignedIn: false})
     }
    return(
      <Router>
      <SignUpOrLogIN  handleSignedIn = {handleSignedIn}/>
        <Prompt />
      <DonateForm />
        <CookiePrompt />
      <Switch>
        <Route exact path="/">
        <Header isSignedIn = {globalState.isSignedIn}
         handleSignedOut = {handleSignedOut}/>
        <HomeView />
        <SiteInfo />
        <Footer />
        </Route>
        <Route exact path ="/c/be-a-contributor">
         <ContributorRequest />
        </Route>
        <Route exact path="/favourites">
          <Favourite />
          <Footer />
        </Route>
        <Route exact path="/chart">
         <TrendingView />
         <SiteInfo />
         <Footer />
        </Route>
        <Route exact path="/p/:profileId" >
         <ProfileView />
        </Route>
        <Route exact path="/my/profile">
         <MyProfileView />
        </Route>
        <Route exact path = "/top-fan/:userName">
        <StartQuiz />
        </Route>
        <Route exact path='/go/to/contributor-panel'>
        <AdminPanel/>
        </Route>
        <Route exact path = "/battle/:battleId">
        <BattlePage />
        </Route >
        <Route exact path = "/c/report-bug">
         <ReportBug/>
        </Route >
        <Route exact path = "/c/upload">
         <Upload />
        </Route>
        <Route exact path = "/c/edit-lyrics/:lyricsId">
         <EditSongs />
        </Route>
        <Route exact path='/:lyricsId'>
        <ReadLyricsView />
        </Route>
        <Route>
        <ErrorPage />
        </Route>
      </Switch>
      </Router>
    )
  }
