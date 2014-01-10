function timeExp(now, time) {
    var span = (now - time) / 1000;
    if (span < 60) {
        return "現在";
    } else if (span < 3600) {
        return Math.floor(span / 60) + "分";
    } else if (span < (3600 * 24)) {
        return Math.floor(span / 3600) + "時間";
    } else {
        return Math.floor(span / (3600 * 24)) + "日";
    }
}

function insertReply(a) {
    var m = $(a).text();
    if ($("#tweet").val() === "") {
        reply = {};
    }
    reply[m] = true;
    var anchor = "> ";
    for (var m in reply) {
        anchor += m + "さん, ";
    }
    $("#tweet").val(anchor.replace(/, $/, "\n")).focus();
}

function commonRequest(url, json, func) {
    var jsonString = JSON.stringify(json);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
            xhr.onreadystatechange = new Function;
            func();
        }
    };
    xhr.open("POST", url);
    xhr.send(jsonString);
}
