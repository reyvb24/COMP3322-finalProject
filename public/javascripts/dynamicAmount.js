const changeAmount = () => {
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

changeAmount();