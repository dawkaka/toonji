let amount = 5;

window.addEventListener("load",()=>{

  let userLogin = document.cookie.split(';')
                  .map(a => a.trim())
                  .some(b => b.substr(0,8) === '_user_id')

  if(!userLogin) {
    document.getElementById("not-login-info").style.display = "block"
  }
})

function amountChange() {
  amount = document.getElementById("amount").value
  if(amount < 1) {
    document.getElementById("amount").value = 1
  }
  amount = document.getElementById("amount").value
  document.getElementById("amount-of-coins").value = (amount * 100) + " coins"
}
  function initPayPalButton() {
    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal',

      },

      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{"amount":{"currency_code":"USD","value": amount }}],
           application_context: {shipping_preference: 'NO_SHIPPING'}
        });
      },

      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          console.log(details);
          const confirmURL = {link: details.links[0].href};
          fetch('/api/coins/buy-coins', {
                  method: 'POST',
                  mode: 'cors',
                  cache: 'no-cache',
                  credentials: 'same-origin',
                  headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  redirect: 'follow',
                  referrerPolicy: 'no-referrer',
                  body: JSON.stringify(confirmURL)
                 })
       .then(response => response.json())
       .then(data => {
           if(data.type === 'SUCCESS') {
             document.getElementById("api-message").innerText = data.msg + ". Thank You!"
           }
        })
       .catch(err => {
           console.log(err);
         })
       })
      },

      onError: function(err) {
         alert('something went wrong, try again')
      }
    }).render('#paypal-button-container');
  }
  initPayPalButton();
