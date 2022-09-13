let testNumber = document.querySelector("#test");

testNumber.on("change", function (value) {
    console.log("Num changed event: ", value);
});

testNumber.on("decrease", function (value) {
    console.log("Num decrease event: ", value);
});

testNumber.on("increase", function (value) {
    console.log("Num increase event: ", value);
});

testNumber.on("noSuchEvent", function () { /* No such event */ });

setTimeout(function () {
    testNumber.val(10, true);
}, 2500);

setTimeout(function () {
    testNumber.setMin(10);
    testNumber.setMax(100);
    testNumber.val(500);
    testNumber.val(9);
    testNumber.removeBounds();
    testNumber.val(1500);
}, 5000);