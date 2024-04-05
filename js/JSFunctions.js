"use strict";
let oGameData = {};
let REF_TABLE = document.querySelector("table");
let REF_H1 = document.querySelector("div.jumbotron>h1");
let REF_TDS = document.querySelectorAll("td");
let REF_STARTBTN = document.querySelector("#newGame");
let REF_ERRORMSG = document.querySelector("#errorMsg");
let REF_FORM = document.querySelector("form");
let REF_GAMEAREA = document.querySelector("#game-area");
let REF_NICK1 = document.querySelector("#nick1");
let REF_NICK2 = document.querySelector("#nick2");
let REF_COLOR1 = document.querySelector("#color1");
let REF_COLOR2 = document.querySelector("#color2");
const BLACK = "#000000";
const WHITE = "#ffffff";
const IN_PROGRESS = 0;
const WIN_X = 1;
const WIN_O = 2;
const DRAW = 3;
const NAME_MAXLENGTH = 5;

window.addEventListener("load", () => {
    oGameData.initGlobalObject();
    createCheckbox();
    //Hides game area
    REF_GAMEAREA.classList.add("d-none");

    //Set function to btn onclick event
    REF_STARTBTN.addEventListener("click", validateForm);
});


oGameData.initGlobalObject = function () {

    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = Array('', '', '', '', '', '', '', '', '');

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


oGameData.checkForGameOver = function () {
    let p1Win = false;
    let p2Win = false;

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
    if (p1Win && !p2Win) return WIN_X;
    else if (!p1Win && p2Win) return WIN_O;
    else if (checkFieldFull()) return DRAW;
    return IN_PROGRESS;


}


function validateForm() {
    try {
        //Check if user inputs are correct
        let name1 = REF_NICK1.value;
        let name2 = REF_NICK2.value;
        let color1 = REF_COLOR1.value;
        let color2 = REF_COLOR2.value;
        let checkbox = document.querySelector("#timer-checkbox");
        oGameData.timerEnabled = checkbox.checked;
        if (name1.length < NAME_MAXLENGTH || name2.length < NAME_MAXLENGTH) { throw ("Name too short"); }
        if (name1 === name2) { throw ("Same names"); }
        if (color1 === BLACK || color1 === WHITE) { throw ("Player 1: Invaild color"); }
        if (color2 === BLACK || color2 === WHITE) { throw ("Player 2: Invaild color"); }
        if (color1 === color2) { throw ("Same color"); }
        if (oGameData.timerEnabled) { setupTimer(); }

        //Start game if no errors

        initiateGame();

    }
    catch (error) {
        console.log("Hej");
        REF_ERRORMSG.textContent = error;
    }
}


function initiateGame() {

    //Hide form and error msg, show game area
    REF_FORM.classList.add("d-none");
    REF_GAMEAREA.classList.remove("d-none");
    REF_ERRORMSG.textContent = "";

    //Player 1
    oGameData.nickNamePlayerOne = REF_NICK1.value;
    oGameData.colorPlayerOne = REF_COLOR1.value;

    //Player 2
    oGameData.nickNamePlayerTwo = REF_NICK2.value;
    oGameData.colorPlayerTwo = REF_COLOR2.value;

    //Reset table cells
    for (let td of REF_TDS) {
        td.textContent = "";
        td.style.backgroundColor = "WHITE";
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
    setCurrentPlayer(playerChar, playerName)
    REF_TABLE.addEventListener("click", executeMove);
}


//Runs when a move is executed by the current player
//Fills table-cell with current players symbol and color if not occupied
//Runs gameOverProtocol if win or draw
function executeMove(event) {

    let targetCell = event.target;
    let targetId = targetCell.getAttribute("data-id");

    if (oGameData.gameField[targetId] === "") {
        oGameData.gameField[targetId] = oGameData.currentPlayer;
        targetCell.textContent = oGameData.currentPlayer;
        currentTime = 0;
        if (oGameData.currentPlayer === oGameData.playerOne) {
            targetCell.style.backgroundColor = oGameData.colorPlayerOne;
            setCurrentPlayer(oGameData.playerTwo, oGameData.nickNamePlayerTwo)
        }
        else {
            targetCell.style.backgroundColor = oGameData.colorPlayerTwo;
            setCurrentPlayer(oGameData.playerOne, oGameData.nickNamePlayerOne);
        }
        if (oGameData.checkForGameOver() !== IN_PROGRESS) {
            gameOverProtocol();
        }
    }
}

//Sets current player in GameData
//Also updates h1
function setCurrentPlayer(player, playerName) {
    oGameData.currentPlayer = player;
    REF_H1.textContent = "Aktuell spelare är: " + oGameData.currentPlayer + " (" + playerName + ")";
}

//Runs if game is over
//Turns of game and hides gameField
//Shows gameresult in h1
//Resets GameData
function gameOverProtocol() {
    REF_TABLE.removeEventListener("click", executeMove);
    REF_FORM.classList.remove("d-none");
    let winnerName, winnerMark;
    if (oGameData.checkForGameOver() === DRAW) REF_H1.textContent = "Oavgjort";
    else {
        switch (oGameData.checkForGameOver()) {
            case WIN_X:
                winnerName = oGameData.nickNamePlayerOne;
                winnerMark = oGameData.playerOne;
                break;
            case WIN_O:
                winnerName = oGameData.nickNamePlayerTwo;
                winnerMark = oGameData.playerTwo;
                break;
        }
        REF_H1.textContent = "Vinnare är: " + winnerName + " (" + winnerMark + ") Spela igen?";
    }
    REF_GAMEAREA.classList.add("d-none");
    window.clearInterval(oGameData.timerId);
    oGameData.initGlobalObject();
    document.querySelector("main").removeChild(timeContainer);
}

//Implement turn timer that switches current player after x seconds
//Make a div with text showing the current timer time 
//Append div to beneath the game-area
const TIMER_INTERVALL = 100;
const TIMER_TURNTIME = 5;
let currentTime;
let timerText;
let timeContainer
function setupTimer() {
    oGameData.timerId = window.setInterval(updateTime, TIMER_INTERVALL);
    currentTime = 0;
    timeContainer = document.createElement("div");
    timeContainer.setAttribute("style", "margin-inline: auto; font-size: 30px");
    timerText = document.createTextNode("");
    timeContainer.appendChild(timerText);

    document.querySelector("main").appendChild(timeContainer);
}

//Update timer function
function updateTime() {
    //Set current player
    //currentTime is divided by 10 
    if (currentTime >= TIMER_TURNTIME) {
        if (oGameData.currentPlayer == oGameData.playerOne) { setCurrentPlayer(oGameData.playerTwo, oGameData.nickNamePlayerTwo); }
        else { setCurrentPlayer(oGameData.playerOne, oGameData.nickNamePlayerOne); }
        currentTime = 0;
    }
    //Displays current time
    //toFixed() is for rounding numbers
    currentTime += 0.1;
    let displayedTime = (currentTime).toFixed(1);
    timerText.nodeValue = "Turn time: " + displayedTime;
}

function createCheckbox() {
    //Checkbox
    let timerCheckbox = document.createElement("input");
    timerCheckbox.type = "checkbox";
    timerCheckbox.setAttribute("style", "width: fit-content; margin-right: auto; margin-left: 10px;");
    timerCheckbox.setAttribute("id", "timer-checkbox");

    //Label for checkbox
    let timerCheckboxLabel = document.createElement("label");
    timerCheckboxLabel.setAttribute("for", "timer-checkbox");
    timerCheckboxLabel.setAttribute("style", "width: fit-content;");
    let labelText = document.createTextNode("Vill du begränsa tiden till 5 sekunder per drag?")
    timerCheckboxLabel.appendChild(labelText);

    //Append to div with button
    let btnContainer = document.querySelector("#div-with-a");
    btnContainer.insertBefore(timerCheckbox, btnContainer.children[0]);
    btnContainer.insertBefore(timerCheckboxLabel, btnContainer.children[0]);
}




