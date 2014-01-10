function build() {
    var sh = new ActiveXObject("WScript.Shell");
    sh = null;
    $("<div>", {
        id: "modal"
    }).appendTo(document.body).append($("<div>", {
        id: "modalBody"
    })).append($("<div>", {
        id: "modalBK"
    }));
    $("#modalBody").append($("<p>", {
        id: "modalMessage",
        text: "ユーザーを選択してください。"
    })).append($("<table>", {
        id: "modalTable"
    }));
    $("<div>", {
        id: "wrap"
    }).appendTo(document.body)
            .append($("<h2>", {
        id: "title",
        text: "社内ったー(仮)"
    })).append($("<div>", {
        id: "version",
        text: "ver0.3.5.0"
    })).append($("<div>", {
        id: "version_alert"
    })).append($("<div>", {
        id: "content"
    }));
    $("#content").append($("<div>", {
        id: "postarea"
    })).append($("<div>", {
        id: "users"
    })).append($("<input>", {
        id: "visibleconfig",
        type: "button",
        value: "通常表示モード"
    })).append($("<input>", {
        id: "infoconfig",
        type: "button",
        value: "通知 ON"
    })).append($("<input>", {
        id: "mailinfo",
        type: "button",
        value: "メール通知 OFF"
    })).append($("<div>", {
        id: "tweets"
    }));
    $("#postarea").append($("<textarea>", {
        id: "tweet"
    })).append($("<input>", {
        type: "button",
        value: "全員へ発言",
        id: "shout"
    })).append($("<input>", {
        type: "button",
        value: "つぶやく",
        id: "wisp"
    }));
}