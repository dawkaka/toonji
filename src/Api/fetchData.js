
import { trackPromise} from 'react-promise-tracker';
import axios from 'axios'
export function getData(path){
return  axios.get(`http://localhost:5000${path}`)
  .then(res =>{
      let prompt = document.getElementById("prompt")
      if(res.data.type === "ERROR"){
         document.getElementById("message").innerText = `${res.data.msg}`
         prompt.className = "prompt-container animation errorBorder"
         window.setTimeout(()=>{
           prompt.className = "prompt-container"
         },5001)
       }else {
         return res.data
       }
       })
  .catch((err)=>{
    console.log(err.message);
        showErrorMessage()
   })
}
export function showErrorMessage() {
  document.getElementById("message").innerText = `something went wrong`
  document.getElementById("prompt").className = "prompt-container animation errorBorder"
  window.setTimeout(()=>{
    prompt.className = "prompt-container"
  },5001)
}
