/* global trackGeoLocation, jqueryReady */

/* exported resourceLoadedSuccessfully */

function requestGeoPosition() {
    // console.log('Requesting GeoLocation data from the browser...');
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showGeoPosition, logGeoLocationError,
            {maximumAge: 600000, timeout: 8000, enableHighAccuracy: true});
    } else {
        console.log('Browser does not support Geo Location');
    }
}

function logGeoLocationError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        console.log('User denied the request for GeoLocation.');
        break;
    case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
    case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
    default:
        console.log('An unknown error occurred.');
        break;
    }
}

function showGeoPosition(position) {
    let loc = position.coords.latitude + ',' + position.coords.longitude
        + ',' + position.coords.accuracy + ',' + position.timestamp;
    console.log("Tracking geolocation for " + loc);
    $('[name="geolocation"]').val(loc);
}


function preserveAnchorTagOnForm() {
    $('#fm1').submit(function () {
        var location = self.document.location;
        var hash = decodeURIComponent(location.hash);
        
        if (hash != undefined && hash != '' && hash.indexOf('#') === -1) {
            hash = '#' + hash;
        }

        var action = $('#fm1').attr('action');
        if (action == undefined) {
            action = location.href;
        } else {
            var qidx = location.href.indexOf('?');
            if (qidx != -1) {
                var queryParams = location.href.substring(qidx);
                action += queryParams;
            }
        }
        action += hash;
        $('#fm1').attr('action', action);
        
    });
}

function preventFormResubmission() {
    $('form').submit(function () {
        $(':submit').attr('disabled', true);
        var altText = $(':submit').attr('data-processing-text');
        if (altText) {
            $(':submit').attr('value', altText);
        }
        return true;
    });
}

function resourceLoadedSuccessfully() {
    $(document).ready(function () {

        if (trackGeoLocation) {
            requestGeoPosition();
        }

        if ($(':focus').length === 0) {
            $('input:visible:enabled:first').focus();
        }

        preserveAnchorTagOnForm();
        preventFormResubmission();

        $('#capslock-on').hide();
        $('#fm1 input[name="username"],[name="password"]').trigger('input');
        $('#fm1 input[name="username"]').focus();

        $('#password').keypress(function (e) {
            var s = String.fromCharCode(e.which);
            if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                $('#capslock-on').show();
            } else {
                $('#capslock-on').hide();
            }
        });

        let $revealpassword = $('.reveal-password');
        $revealpassword.mouseup(function() {
            $('.pwd').attr('type', 'password');
            $("#reveal-password-icon").removeClass("fa fa-eye-slash").addClass("fa fa-eye");
        })

        $revealpassword.mousedown(function() {
            $('.pwd').attr('type', 'text');
            $("#reveal-password-icon").removeClass("fa fa-eye").addClass("fa fa-eye-slash");
        })
        
        if (typeof(jqueryReady) == 'function') {
            jqueryReady();
        }
    });

}
