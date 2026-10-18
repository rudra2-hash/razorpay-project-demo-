

const cart = JSON.parse(localStorage.getItem("cart")) || [];


const productSummary = document.getElementById("product-summary");
const totalPrice = document.getElementById("total-price");


let total = 0;


cart.forEach(function(product) {

    const productDiv = document.createElement("div");

    productDiv.classList.add("product");

    productDiv.innerHTML = `
        <span>${product.name}</span>
        <span>₹${product.price}</span>
    `;

    productSummary.appendChild(productDiv);

    total = total + product.price;
});




totalPrice.textContent = "₹" + total;


document.getElementById("payment-button").onclick = function() { fetch("https://razorpay-project-backend.onrender.com/create-order",
     { method: "POST",
     headers: { "Content-Type": "application/json" }, 
     body: JSON.stringify({ amount: total }) })
    .then(response => response.json())
    .then(data => {

        console.log(data);
        console.log(data.id);

        const options = {
            key: "rzp_test_TgDIfz5V4cYjNK",
            amount: data.amount,
            currency: data.currency,
            order_id: data.id,

            handler: function(response) {

        fetch("https://razorpay-project-backend.onrender.com/verify-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    })
    .then(result => result.json())
    .then(data => {
        console.log(data);
          if (data.success) {
        document.getElementById("pay-status").innerHTML =`
        <div class="success-message">
            <h1>✓ Payment Successful</h1>
            <p>Thank you for your order!</p>
            <p>Your order will reach you soon.</p>
        </div>
    `;
            
    }
    });

      
        }
    }

        const razorpay = new Razorpay(options);

        razorpay.open();

    });

};






