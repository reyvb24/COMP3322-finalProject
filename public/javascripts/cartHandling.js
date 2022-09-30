window.onload = () => {
    let totalprice = 0;
    fetch('cart/data/'+userId).
    then(response => {
        if (response.status==200) {
            response.json().then(
                cart => {
                    // console.log(musics.msg);
                    console.log(cart);
                    totalprice+=populateCart(cart.data);
                    $('#total-price').html(`<p>Total Price: HK$${totalprice}`);
                    if (totalprice===0) {
                        $('#checkout-button').attr('disabled', true);
                    }
                });
        }
    });

    $('#back-button').on('click', () => {
        window.location.href = '/';
    });

    $('#checkout-button').on('click', () => {
        window.location.href = '/checkout';
    });
};

const populateCart = (carts) => {
    let result = '';
    let totalCart = 0;
    let totalprice = 0;
    for (let cart of carts) {
        let price = parseFloat(cart.musicId.price.$numberDecimal);
        result+=`
        <div class='cart-card'>
            <div class='image-holder'>
                <img src="../${cart.musicId.image}" alt="image not available">
            </div>
            <div class='content-holder'>
                <div class='info-holder'>
                    <p>Music: ${cart.musicId.musicName}</p>
                    <p>Quantity: ${cart.quantity}</p>
                    <p>Price: $${price}</p>
                </div>
                <div class='total-holder'>
                    <button type='button' class='delete-button' onclick='deleteRecord(event,this)' data="${cart._id}">Delete</button>
                    <p>Total price for this item: $${price*cart.quantity}</p>
                </div>
            </div>
        </div>
        `;
        totalprice+=price*cart.quantity;
    }
    $('#cart-holder').html(result);
    return totalprice;
};

const deleteRecord = (evt, instance) => {
    fetch('cart/data/'+instance.getAttribute('data'), {
        method: 'DELETE'
    }).
    then(res => res.json()).
    then(res => {
        console.log(res);
        fetch('cart/data/'+userId).
        then(response => {
            if (response.status==200) {
                response.json().then(
                    cart => {
                        // console.log(musics.msg);
                        console.log(cart);
                        changeAmountCart();
                        totalprice = populateCart(cart.data);
                        $('#total-price').html(`<p>Total Price: HK$${totalprice}`);
                        if (totalprice===0) {
                            $('#checkout-button').attr('disabled', true);
                        }
                    });
            }
        });
    });
};  

const changeAmountCart = () => {
    fetch('../cart/datacount').
        then(response => {
            if (response.status==200) {
                response.json().then(
                    quantity => {
                        // console.log(musics.msg);
                        console.log(quantity);
                        $('#cart-nav').html(`<button type='button'id="cart-button" class='nav-button buttons'>Cart</button><p>${quantity.quantity}</p>`);
                    });
            }
        }).catch(err=>console.log(err));
};
