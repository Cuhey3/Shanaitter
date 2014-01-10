function start() {
    domain = "http://localhost";
    tweets = null;
    currentTweet = "";
    username = null;
    visible = false;
    info = true;
    mailinfo = false;
    reply = {};
    timeMode = false;
    tweetsSize = 300;
    oids = {};
    windowValidate = true;
    users = getUsers();
    build();
    mailtimer = null;
    logOutLink();
    username = $.cookie("username");
    newest = {};
    if (username !== null && username !== undefined & username !== "") {
        pageLoad();
    } else {
        modalPop();
    }
}

function pageLoad() {
    drawStatus();
    getTweets();
    setInterval(function() {
        checkTweets();
    }, 15000);
    setInterval(function() {
        drawTime(false);
        drawStatus();
    }, 60000);
    $("#shout,#wisp").click(function() {
        postTweet(this.id);
    });

    $("#visibleconfig").click(function() {
        visible = !visible;
        $("#tweets .hidden").toggleClass("hide");
        if (visible) {
            $(this).val("全表示モード");
        } else {
            $(this).val("通常表示モード");
        }
    });
    info = users[username]["info"];
    if (info) {
        $("#infoconfig").val("通知 ON");
    } else {
        $("#infoconfig").val("通知 OFF");
    }
    $("#infoconfig").click(function() {
        info = !info;
        if (info) {
            $(this).val("通知 ON");
        } else {
            $(this).val("通知 OFF");
            alert("通知を OFF にしました。");
        }
    });
    if (mailinfo) {
        $("#mailinfo").val("メール通知 ON");
    } else {
        $("#mailinfo").val("メール通知 OFF");
    }
    $("#mailinfo").click(function() {
        mailinfo = !mailinfo;
        if (mailinfo) {
            $(this).val("メール通知 ON");
            mailtimer = setInterval(function() {
                checkMail();
            }, 60000);
        } else {
            $(this).val("メール通知 OFF");
            clearInterval(mailtimer);
            alert("メール通知を OFF にしました。");
        }
    });
    $(window).focus(event, function() {
        access(drawStatus);
    });
}
function modalPop() {
    var arr = [];
    for (var u in users) {
        arr.push(u);
    }
    var c = Math.ceil(arr.length / 2);
    for (var i = 0; i < c; i++) {
        if (arr[i + c] === undefined) {
            $("#modalTable").append("<tr><th>・</th><td class=\"user\">" + arr[i] + "</td><th></th><td></td></tr>");
        } else {
            $("#modalTable").append("<tr><th>・</th><td class=\"user\">" + arr[i] + "</td><th>・</th><td class=\"user\">" + arr[i + c] + "</td></tr>");
        }
    }

    $("#modalBody .user").click(function() {
        if (window.confirm("ユーザー名：" + $(this).text() + " を使用します。")) {
            $.cookie("username", $(this).text());
            username = $(this).text();
            $("#modal").hide();
            access(new Function);
            pageLoad();
        }
    });
    $("#modalBody").css({"height": arr.length / 2 * 25 + 65 + "px"})
            .css({"margin-left": -$("#modalBody").innerWidth() / 2, "margin-top": -$("#modalBody").innerHeight() / 2 - 50});
    $("#modal").show();
}

function postTweet(scope) {
    var twVal = $("#tweet").val();
    if (twVal === "") {
        return false;
    } else if (twVal.length > 800) {
        alert("文字数が制限を越えています。(" + twVal.length + "字)\n800文字以下にして投稿してください。");
        return false;
    } else if (username === "testuser") {
        alert("テストユーザーでは発言できません。\nログインしなおしてください。");
        return false;
    } else if (tweets[tweets.length - 1] && decodeURI(tweets[tweets.length - 1].tweet) === twVal || currentTweet === twVal) {
        alert("二重投稿です。");
        return false;
    } else {
        reply = {};
        $("#tweet").val("");
        currentTweet = twVal;
        commonRequest(domain + ":28017/test/tweets/",
                {"tweet": encodeURI(twVal), "time": new Date().getTime(), "author": username, "scope": scope},
        function() {
            commonRequest(domain + ":28017/test/login/",
                    {"time": new Date().getTime(), "author": username},
            function() {
                getTweets();
                drawStatus();
                $("#tweet").val("");
            });
        });
    }
}

function checkTweets() {
    oJsr1 = new JSONscriptRequest(domain + ':28017/test/tweets/?jsonp=callback1');
    oJsr1.buildScriptTag();
    oJsr1.addScriptTag();
}

function getTweets() {
    oJsr2 = new JSONscriptRequest(domain + ':28017/test/tweets/?jsonp=callback2');
    oJsr2.buildScriptTag();
    oJsr2.addScriptTag();
}

function drawTweets() {
    var hideId = "";
    var now = new Date().getTime();
    var tweetsView = ($("<div>").prependTo("#tweets"))[0];
    for (var i = tweets.length - 1; i >= 0; i--) {
        var record = tweets[i];
        if (oids[record["_id"]["$oid"]] === true) {
            break;
        }

        if (record.deleteTo !== undefined && record.deleteTo !== null) {
            if (hideId === "") {
                hideId = "#" + record.deleteTo;
            } else {
                hideId += ",#" + record.deleteTo;
            }
            oids[record["_id"]["$oid"]] = true;
            continue;
        }
        var visClass;
        var commentMod;
        if (record.scope === "shout") {
            commentMod = "さんの発言\t";
            visClass = "tweetleft";
        } else {
            commentMod = "さんのつぶやき\t";
            visClass = "tweetright";
            if (username !== record.author && decodeURI(record.tweet).indexOf(username) === -1) {
                if (visible) {
                    visClass = "tweetright hidden";
                } else {
                    visClass = "tweetright hidden hide";
                }
            }
        }
        var tw = decodeURI(record.tweet);
        tw = tw.replace("<", "&lt;").replace(">", "&gt;").replace(/(https?:\/\/.*)$/mg, "<a href=\"$1\" target=\"_blank\">$1</a>")
                .replace(/(\\\\.*)$/mg, "<a href=\"$1\">$1</a>")
                .replace(/\r\n/g, "<br />").replace(/(\n|\r)/g, "<br />").replace(/(<br \/>)+$/, "");
        var dl = "<dl class=\"" + visClass + "\" id=\"o" + record["_id"]["$oid"] + "\"><dt>" +
                "<div class=\"author\"><a href=\"#\" onclick='insertReply(this);'>" + record.author + "</a>" + commentMod + "</div>" +
                "<div class=\"time\" t=\"" + record.time + "\" onclick=\"timeMode=!timeMode;drawTime(true);\">" + timeExp(now, record.time) + "</div>" +
                "</dt><dd>" + tw + "</dd></dl>";
        $(tweetsView).append(dl);
        oids[record["_id"]["$oid"]] = true;
    }
    $(hideId).hide();
    $(tweetsView).find(".author a").bind("contextmenu", function() {
        deleteTweet($(this).parents("dl").attr("id"), users[username]["edit"]);
        return false;
    });
}

function deleteTweet(oid, bool) {
    var message = "";
    if (bool) {
        message += "■一度削除すると、元に戻せません。■\n■フィードバックのため、コピペ等を残してください。■\n\n";
    } else {
        if ($("#" + oid).find(".author a").text() !== username) {
            return false;
        } else if (new Date().getTime() - $("#" + oid + " .time").attr("t") > 60 * 1000 * 10) {
            alert("削除の有効期間を過ぎています。");
            return false;
        }
    }
    if (confirm(message + "※以下のつぶやきを削除しますか？\n\n" + $("#" + oid + " dd").text())) {
        commonRequest(domain + ":28017/test/tweets/",
                {"tweet": "つぶやき削除コマンドが発行されました。\nこのつぶやきはver0.3.1.0以上では表示されません。", "time": new Date().getTime(), "author": username, "scope": "wisp", "deleteTo": oid},
        function() {
            getTweets();
        });
    }
}

function drawStatus() {
    oJsr3 = new JSONscriptRequest(domain + ':28017/test/login/?jsonp=callback3');
    oJsr3.buildScriptTag();
    oJsr3.addScriptTag();
}

function drawTime(b) {
    if (timeMode) {
        $("#tweets .time").each(function() {
            var e = new Date($(this).attr("t") - 0);
            $(this).text(e.toLocaleString());
        });
    } else {
        var now = new Date().getTime();
        $("#tweets .time").each(function() {
            $(this).text(timeExp(now, $(this).attr("t")));
        });
    }
    if (b) {
        $("#tweets .time").toggleClass("italic");
    }
}

function nextVisibleTweet(rows, flag) {
    var len = rows.length;
    for (var i = len - 1; i >= 0; i--) {
        var record = rows[i];
        if (record.deleteTo !== undefined) {
            continue;
        } else if (record.scope === "shout"
                || username === record.author
                || decodeURI(record.tweet).indexOf(username) !== -1
                || visible) {
            if (flag === undefined) {
                return record.tweet;
            } else {
                return record.author;
            }
        }
    }
    return "";
}

function access(f) {
    commonRequest(domain + ":28017/test/login/",
            {"time": new Date().getTime(), "author": username},
    f);
}

function checkMail() {
    oJsr4 = new JSONscriptRequest('http://192.168.1.126:3333/?jsonp=callback4');
    oJsr4.buildScriptTag();
    oJsr4.addScriptTag();
}

function logOutLink() {
    $("#version_alert").text("ログアウト").click(function() {
        windowValidate = false;
        if (window.confirm("ログアウトしますか？")) {
            access(function() {
                $.removeCookie("username");
                window.close();
            });
        } else {
            windowValidate = true;
        }
    });
}

function callback1(data) {
    if (tweets[tweets.length - 1]["_id"]["$oid"] !== data.rows[0]["_id"]["$oid"]) {
        getTweets();
    }
    oJsr1.removeScriptTag();
}

function callback2(data) {
    if (info && tweets !== null && !document.hasFocus()
            && nextVisibleTweet(tweets) !== nextVisibleTweet(data.rows)) {
        var sh = new ActiveXObject("WScript.Shell");
        var message = decodeURI(nextVisibleTweet(data.rows));
        if (message.length > 80) {
            message = message.substr(0, 80) + "...";
        }
        sh.Run('msg Console /time:1800 "■' + nextVisibleTweet(data.rows, true) + 'さんより発言がありました。\n\n' + message + '"', 0, true);
        sh = null;
    }
    tweets = data.rows;
    drawTweets();
    oJsr2.removeScriptTag();
}

function callback3(data) {
    var already = {};
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    now = new Date().getTime();

    var rows = data.rows;
    var update = $("<div>");
    $("<p>").text("最終アクセス").css("padding", "2px 0").appendTo(update);
    var table = $("<table>").appendTo(update);
    for (var i = rows.length - 1; i >= 0; i--) {
        var record = rows[i];
        if (record.time < midnight)
            continue;
        var author = record.author.replace(/ $/, "");
        if (already[author] === undefined) {
            var tr = document.createElement("tr");
            var a = document.createElement("a");
            $(a).attr("href", "#").text(author).click(function() {
                insertReply(this);
                return false;
            });
            $("<td>").append(a).addClass("u").appendTo(tr);
            $("<td>").text(timeExp(now, record.time)).addClass("time").appendTo(tr);
            $(table).append(tr);
            already[author] = true;
        }
    }
    var td = $("<td>").appendTo($("<tr>").appendTo(table));
    $(td)[0].colSpan = 2;
    $(td).html("<hr>");
    for (var u in users) {
        if (already[u] === undefined) {
            var tr = document.createElement("tr");
            var a = document.createElement("a");
            $(a).attr("href", "#").text(u).click(function() {
                insertReply(this);
                return false;
            });
            $("<td>").append(a).addClass("u").appendTo(tr);
            $("<td>").text("").addClass("time").css("text-align", "center").appendTo(tr);
            $(table).append(tr);
        }
    }
    $("#users").html(update);
    oJsr3.removeScriptTag();
}

function callback4(data) {
    for (var p in data) {
        if (newest[p] !== undefined && newest[p] < data[p]) {
            var sh = new ActiveXObject("WScript.Shell");
            sh.Run('msg Console /time:1800 "メールが届きました。\n\n' + p + '"', 0, true);
            sh = null;
        }
    }
    newest = data;
    oJsr4.removeScriptTag();
}