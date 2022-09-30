window.onload = () => {
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
};

// const validate = (evt, instance) => {
//     evt.preventDefault();
//     if ($('#username').val()===''||$('#password').val()==='') {
//         alert("Please do not leave the fields empty");
//     } else {
//         instance.submit();
//     }
// }