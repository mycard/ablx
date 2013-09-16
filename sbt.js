window.onload = function dat() {
    document.getElementById("date").value = new Date().toJSON().slice(0, 10);
    document.getElementById("l1").value = localStorage.alx
};
function bb(x) {
    var b = "";
    for (var i = 13 - x.replace(/[^\x00-\xff]/g, "**").length; i > 0; i--) {
        b += " "
    }
    return b
}
function sub() {
    var txt = "",
        tx2 = "",
        a1 = document.getElementById("l3").value.split(' ').shuffle(),
        a2 = document.getElementById("l4").value.split(' ').shuffle();
    if (a1.length == a2.length) {
        txt = "比赛： " + document.getElementById("l1").value + "     VS     " + document.getElementById("l2").value + "\n"
            + "时间： " + document.getElementById("date").value + "\n"
            + "规则： " + document.getElementById("la").value + "\n"
            + "地点：" + document.getElementById("lb").value + "\n" + "------------第一轮------------" + "\n";
        for (var i = a1.length - 1; i >= 0; i--) {
            tx2 += a1[i] + bb(a1[i]) + "0:0" + bb(a2[i]) + a2[i] + "\n"
        }
        ;
        document.getElementById("message").value = txt + tx2 + "------------第二轮------------";
        localStorage.alx = document.getElementById("l1").value;
    } else {
        alert("2队人数不同！")
    }
    ;
}
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
        for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    };
}