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

const M_NO = "";
const M_P1 = "X";
const M_P2 = "O"

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
oGameData.initGlobalObject = function () {

    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = new Array(M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO);

    /* Testdata för att testa rättningslösning */
    //oGameData.gameField = Array(M_P1, M_P1, M_P1, M_NO, M_NO, M_NO, M_NO, M_NO, M_NO);
    //oGameData.gameField = Array(M_P1, M_NO, M_NO, M_P1, M_NO, M_NO, M_P1, M_NO, M_NO);
    //oGameData.gameField = Array(M_P1, M_NO, M_NO, M_NO, M_P1, M_NO, M_NO, M_NO, M_P1);
    //oGameData.gameField = Array(M_NO, M_NO, M_P1, M_NO, M_P1, M_NO, M_P1, M_NO, M_NO);
    //oGameData.gameField = Array(M_P1, M_P2, M_P1, '0', M_P1, M_P2, M_P2, M_P1, M_P2);

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

/**
 * Kontrollerar för tre i rad.
 * Returnerar 0 om det inte är någon vinnare, 
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */

const NO_WINNER = 0;
const X_WINNER = 1;
const O_WINNER = 2;
const DRAW = 3;

oGameData.checkForGameOver = function () {
    //TODO: Albin
    let checkHorizontal = function () {
        //Check 1st row
        if (oGameData.gameField[0] == "X" && oGameData.gameField[1] == "X" && oGameData.gameField[2] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[0] == "O" && oGameData.gameField[1] == "O" && oGameData.gameField[2] == "O") {
            return O_WINNER;
        }

        //Check 2nd row
        if (oGameData.gameField[3] == "X" && oGameData.gameField[4] == "X" && oGameData.gameField[5] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[3] == "O" && oGameData.gameField[4] == "O" && oGameData.gameField[5] == "O") {
            return O_WINNER;
        }

        //Check 3rd row
        if (oGameData.gameField[6] == "X" && oGameData.gameField[7] == "X" && oGameData.gameField[8] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[6] == "O" && oGameData.gameField[7] == "O" && oGameData.gameField[8] == "O") {
            return O_WINNER;
        }
        // No horizontal result
        return NO_WINNER;


    }
    //TODO: Oskar 
    let checkVertical = function () {
        if (oGameData.gameField[0] === "X" && oGameData.gameField[3] === "X" && oGameData.gameField[6] === "X"
            || oGameData.gameField[1] === "X" && oGameData.gameField[4] === "X" && oGameData.gameField[7] === "X"
            || oGameData.gameField[2] === "X" && oGameData.gameField[5] === "X" && oGameData.gameField[8] === "X") {
            return X_WINNER;
        }

        if (oGameData.gameField[0] === "O" && oGameData.gameField[3] === "O" && oGameData.gameField[6] === "O"
            || oGameData.gameField[1] === "O" && oGameData.gameField[4] === "O" && oGameData.gameField[7] === "O"
            || oGameData.gameField[2] === "O" && oGameData.gameField[5] === "O" && oGameData.gameField[8] === "O") {
            return O_WINNER;
        }
        return NO_WINNER;
    }
    //TODO: Colin
    let checkDiagonal = function () {
        // Backslash Diagonal
        if (oGameData.gameField[0] == "X" && oGameData.gameField[4] == "X" && oGameData.gameField[8] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[0] == "O" && oGameData.gameField[4] == "O" && oGameData.gameField[8] == "O") {
            return O_WINNER;
        }
        // Forwardslash Diagonal
        if (oGameData.gameField[2] == "X" && oGameData.gameField[4] == "X" && oGameData.gameField[6] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[2] == "O" && oGameData.gameField[4] == "O" && oGameData.gameField[6] == "O") {
            return O_WINNER;
        }
        // No diagonal result
        return NO_WINNER;
    }

    let result;
    let checkArr = [checkHorizontal, checkVertical, checkDiagonal];
    for (let i = 0; i < checkArr.length; i++) {
        result = checkArr[i]();
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

    // There are still empty fields with no winner.
    return NO_WINNER;
}

// Manual Test
/*
oGameData.gameField = [
    M_P1, M_P2, M_NO,
    M_NO, M_P1, M_NO,
    M_NO, M_P2, M_P1];
*/
// console.log(oGameData.gameField);
// console.log(oGameData.checkForGameOver());

oGameData.initGlobalObject();

// Randomized Test
function randomizedTest() {
    let possibleFields = [M_NO, M_P1, M_P2];
    for (let i = 0; i < 10; i++) {
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

randomizedTest();