"use strict";




//Testutskrifter
/*
console.log( oGameData );
oGameData.initGlobalObject();
console.log( oGameData.gameField );
console.log( oGameData.checkForGameOver() );
*/

/*
console.log( oGameData.checkHorizontal() );
console.log( oGameData.checkVertical() );
console.log( oGameData.checkDiagonalLeftToRight() );
console.log( oGameData.checkDiagonalRightToLeft() );
console.log( oGameData.checkForDraw() );
*/



/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
oGameData.initGlobalObject = function () {

  //Datastruktur för vilka platser som är lediga respektive har brickor
  oGameData.gameField = Array('', '', '', '', '', '', '', '', '');

  /* Testdata för att testa rättningslösning */
  //oGameData.gameField = Array('X', 'X', 'X', '', '', '', '', '', '');
  //oGameData.gameField = Array('X', '', '', 'X', '', '', 'X', '', '');
  //oGameData.gameField = Array('X', '', '', '', 'X', '', '', '', 'X');
  //oGameData.gameField = Array('', '', 'X', '', 'X', '', 'X', '', '');
  //oGameData.gameField = Array('X', 'O', 'X', '0', 'X', 'O', 'O', 'X', 'O');

  //Indikerar tecknet som skall användas för spelare ett.
  oGameData.playerOne = "X";

  //Indikerar tecknet som skall användas för spelare två.
  oGameData.playerTwo = "O";

  //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
  oGameData.currentPlayer = "";

  //Nickname för spelare ett som tilldelas från ett formulärelement,
  oGameData.nickNamePlayerOne = "";

  //Nickname för spelare två som tilldelas från ett formulärelement.
  oGameData.nickNamePlayerTwo = "";

  //Färg för spelare ett som tilldelas från ett formulärelement.
  oGameData.colorPlayerOne = "";

  //Färg för spelare två som tilldelas från ett formulärelement.
  oGameData.colorPlayerTwo = "";

  //"Flagga" som indikerar om användaren klickat för checkboken.
  oGameData.timerEnabled = false;

  //Timerid om användaren har klickat för checkboxen. 
  oGameData.timerId = null;

}
document.onload = oGameData.initGlobalObject();
/**
 * Kontrollerar för tre i rad.
 * Returnerar 0 om det inte är någon vinnare, 
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */
oGameData.checkForGameOver = function () {
  let p1Win = false;
  let p2Win = false;
  const inProgress = 0;
  const xWin = 1;
  const oWin = 2;
  const draw = 3;
  let player = [oGameData.playerOne, oGameData.playerTwo];

  function checkFieldFull() {
    for (let i = 0; i < oGameData.gameField.length; i++) {
      if (oGameData.gameField[i] === "") {
        return false;
      }
    }
    return true;
  }

  //Check each row: [0,1,2]; [3,4,5]; [6,7,8]
  function checkHorizontal() {
    for (let j = 0; j < player.length; j++) {
      for (let i = 0; i <= 6; i += 3) {
        if (oGameData.gameField[i] === player[j] && oGameData.gameField[i + 1] === player[j] && oGameData.gameField[i + 2] === player[j]) {
          if (oGameData.gameField[i] === oGameData.playerOne) p1Win = true;
          else p2Win = true;
        }
      }
    }
  }

  //Check each column: [0,3,6]; [1,4,7]; [2,5,8]
  function checkVertical() {
    for (let j = 0; j < player.length; j++) {
      for (let i = 0; i < 3; i++) {
        if (oGameData.gameField[i] === player[j] && oGameData.gameField[i + 3] === player[j] && oGameData.gameField[i + 6] === player[j]) {
          if (oGameData.gameField[i] === oGameData.playerOne) p1Win = true;
          else p2Win = true;
        }
      }
    }
  }

  //Check diagonals: [0,4,8]; [2,4,6]
  function checkDiagonal() {
    let arr = oGameData.gameField;
    for (let i = 0; i < player.length; i++) {
      if (arr[0] === player[i] && arr[4] === player[i] && arr[8] === player[i]) {
        if (arr[0] == oGameData.playerOne) p1Win = true;
        else p2Win = true;
      }
      if (arr[2] === player[i] && arr[4] === player[i] && arr[6] === player[i]) {
        if (arr[2] == oGameData.playerOne) p1Win = true;
        else p2Win = true;
      }
    }
  }

  let checks = [checkHorizontal(), checkVertical(), checkDiagonal()];
  for (let i = 0; i < 3; i++) {
    checks[i];
  }
  if (p1Win && !p2Win) return xWin;
  else if (!p1Win && p2Win) return oWin;
  else if (checkFieldFull()) return draw;
  return inProgress;


}
////////////////////////////
//Test-game
oGameData.gameField = Array(
  'X', '', 'O',
  'X', 'O', 'O',
  'O', '', 'O');
let result = oGameData.checkForGameOver();
console.log(result);
///////////////////////////

//Hides game area
document.querySelector("#game-area").classList.add("d-none");

//Set function to btn onclick event
document.querySelector("#newGame").onclick = validateForm;


function validateForm() {
  const BLACK = "#000000";
  const WHITE = "#ffffff";

  try {
    //Check if user inputs are correct
    let name1 = document.querySelector("#nick1").value;
    let name2 = document.querySelector("#nick2").value;
    let color1 = document.querySelector("#color1").value;
    let color2 = document.querySelector("#color2").value;
    if (name1.length < 5 || name2.length < 5) { throw ("Name too short"); }
    if (name1 === name2) { throw ("Same names"); }
    if (color1 === BLACK || color1 === WHITE) { throw ("Player 1: Invaild color"); }
    if (color2 === BLACK || color2 === WHITE) { throw ("Player 2: Invaild color"); }
    if (color1 === color2) { throw ("Same color"); }

    //Start game if no errors
    initiateGame();

  }
  catch (error) {
    document.querySelector("#errorMsg").textContent = error;
  }
}


function initiateGame() {
  //Hide form and error msg, show game area
  document.querySelector("form").classList.add("d-none");
  document.querySelector("#game-area").classList.remove("d-none");
  document.querySelector("#errorMsg").textContent = "";

  //Player 1
  oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
  oGameData.colorPlayerOne = document.querySelector("#color1").value;

  //Player 2
  oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;
  oGameData.colorPlayerTwo = document.querySelector("#color2").value;

  //Reset table cells
  let tdRef = document.querySelectorAll("td");
  for (let i = 0; i < tdRef.length; i++) {
    tdRef[i].textContent = "";
    tdRef[i].style.backgroundColor = "WHITE";
  }

  //Set starting player
  let playerChar = "";
  let playerName = "";
  if (Math.random() < 0.5) {
    playerChar = oGameData.playerOne;
    playerName = oGameData.nickNamePlayerOne;
    oGameData.currentPlayer = oGameData.playerOne;
  }
  else {
    playerChar = oGameData.playerTwo;
    playerName = oGameData.nickNamePlayerTwo;
    oGameData.currentPlayer = oGameData.playerTwo;
  }

  document.querySelector("div.jumbotron>h1").textContent = "Aktuell spelare är: " + oGameData.currentPlayer + " (" + playerName + ")";
}
