"use strict";
//Run onload
window.addEventListener("load", function (e) {
    oGameData.initGlobalObject();
    //Hides #game-area
    document.querySelector("#game-area").classList.add("d-none");
    //Adds click-listener to #newGame
    document.querySelector("#newGame").addEventListener("click", function (e) {
        validateForm();
    });
});

/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};

const M_NO = "";
const M_P1 = "X";
const M_P2 = "O";

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
oGameData.initGlobalObject = function () {

    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = new Array(M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO);

    //Indikerar tecknet som skall användas för spelare ett.
    oGameData.playerOne = M_P1;

    //Indikerar tecknet som skall användas för spelare två.
    oGameData.playerTwo = M_P2;

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
//Check if form-inputs are vaild
function validateForm() {
    //Error-function for try-catch-block
    //Also displays error-text in #errorMsg
    function throwError(msg) {
        document.querySelector("#errorMsg").textContent = msg;
        throw new Error(msg);
    }
    //Constants
    const NAME_MAX_LENGTH = 5;
    const BLACK = "#000000";
    const WHITE = "#ffffff";

    try {
        // Check name-length for both players
        // Check if names are same
        let player_names = document.querySelectorAll("input[placeholder='nickname']");
        for (let name of player_names) {
            if (name.value.length < NAME_MAX_LENGTH) {
                throwError("A player name is too short!");
            }
        }
        if (player_names[0].value == player_names[1].value) {
            throwError("Both players can not have the same name!");
        }

        // Check color for both players
        // Error if: both colors are the same or color is black or white
        let player_colors = [
            document.querySelector("#color1").value,
            document.querySelector("#color2").value,
        ];
        for (let color of player_colors) {
            if (color == WHITE || color == BLACK) {
                throwError("A player has an invalid color!");
            }
        }
        if (player_colors[0] == player_colors[1]) {
            throwError("Both players have the same color!");
        }
    } catch (e) {
        console.log(e);
        return;
    }
    //Initiate game if no errors caught
    initiateGame();
}


function initiateGame() {
    //Hides form
    //Displays game-area
    //Empites errormsg text
    document.querySelector("form").classList.add("d-none");
    document.querySelector("#game-area").classList.remove("d-none");
    document.querySelector("#errorMsg").textContent = "";

    //Read player-names
    oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;

    //Read player-colors
    oGameData.colorPlayerOne = document.querySelector("#color1").value;
    oGameData.colorPlayerTwo = document.querySelector("#color2").value;

    //Reset all table-cells in game-area
    document.querySelectorAll("td").forEach((field) => {
        field.textContent = "";
        field.style.backgroundColor = "white";
    });

    //Choose starting player randomly
    let r = Math.random();
    let playerChar, playerName;

    if (r < 0.5) {
        oGameData.currentPlayer = playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
    }

    //Display current player in h1
    document.querySelector(".jumbotron h1").textContent = "Aktuell spelare är " + playerName;
}

/**
 * Kontrollerar för tre i rad.
 * Returnerar 0 om det inte är någon vinnare, 
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */

oGameData.checkForGameOver = function () {

    const NO_WINNER = 0;
    const X_WINNER = 1;
    const O_WINNER = 2;
    const DRAW = 3;

    let checkHorizontal = function () {
        //Check 1st row
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[1] == M_P1 && oGameData.gameField[2] == M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[1] == M_P2 && oGameData.gameField[2] == M_P2) {
            return O_WINNER;
        }

        //Check 2nd row
        if (oGameData.gameField[3] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[5] == M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[3] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[5] == M_P2) {
            return O_WINNER;
        }

        //Check 3rd row
        if (oGameData.gameField[6] == M_P1 && oGameData.gameField[7] == M_P1 && oGameData.gameField[8] == M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[6] == M_P2 && oGameData.gameField[7] == M_P2 && oGameData.gameField[8] == M_P2) {
            return O_WINNER;
        }
        // No horizontal result
        return NO_WINNER;
    }

    let checkVertical = function () {
        if (oGameData.gameField[0] === M_P1 && oGameData.gameField[3] === M_P1 && oGameData.gameField[6] === M_P1
            || oGameData.gameField[1] === M_P1 && oGameData.gameField[4] === M_P1 && oGameData.gameField[7] === M_P1
            || oGameData.gameField[2] === M_P1 && oGameData.gameField[5] === M_P1 && oGameData.gameField[8] === M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[0] === M_P2 && oGameData.gameField[3] === M_P2 && oGameData.gameField[6] === M_P2
            || oGameData.gameField[1] === M_P2 && oGameData.gameField[4] === M_P2 && oGameData.gameField[7] === M_P2
            || oGameData.gameField[2] === M_P2 && oGameData.gameField[5] === M_P2 && oGameData.gameField[8] === M_P2) {
            return O_WINNER;
        }
        return NO_WINNER;
    }

    let checkDiagonal = function () {
        // Backslash Diagonal
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[8] == M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[8] == M_P2) {
            return O_WINNER;
        }
        // Forwardslash Diagonal
        if (oGameData.gameField[2] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[6] == M_P1) {
            return X_WINNER;
        }
        if (oGameData.gameField[2] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[6] == M_P2) {
            return O_WINNER;
        }
        // No diagonal result
        return NO_WINNER;
    }

    let checkArr = [checkHorizontal, checkVertical, checkDiagonal];
    for (let i = 0; i < checkArr.length; i++) {
        let result = checkArr[i]();
        if (result !== NO_WINNER) {
            return result;
        }
    }

    // Check for draw
    function isGameDrawn() {
        for (let field of oGameData.gameField) {
            if (field === M_NO) {
                return false;
            }
        };
        return true;
    };
    if (isGameDrawn()) {
        return DRAW;
    }

    // There are still empty fields and no winner.
    return NO_WINNER;
}

// Randomized Test
function randomizedTest(amount) {
    if (!Number.isInteger(amount) || amount < 1) {
        amount = 1;
    }

    let possibleFields = [M_NO, M_P1, M_P2];

    for (let i = 0; i < amount; i++) {

        for (let i = 0; i < oGameData.gameField.length; i++) {
            let setField = Math.floor(Math.random() * possibleFields.length);
            oGameData.gameField[i] = possibleFields[setField];
        };

        function getField(field) {
            if (field == "") {
                return "_";
            }
            return field;
        }

        console.log("",
            getField(oGameData.gameField[0]), getField(oGameData.gameField[1]), getField(oGameData.gameField[2]), "\n",
            getField(oGameData.gameField[3]), getField(oGameData.gameField[4]), getField(oGameData.gameField[5]), "\n",
            getField(oGameData.gameField[6]), getField(oGameData.gameField[7]), getField(oGameData.gameField[8]), "\n");

        let result = oGameData.checkForGameOver();
        switch (result) {
            case NO_WINNER:
                console.log("Game in progress...");
                break;
            case X_WINNER:
                console.log("X won the game!");
                break;
            case O_WINNER:
                console.log("O won the game!");
                break;
            case DRAW:
                console.log("Game ended with a DRAW");
                break;
        }
    }
}
