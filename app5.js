const express = require("express");
const app = express();


app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken.html", (req, res) => {
  res.redirect("/janken"); 
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = isNaN(Number(req.query.win)) ? 0 : Number(req.query.win);
  let total = isNaN(Number(req.query.total)) ? 0 : Number(req.query.total);
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  let judgement = '';
  if(hand == cpu){
    judgement = '引き分け';
  }
  else if(
    (hand == "グー" && cpu == "チョキ") ||
    (hand == "パー" && cpu == "グー") ||
    (hand == "チョキ" && cpu == "パー")
  ){
    judgement = '勝ち';
    win += 1;
  }else{
    judgement = "負け";
  }

  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render('janken', display);
});


app.get("/calculator.html", (req, res) => {
  res.sendFile(__dirname + '/public/calculator.html');
});

app.get("/calculator-result", (req, res) => {
  const num1 = parseInt(req.query.num1) || 0;
  const num2 = parseInt(req.query.num2) || 0;
  const sum = num1 + num2;
  res.render('calculator-result', { num1, num2, sum });
});

app.get("/age.html", (req, res) => {
  res.sendFile(__dirname + '/public/age.html');  
});

app.get("/age", (req, res) => {
  const age = parseInt(req.query.age) || 0;  

  let ageGroup = '';
  if (age < 18) {
    ageGroup = 'あなたは未成年です。';
  } else if (age >= 18 && age < 65) {
    ageGroup = 'あなたは成人です。';
  } else if (age >= 65) {
    ageGroup = 'あなたは高齢者です。';
  } else {
    ageGroup = '不正な年齢です。';
  }

  res.render('age', { age: age, ageGroup: ageGroup });
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
