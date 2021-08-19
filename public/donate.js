let amount = 20
function amountChange() {
  amount = document.getElementById("amount").value
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
          document.getElementById("paypal-message").innerText = "You have donated " + details.purchase_units[0].amount.value + "usd. THANK YOU";
        });
      },

      onError: function(err) {
        console.log(err);
      }
    }).render('#paypal-button-container');
  }
  initPayPalButton();
