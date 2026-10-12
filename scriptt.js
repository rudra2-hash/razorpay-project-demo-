
function scrollToProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


let cart = [];

const addButtons = document.querySelectorAll(".add-button");

addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        cart.push({
            name: name,
            price: price
        });

        
    

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(cart);

    });

});


function goToCheckout() { window.location.href = "checkout.html"; }