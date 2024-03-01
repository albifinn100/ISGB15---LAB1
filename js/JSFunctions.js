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
    oGameData.gameField = new Array('', '', '', '', '', '', '', '', '');

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
        || oGameData.gameField[2] === "X" && oGameData.gameField[5] === "X" && oGameData.gameField[8] === "X") 
        {
            console.log(oGameData.gameField);
        }

        if (oGameData.gameField[0] === "O" && oGameData.gameField[3] === "O" && oGameData.gameField[6] === "O" 
        || oGameData.gameField[1] === "O" && oGameData.gameField[4] === "O" && oGameData.gameField[7] === "O" 
        || oGameData.gameField[2] === "O" && oGameData.gameField[5] === "O" && oGameData.gameField[8] === "O") 
        {
            console.log(oGameData.gameField);
        }

    }
    //TODO: Colin
    let checkDiagonal = function () {
        // Backslash Diagonal
        if (oGameData.gameField[0] == "X" && oGameData.gameField[5] == "X" && oGameData.gameField[9] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[0] == "O" && oGameData.gameField[5] == "O" && oGameData.gameField[9] == "O") {
            return O_WINNER;
        }
        // Forwardslash Diagonal
        if (oGameData.gameField[3] == "X" && oGameData.gameField[5] == "X" && oGameData.gameField[7] == "X") {
            return X_WINNER;
        }
        if (oGameData.gameField[3] == "O" && oGameData.gameField[5] == "O" && oGameData.gameField[7] == "O") {
            return O_WINNER;
        }
        // No diagonal result
        return NO_WINNER;
    }

    let checkArr = [checkHorizontal, checkVertical, checkDiagonal];
    checkArr.forEach(function (checkFunc) {
        let result = checkFunc();
        if (result !== 0) {
            return result;
        }
    });

    // Check for draw
    let isGameDrawn = function () {
        let isDraw = true;
        for (field in oGameData.gameField) {
            if (field === "") {
                isDraw = false;
                break;
            }
        };
        return isDraw;
    };
    if (isGameDrawn) {
        return DRAW;
    }

    // There are still empty fields with no winner.
    return NO_WINNER;
}




