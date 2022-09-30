window.onload = () => {
    $('#submit-cart').on('click', () => {
        console.log("YESSS");
        let quantity = $('#order').val();
        console.log(quantity);
        if (quantity>0) {
            fetch('/info/'+userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    musicId: musicId,
                    quantity: quantity
                })
            }).
            then(response => response.json()).
            then(data => {
                console.log(data);
                if (data.success) {
                    $('#post-status').html('<p style="color:green">'+data.msg+'</p>');
                    window.location.href = '/cart';
                } else {
                    $('#post-status').html('<p style="color:red">'+data.msg._message+'</p>');
                }
            });
        } 
    });
};