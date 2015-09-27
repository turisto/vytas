jQuery(document).ready(function ($) {
    var suf = $('.contact-form').data('suf');
    init_FormValidator(suf);
    CaptchaHandler(suf);
    var contactPath = inafx_theme.ajaxurl + '?action=inafx_hook_contact_form';

    $("#btn-Send" + suf).click(function () {
        var txtName = $('#txtName' + suf);
        var txtEmail = $('#txtEmail' + suf);
        var txtMessage = $('#txtMessage' + suf);
        
        if ($('#form-contact-us' + suf).valid()) {
            var ajaxRequest = $.ajax({
                dataType: "json",
                url: contactPath,
                type: "POST",
                data: { txtName: txtName.val(), txtEmail: txtEmail.val(), txtMessage: txtMessage.val(), txtMailTo: '' },
                beforeSend: function () {
                    $("#btn-Send" + suf).button('loading');
                }
            });

            ajaxRequest.fail(
            function (data) {
                var $message = '<i class="fa fa-times-circle"></i> ' + data.responseText;
                $("#contact-form-message" + suf).addClass("alert alert-danger");
                $("#contact-form-message" + suf).html($message);
                $("#btn-Send" + suf).button('reset');
            });

            ajaxRequest.done(
            function (response) {
                var $message = '';
                if (response.status == 'success') {
                    $message = '<i class="fa fa-check-circle"></i> ' + response.message;
                    $("#contact-form-message" + suf).addClass("alert alert-success");
                }
                else {
                    $message = '<i class="fa fa-times-circle"></i> ' + response.message;
                    $("#contact-form-message" + suf).addClass("alert alert-danger");
                }
                $("#contact-form-message" + suf).html($message);
            });

            ajaxRequest.always(
                function () {
                    $("#btn-Send" + suf).button('reset');
                    $("#form-contact-us" + suf)[0].reset();
                }
            );
        }
    });
});

function CaptchaHandler(suf) {
    var array_vals = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    var array_operators = new Array('+', '+');
    var index = parseInt(Math.random() * 10);
    index = (index == 0) ? index : (index - 1);
    var hidden_val_1 = array_vals[index];
    index = parseInt(Math.random() * 10);
    index = (index == 0) ? index : (index - 1);
    var hidden_val_2 = array_vals[index];
    index = parseInt(Math.random() * 10) % 2;
    var hidden_operator = array_operators[index];
    var result = 0;
    switch (hidden_operator) {
        case '*':
            result = hidden_val_1 * hidden_val_2;
            break;
        default:
            result = hidden_val_1 + hidden_val_2;
            break;
    }

    jQuery('label[for="txtCaptcha' + suf + '"]').html('<strong>What is ' + hidden_val_1 + ' ' + hidden_operator + ' ' + hidden_val_2 + ' = ?</strong>');

    var txtCaptchaResult = '<input type="hidden" id="txtCaptchaResult' + suf + '" />';
    jQuery("body").append(txtCaptchaResult);
    jQuery("#txtCaptchaResult" + suf).val(result);
}

function init_FormValidator(suf) {
    var txtName = 'txtName' + suf;
    var txtEmail = 'txtEmail' + suf;
    var txtMessage = 'txtMessage' + suf;
    var txtCaptcha = 'txtCaptcha' + suf;
    $.validator.addMethod("required", $.validator.methods.required, '<i class="fa fa-times-circle"></i> required.');
    $.validator.addMethod("email", $.validator.methods.email, '<i class="fa fa-exclamation-circle"></i> invalid.');
    $.validator.addMethod("captcha", $.validator.methods.equalTo, '<i class="fa fa-times-circle"></i> wrong.');
    $.validator.addClassRules("captcha", { captcha: '#txtCaptchaResult' + suf });

    $('#form-contact-us' + suf).validate({
        errorPlacement: function (error, element) {
            error.insertAfter(element);
            $('<div class="clearfix"></div>').insertBefore(error);
            $('<div class="clearfix"></div>').insertAfter(error);
            error.css({ right: '16px', top: element.position().top + 1, position: 'absolute', 'z-index': 900 });
        },
        invalidHandler: function (event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
        }
    });
}