import React from 'react';

import './paypalForm.css'
import {errorPrompt,successPrompt} from '../prompts/promptMessages'
export function DonateForm() {

     function hideDonateModal(e) {
       if(e.target.id === "donate-modal") {
        e.target.style.transform = "scale(0)"
       }
     }

     function showCryptoAdds(e) {
       document.getElementById("crypto-caret-icon").classList.toggle("caret-rotate")
       let addContainer = document.getElementById("crypto-address-container")
       addContainer.classList.toggle("crypto-display")
       let smartContainer = document.getElementById("smart-button-container")
       if(smartContainer.style.justifyContent !== "flex-start"){
         smartContainer.style.justifyContent = "flex-start"
         addContainer.style.display = "block"
       }else {
       addContainer.style.display = "none"
       smartContainer.style.justifyContent = "center"
     }
     }

 return (
  <div id = "donate-modal" onClick = {hideDonateModal}>
   <div id="smart-button-container">
   <button type="button" className = "payment-buttons"> <a href="donate.html" target ="_BLANK"
    rel="noopener noreferrer">card/paypal</a></button>
    <br />
    <button className = "payment-buttons" onClick = {showCryptoAdds}>crypto
     <i id = "crypto-caret-icon"className = "fas fa-angle-up angle-crypto"></i></button>
     <div id = "crypto-address-container">
     <Crypto font = "fab fa-" type = "bitcoin" address = "bc1q4p7zn0wrtz4nm9rsxm7hwdg8n6zdxwcxqdz6l0" />
     <Crypto font = "fab fa-" type = "ethereum" address = "0xa69adc101Ad993C16E78e9823421fbdDb9A26c01" />
     </div>
  </div>
  </div>
 )
}

function Crypto(props) {
  const copyAddress = e => {
    try{
    let inp = document.createElement("input")
    inp.setAttribute('type',"text");
    inp.value = props.address;
    e.target.parentNode.appendChild(inp);
    inp.select();
    document.execCommand("copy")
    inp.style.display = "none";
    successPrompt(props.type + " address copied")
  }catch(e) {
    errorPrompt("address not copied, try again.")
   }
  }


  return (
    <div className = "crypto">
    <i className = {props.font + props.type}></i>
    <p>{props.address}</p>
    <button className = "copy-address" onClick = {copyAddress}>copy</button>
    <span>{props.type}</span>
    </div>
  )
}
