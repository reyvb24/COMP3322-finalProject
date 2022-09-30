window.onload = () => {
    console.log(userId, loggedIn);
    if (loggedIn) {
        console.log(loggedIn);
        document.querySelector('#check-login').classList.remove('active-check-login');
        document.querySelector('#create-account').classList.remove('active');
    } else {
        $('#username').attr('required', true);
        $('#password').attr('required', true);
        $('#username').on('input', function(event) {
            if (this.validity.patternMismatch) {
                this.setCustomValidity("Username needs to be alphanumerical characters, -, _ and starts with alphabet");
            } else {
                this.setCustomValidity("");
            }
        });
    
        $('#password').on('input', function(event) {
            if (this.validity.patternMismatch) {
                this.setCustomValidity("Password needs to be 8 characters");
            } else {
                this.setCustomValidity("");
            }
        }); 
        $('#username').on('blur', ()=> {
            let username = $('#username').val();
            fetch('users/invoice/'+username).then(
                response => {
                    console.log('response:', response);
                    if (response.status==200) {
                        console.log(response);
                        response.json().then(
                            user => {
                                console.log(user);
                                if (user.data) {
                                    console.log(user);
                                    $('#err').html('<p style="color:red; font-size:small;">Username Duplicated!</p>');
                                    $('#username').val('');
                                    // return false;
                                    // event.preventDefault();
                                } else {
                                    $('#err').html('');
                                }
                            });
                    } 
                });
        });
        console.log($('#username').val());
        console.log($('#checkout-form'));
        // $('#checkout-form').submit(validate);
    }
    fetch('cart/data/'+userId).
        then(response => {
            if (response.status==200) {
                response.json().then(
                    carts => {
                        window.localStorage.setItem('carts', JSON.stringify(carts.data));
                        fillReview(carts.data);
                    }
                );
            }
        });
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
    $('#price').attr('value', totalPrice);
    document.querySelector('#total-price').innerHTML = `Total Price: HK$${totalPrice}`;
    document.querySelector('#orders').innerHTML = result;
};

async function validate(event, instance) {
    event.preventDefault();
    let username = $('#username').val()?$('#username').val():undefined;
    let password = $('#password').val();
    let result = await fetch('users/invoice/'+username).then(
        response => {
            console.log('response:', response);
            if (response.status==200) {
                console.log(response);
                response.json().then(
                    user => {
                        console.log(user);
                        if (user.data) {
                            console.log(user);
                            $('#err').html('<p style="color:red;">Username Duplicated!</p>');
                            $('#username').val('');
                            $('#password').val('');
                            // return false;
                            // event.preventDefault();
                        } else {
                            console.log(instance);
                            $('#err').html('');
                            fetch('/users/create', {
                                method:'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: JSON.stringify({
                                    username: username,
                                    password: password
                                })
                            }).
                            then(response => response.json()).
                            then(
                                res => {
                                    console.log(res);
                                    instance.submit();
                                }
                            );
                            // window.location.href = '/invoice';
                        }
                    });
            } 
        });
}