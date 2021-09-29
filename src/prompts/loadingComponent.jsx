import React from 'react'
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner'


export default function LoadingSpinner(props) {
  const { promiseInProgress } = usePromiseTracker({area: props.area});
  return (
    <div id= "loader-container">
    <center>
    {
      (promiseInProgress === true) ?
    <Loader type="ThreeDots" color={props.color ?props.color:"var(--main-color)"} height={props.height} width={props.width} />:
    null
  }
  </center>
    </div>
  )

}
