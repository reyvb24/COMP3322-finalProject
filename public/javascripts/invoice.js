window.onload = () => {
    console.log(JSON.parse(window.localStorage.getItem('carts')));
    const cartsWindow = JSON.parse(window.localStorage.getItem('carts'));
    console.log(cartsWindow);
    fillReview(cartsWindow);
    console.log(userId, loggedIn);
    $('#confirm-button').on('click', () => {
        window.localStorage.removeItem('carts');
        window.location.href = '/';
    });
    fetch('/cart/deletecart/'+userId, {
        method:'DELETE',
    }).
    then(response => response.json()).
    then(
        res => {
            console.log(res);
        }
    );
    // if (loggedIn) {
    //     fetch('cart/data/'+userId).
    //     then(response => {
    //         if (response.status==200) {
    //             response.json().then(
    //                 carts => {
                        
    //                 }
    //             );
    //         }
    //     });
    // }
};

const fillReview = (carts) => {
    let result = '';
    let totalPrice = 0;
    for (let cart of carts) {
        console.log(cart.musicId.price);
        totalPrice+=cart.quantity*cart.musicId.price.$numberDecimal;
        result+=`
        <p>${cart.quantity} x ${cart.musicId.musicName} HK$${cart.musicId.price.$numberDecimal}</p>
        `;
    }
    document.querySelector('#total-price').innerHTML = `Total Price: HK$${totalPrice}`;
    document.querySelector('#orders').innerHTML = result;
};