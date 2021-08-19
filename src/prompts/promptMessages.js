
export function successPrompt(message) {
  let prompt = document.getElementById("prompt")
  document.getElementById("message").innerText = `${message}`
  prompt.className = "prompt-container animation successBorder"
  window.setTimeout(()=>{
    prompt.className = "prompt-container"
  },5001)
}

export function errorPrompt(message) {
  let prompt = document.getElementById("prompt")
  document.getElementById("message").innerText = `${message}`
   prompt.className = "prompt-container animation errorBorder"
  window.setTimeout(()=>{
    prompt.className = "prompt-container"
  },5001)
}

export function showLoginModal() {
  document.getElementById("sign-login-collapse").style.transform = 'scale(1)';
  document.getElementById("form-collapse").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}
