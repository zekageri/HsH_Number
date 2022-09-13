# HsH_Number
This is a custom HTML element which will simplify the number input handling

- Created only with pure javascript. ( No dependency except the stlyesheet )
- on("change"), on("decrease") and on("increase") event callback handle
- Setter / getter for value, min and max attributes.
- Mobile friendly and fully responsive

Feature goals:
- Add dark / light mode.

HTML:

```
<hs-number id="anyID"></hs-number>
```

Test:

```JS
let testNumber = document.querySelector("#test");

testNumber.on("change",function(value){
  console.log("Num changed event: ", value);  
});

testNumber.on("decrease",function(value){
  console.log("Num decrease event: ", value);  
});

testNumber.on("increase",function(value){
  console.log("Num increase event: ", value);  
});

testNumber.on("noSuchEvent",function(){ /* No such event */ });

setTimeout(function(){
  testNumber.val(10,true);
},2500);

setTimeout(function(){
  testNumber.setMin(10);
  testNumber.setMax(100);
  testNumber.val(500);
  testNumber.val(9);
  testNumber.removeBounds();
  testNumber.val(1500);
},5000);
```
