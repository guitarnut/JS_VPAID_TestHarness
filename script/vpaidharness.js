var iframe = document.createElement("iframe"),
    body = document.getElementsByTagName("body")[0],
    load = $("#load"),
    source = $("#source"),
    creativeVars = document.getElementById("creativeVars"),
    vpaid_instance,
    videoDIV = document.getElementById("videoSlot");

var defaultScript = "http://ap.rh.lijit.com/www/admanager/ad-manager.js#zoneid=307206&loc=http://video1q.qadfw2.lijit.com/&u=rhenley&ljt=ap.rh.lijit.com&datafile=vast_mp4";
//"http://ap.rh.lijit.com/www/admanager/ad-manager.js#zoneid=307206&loc=http://video1q.qadfw2.lijit.com/&u=rhenley&ljt=vpod4q.qa.lijit.com"
// "http://redir.adap.tv/redir/javascript/jsvpaid.js";
//= "http://ap.rh.lijit.com/www/admanager/ad-manager.js#ljt=ap.lijit.com&datafile=vast_06&zoneid=246317&vtid=v_123456_23412&loc=http%3A%2F%2Fthechive.com%2F2015%2F04%2F07%2Fyou-shouldnt-be-this-relaxed-when-a-king-cobra-attacks-you-video%2F&random=1428612768&u=thechive";
source.val(defaultScript);

var environmentVarsObj = {};
environmentVarsObj.slot = document.getElementById("videoSlot");
environmentVarsObj.videoSlot = document.getElementById("videoPlayer");

var parent = this;

/* ------- AD-MANAGER LOAD ------- */

iframe.setAttribute("id", "vpaid");
iframe.setAttribute("width", "0");
iframe.setAttribute("height", "0");
iframe.style.display = "none";

body.appendChild(iframe);

saveURI();

var iWin = iframe.contentWindow,
    iDoc = iWin.document;

load.click(function (e) {
    var src = source.val();

    saveURI(src);

    videoDIV.innerHTML = "";
    videoDIV.innerHTML = "<video id=\"videoPlayer\" style=\"width: 500px; height: 300px;\"></video>";

    iDoc.open();
    iDoc.close();

    var script = iDoc.createElement("script");
    script.setAttribute("src", src);
    script.setAttribute("type", "text/javascript");

    console.log("loading: " + src);

    script.onload = function (e) {
        console.log("loaded");

        vpaid_instance = iWin.window.getVPAIDAd();

        if (typeof vpaid_instance !== 'undefined') {
            subscribe.call(parent);
        } else {
            throw new Error("Unable to find VPAID instance");
        }
    };

    script.onerror = function (e) {
        console.log(e);
    };

    // for Firefox
    try {
        iWin.document.body.appendChild(script);
    } catch (e) {
        console.log(e);
    }
});

/* ------- UI SETUP ------- */

$('#sourceArchive').change(function () {
    $('#source').val($('#sourceArchive').val());
});

$("#handshakeVersion").click(function () {
    vpaid_instance.handshakeVersion("2.0");
});

$("#initAd").click(function () {
    var cvars = {};

    try {
        if (creativeVars.value.length > 2) {
            cvars.AdParameters = decodeURIComponent(creativeVars.value);
        }
    } catch (e) {
        console.log(e);
    }

    console.log(cvars);

    vpaid_instance.initAd(500, 300, "normal", 400, cvars, environmentVarsObj);
});

$("#resizeAd").click(function () {
    vpaid_instance.resizeAd($('#resizeW').val(), $('#resizeH').val(), "linear");
});

$("#startAd").click(function () {
    vpaid_instance.startAd();
});

$("#stopAd").click(function () {
    vpaid_instance.stopAd();
});

$("#pauseAd").click(function () {
    vpaid_instance.pauseAd();
});

$("#resumeAd").click(function () {
    vpaid_instance.resumeAd();
});

$("#expandAd").click(function () {
    vpaid_instance.expandAd();
});

$("#collapseAd").click(function () {
    vpaid_instance.collapseAd();
});

$("#skipAd").click(function () {
    vpaid_instance.skipAd();
});

$("#setAdVolume").click(function () {
    vpaid_instance.setAdVolume($('#volume').val());
});

$("#getAdVolume").click(function () {
    console.log(vpaid_instance.getAdVolume());
});

$("#getAdLinear").click(function () {
    console.log(vpaid_instance.getAdLinear());
});

$("#getAdWidth").click(function () {
    console.log(vpaid_instance.getAdWidth());
});

$("#getAdHeight").click(function () {
    console.log(vpaid_instance.getAdHeight());
});

$("#getAdExpanded").click(function () {
    console.log(vpaid_instance.getAdExpanded());
});

$("#getAdSkippableState").click(function () {
    console.log(vpaid_instance.getAdSkippableState());
});

$("#getAdRemainingTime").click(function () {
    console.log(vpaid_instance.getAdRemainingTime());
});

$("#getAdDuration").click(function () {
    console.log(vpaid_instance.getAdDuration());
});

$("#getAdCompanions").click(function () {
    console.log(vpaid_instance.getAdCompanions());
});

$("#getAdIcons").click(function () {
    console.log(vpaid_instance.getAdIcons());
});

$("#safeFrameOn").click(function () {
    window.$sf = {};
    console.log("$sf object added to window");
    console.log(window);
});

$("#safeFrameOff").click(function () {
    if (window.$sf) {
        delete window.$sf;
        console.log("$sf object removed from window");
    }
});

/* ------- STORE REQUESTS ------- */

function saveURI(uri) {
    if (window.localStorage) {
        var localStorage = window.localStorage;
        var paths = JSON.parse(localStorage["sovrn_paths"] || "[]");

        $('#sourceArchive').show();

        if (!uri && paths.length === 0) {
            $('#sourceArchive').hide();
        }

        if (uri) {
            if (paths.indexOf(uri) === -1) paths.unshift(uri);
            if (paths.length > 10) paths.splice(-1, 1);
        }

        var dropdown = document.getElementById('sourceArchive');

        paths.map(function (val, index, array) {
            var option = document.createElement('option');
            option.setAttribute('value', val);
            option.text = val;
            dropdown.appendChild(option);
        });

        localStorage["sovrn_paths"] = JSON.stringify(paths);
    }

}

/* ------- VPAID SUBSCRIPTIONS AND CALLBACKS ------- */

function subscribe() {
    // custom
    vpaid_instance.subscribe(AdLoaded, "AdLoaded", parent);

    // VPAID
    vpaid_instance.subscribe(AdStopped, "AdStopped", parent);
    vpaid_instance.subscribe(AdError, "AdError", parent);
    vpaid_instance.subscribe(AdStarted, "AdStarted", parent);
    vpaid_instance.subscribe(AdSkipped, "AdSkipped", parent);
    vpaid_instance.subscribe(AdLinearChange, "AdLinearChange", parent);
    vpaid_instance.subscribe(AdExpandedChange, "AdExpandedChange", parent);
    vpaid_instance.subscribe(AdRemainingTimeChange, "AdRemainingTimeChange", parent);
    vpaid_instance.subscribe(AdVolumeChange, "AdVolumeChange", parent);
    vpaid_instance.subscribe(AdImpression, "AdImpression", parent);
    vpaid_instance.subscribe(AdVideoStart, "AdVideoStart", parent);
    vpaid_instance.subscribe(AdVideoFirstQuartile, "AdVideoFirstQuartile", parent);
    vpaid_instance.subscribe(AdVideoMidpoint, "AdVideoMidpoint", parent);
    vpaid_instance.subscribe(AdVideoThirdQuartile, "AdVideoThirdQuartile", parent);
    vpaid_instance.subscribe(AdVideoComplete, "AdVideoComplete", parent);
    vpaid_instance.subscribe(AdClickThru, "AdClickThru", parent);
    vpaid_instance.subscribe(AdUserAcceptInvitation, "AdUserAcceptInvitation", parent);
    vpaid_instance.subscribe(AdUserMinimize, "AdUserMinimize", parent);
    vpaid_instance.subscribe(AdUserClose, "AdUserClose", parent);
    vpaid_instance.subscribe(AdPaused, "AdPaused", parent);
    vpaid_instance.subscribe(AdPlaying, "AdPlaying", parent);
    vpaid_instance.subscribe(AdLog, "AdLog", parent);
    vpaid_instance.subscribe(AdSizeChange, "AdSizeChange", parent);
    vpaid_instance.subscribe(AdSkippableStateChange, "AdSkippableStateChange", parent);
    vpaid_instance.subscribe(AdDurationChange, "AdDurationChange", parent);
    vpaid_instance.subscribe(AdInteraction, "AdInteraction", parent);
}

function AdLoaded() {
    //
}

function AdStopped() {
    console.log("VPAIDEvent: AdStopped");
}

function AdError() {
    console.log("VPAIDEvent: AdError");
    console.log(arguments);
}

function AdStarted() {
    console.log("VPAIDEvent: AdStarted");
}

function AdSkipped() {
    console.log("VPAIDEvent: AdSkipped");
}

function AdLinearChange() {
    console.log("VPAIDEvent: AdLinearChange");
}

function AdExpandedChange() {
    console.log("VPAIDEvent: AdExpandedChange");
}

function AdRemainingTimeChange() {
    console.log("VPAIDEvent: AdRemainingTimeChange");
}

function AdVolumeChange() {
    console.log("VPAIDEvent: AdVolumeChange");
}

function AdImpression() {
    console.log("VPAIDEvent: AdImpression");
}

function AdVideoStart() {
    console.log("VPAIDEvent: AdVideoStart");
}

function AdVideoFirstQuartile() {
    console.log("VPAIDEvent: AdVideoFirstQuartile");
}

function AdVideoMidpoint() {
    console.log("VPAIDEvent: AdVideoMidpoint");
}

function AdVideoThirdQuartile() {
    console.log("VPAIDEvent: AdVideoThirdQuartile");
}

function AdVideoComplete() {
    console.log("VPAIDEvent: AdVideoComplete");
}

function AdClickThru() {
    console.log("VPAIDEvent: AdClickThru");
}

function AdUserAcceptInvitation() {
    console.log("VPAIDEvent: AdUserAcceptInvitation");
}

function AdUserMinimize() {
    console.log("VPAIDEvent: AdUserMinimize");
}

function AdUserClose() {
    console.log("VPAIDEvent: AdUserClose");
}

function AdPaused() {
    console.log("VPAIDEvent: AdPaused");
}

function AdPlaying() {
    console.log("VPAIDEvent: AdPlaying");
}

function AdLog() {
    console.log("VPAIDEvent: AdLog");
}

function AdSizeChange() {
    console.log("VPAIDEvent: AdSizeChange");
}

function AdSkippableStateChange() {
    console.log("VPAIDEvent: AdSkippableStateChange");
}

function AdDurationChange() {
    console.log("VPAIDEvent: AdDurationChange");
}

function AdInteraction() {
    console.log("VPAIDEvent: AdInteraction");
}