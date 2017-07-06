'use strict';
var totalSecond = 0;
var timer;
var tomatoWorkTime = 25;
var tomatoFreeTime = 5;
var timerStatus = 0;//0--关闭, 1--正常开始, 2--暂停
var tomatoStatus = 0;//0--普通模式, 1--番茄工作阶段，2--番茄休息阶段
var tomatoCount = 0;
var isRepeat = false;
var keyProtectTimerLength = 0;
var keyProtectTimer;
var recentStartTime;
$(document).ready(function () {
    $("#hourTxt").val("0");
    $("#minTxt").val("25");
    $("#sedTxt").val("0");
    $("#tomatoWorkTime").val("25");
    $("#tomatoFreeTime").val("5");
});

$(document).keydown(function (event) {
    console.log('press key :' + event.keyCode);
    if (event.keyCode === 13) {
        console.log("keyProtectTimerLength " + keyProtectTimerLength);
        if (0 === keyProtectTimerLength) {
            startProtectT();
            startT();
            keyProtectTimerLength = 5;
        }
    }
});

function setStartBtnString(text) {
    $("#startBtn").text(text);
    if (text === "继续") {
        $("#startBtn").css("background-color", "red");
    }
    else {
        $("#startBtn").css("background-color", "#DDDDDD");
    }
}

function timerTxt(timelong) {
    let hour = parseInt(timelong / 3600)
    let min = parseInt((timelong % 3600) / 60)
    let second = timelong % 60
    return ((hour) ? (hour + "小时") : "") + ((min) ? (min + "分钟") : "") + ((second) ? (second + "秒") : "")
}

function timerDisplay() {
    $("#labTimer").css('display', 'block');
    $("#TimerSeter").css('display', 'none');
    switch (tomatoStatus) {
        case 0:
            {
                $("#labTimer").html("剩余" + timerTxt(totalSecond));
                break;
            }
        case 1:
            {
                $("#labTimer").html("工作中,剩余" + timerTxt(totalSecond));
                break;
            }
        case 2:
            {
                $("#labTimer").html("休息中,剩余" + timerTxt(totalSecond));
                break;
            }
    }
}

function timerGone() {
    $("#labTimer").css('display', 'none');
    $("#TimerSeter").css('display', 'block');
}

function startProtectT() {
    keyProtectTimer = setInterval(protectTimer, 1000);
}
function protectTimer() {
    keyProtectTimerLength--;
    if (keyProtectTimerLength > 0) {

    }
    else {
        clearInterval(keyProtectTimer);
    }
}

function startT() {
    console.log("ENTER startT()");
    switch (timerStatus) {
        case 0:
            {
                totalSecond = parseInt($("#hourTxt").val()) * 3600 +
                    parseInt($("#minTxt").val()) * 60 +
                    parseInt($("#sedTxt").val());
                timerDisplay();
                setStartBtnString("暂停");
                console.log("totalSecond = " + totalSecond);
                timer = setInterval(startTimer, 1000);
                timerStatus = 1;
                break;
            }
        case 1:
            {
                setStartBtnString("继续");
                clearInterval(timer);
                console.log("暂停");
                timerStatus = 2;
                break;
            }
        case 2:
            {
                setStartBtnString("暂停");
                console.log("totalSecond = " + totalSecond);
                timer = setInterval(startTimer, 1000);
                timerStatus = 1;
                break;
            }
    }
}
function startTimer() {
    totalSecond--;
    if (totalSecond > 0) {
        console.log("还剩" + totalSecond + "秒");
        timerDisplay();
    }
    else {
        clearInterval(timer);
        switch (tomatoStatus) {
            case 0:
                {
                    console.log("结束");
                    alert("结束");
                    setStartBtnString("开始");
                    timerGone();
                    timerStatus = 0;
                    if (1 === isRepeat) {
                        startT();
                    }
                    break;
                }
            case 1:
                {
                    sendRecordToServe();
                    tomatoCount++;
                    console.log("工作结束，已经完成" + tomatoCount + "个番茄");
                    $("#tomatoCount").text("今日已完成" + tomatoCount + "个番茄");
                    alert("工作结束");
                    startTomatoFree();
                    break;
                }
            case 2:
                {
                    console.log("休息结束");
                    alert("休息结束");
                    startTomatoWork();
                    break;
                }
        }
    }
}

function clearT() {
    console.log("结束");
    setStartBtnString("开始");
    clearInterval(timer);
    totalSecond = 0;
    timerGone();
    tomatoStatus = 0;
    timerStatus = 0;
}

function istomatoTimer() {
    let val = $('input:radio[name="mode_choose"]:checked').val();
    if (val === "1") {
        clearT();
        $("#tomatoDiv").css('display', 'none');
        tomatoStatus = 0;
    }
    else {
        $("#tomatoDiv").css('display', 'block');
        tomatoStatus = 1;
    }
    console.log("当前选中了" + (val === "1"));
}

function confirmTomatoSet() {
    tomatoWorkTime = $("#tomatoWorkTime").val();
    tomatoFreeTime = $("#tomatoFreeTime").val();
    console.log("tomatoWorkTime " + tomatoWorkTime);
    console.log("tomatoFreeTime " + tomatoFreeTime);

    startTomatoWork();

}

function resetTomatoSet() {
    tomatoWorkTime = 25;
    tomatoFreeTime = 5;
    $("#tomatoWorkTime").val("25");
    $("#tomatoFreeTime").val("5");
    console.log("tomatoWorkTime " + tomatoWorkTime);
    console.log("tomatoFreeTime " + tomatoFreeTime);
    tomatoStatus = 0;
    clearT();
}

function tomatoModeChoose() {
    let val = $('input:radio[name="tomato_choose"]:checked').val();
    if (val === "1") {
        clearT();
        $("#tomatoTimeSetDiv").css('display', 'none');
        tomatoWorkTime = 25;
        tomatoFreeTime = 5;
        startTomatoWork();
    }
    else {
        clearT();
        $("#tomatoTimeSetDiv").css('display', 'block');
    }
    tomatoStatus = 1;
    console.log("当前选中了" + (val === "1"));
}

function startTomatoWork() {
    timerStatus = 0;
    let hourWorkTomatoSet = parseInt(tomatoWorkTime / 60);
    let minWorkTomatoSet = tomatoWorkTime % 60;
    console.log("hourWorkTomatoSet " + hourWorkTomatoSet);
    console.log("minWorkTomatoSet " + minWorkTomatoSet);
    $("#hourTxt").val(hourWorkTomatoSet);
    $("#minTxt").val(minWorkTomatoSet);
    $("#sedTxt").val("0");
    tomatoStatus = 1;
    recentStartTime = {
        day: getNowDay(),
        time: getNowTime()
    };
    startT();
}

function startTomatoFree() {
    timerStatus = 0;
    let hourFreeTomatoSet = parseInt(tomatoFreeTime / 60);
    let minFreeTomatoSet = tomatoFreeTime % 60;
    console.log("hourFreeTomatoSet " + hourFreeTomatoSet);
    console.log("minFreeTomatoSet " + minFreeTomatoSet);
    $("#hourTxt").val(hourFreeTomatoSet);
    $("#minTxt").val(minFreeTomatoSet);
    $("#sedTxt").val("0");
    tomatoStatus = 2;
    startT();
}

function minBtn(obj) {
    console.log(obj.name)
}

function isRepeatTimer() {
    let val = $('input:radio[name="repeat_choose"]:checked').val();
    if (val === "1") {
        isRepeat = 0;
        keyProtectTimerLength = 0;
    }
    else {
        isRepeat = 1;
        keyProtectTimerLength = 0;
    }
    console.log("当前选中了" + (val === "1"));
}

function sendRecordToServe() {
    var dataToSend = {
        'startDay': recentStartTime.day,
        'startTime': recentStartTime.time,
        'endDay': getNowDay(),
        'endTime': getNowTime(),
        'timeLength': tomatoWorkTime
    };
    console.log(JSON.stringify(dataToSend));
    $.ajax({
        type: 'POST',
        url: '/',
        data: JSON.stringify(dataToSend),
        dataType: 'json'
    });
}

function getNowDay() {
    var time = getNowFormatDate();
    return time.split(' ')[0];
}

function getNowTime() {
    var time = getNowFormatDate();
    return time.split(' ')[1];
}

function getHistory() {
    $.ajax({
        type: 'GET',
        url: '/output.txt',
        success: function (data, textStatus) {
            var record_list_string = data.split('\n');
            var record_list_obj = record_list_string.map(function (x) {
                return x === '' ? null : JSON.parse(x);
            });
            record_list_obj = record_list_obj.filter(function (x) { return x !== null });
            var total_map = {};
            record_list_obj.map(function (x) {
                total_map[x['startDay']] === undefined ? total_map[x['startDay']] = new Array(x) : total_map[x['startDay']].push(x);
            });
            console.log(JSON.stringify(total_map));
            $('#history').css('display', 'block');
            $('#history').empty();
            for (var key in total_map) {
                $('#history').append('<div id="' + key + '">' +
                    '<div class="title_l"></div>' +
                    '<div class="body_l" align="center"></div>' +
                    '</div>');
                $('#' + key).children('.title_l')[0].innerHTML = key + '  共完成' + total_map[key].length + '个番茄';
                for (var member of total_map[key]) {
                    console.log(JSON.stringify(member));
                    $('#' + key).children('.body_l').append('<p>' + '       ' + member["startDay"] + ' ' + member["startTime"] + ' ---> ' +
                        member["endDay"] + ' ' + member["endTime"] + ' : 持续' + member["timeLength"] + '分钟' +
                        '</p>');
                }
            }
        }
    });
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}