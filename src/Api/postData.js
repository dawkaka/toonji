import axios from 'axios'
export function postData(path,data) {
 axios({
      method: 'post',
      url: `http://localhost:5000${path}`,
      data:data
    })
.then(res=>{
      let prompt = document.getElementById("prompt")
      if(res.data.type === "SUCCESS"){
    document.getElementById("message").innerText = `${res.data.msg}`
    prompt.className = "prompt-container animation successBorder"
    document.getElementById("sign-login-collapse").style.transform = "scale(0)";
    window.setTimeout(()=>{
      prompt.className = "prompt-container"
    },5001)
  }
   if(res.data.type === "ERROR"){
    document.getElementById("message").innerText = `${res.data.msg}`
    prompt.className = "prompt-container animation errorBorder"
    window.setTimeout(()=>{
      prompt.className = "prompt-container"
    },5001)
  }
})
.catch(err=>{
     document.getElementById("message").innerText = `something went wrong`
     prompt.className = "prompt-container animation errorBorder"
     window.setTimeout(()=>{
       prompt.className = "prompt-container"
     },5001)
   })
}
