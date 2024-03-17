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
const oGameData = {};

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

/**
 * Tittar igenom de angivna namnen och färgerna för att se om de uppfyller alla krav.
 * 
 * Om alla krav är uppfyllda så kallas {@link initiateGame} och spelet initieras.
 * 
 * Om något av kraven inte är uppfyllda så avbryts funktionen, och texten i jumbotron headern uppdateras för att reflektera problemet.
 */
function validateForm() {
    //Error-function for try-catch-block
    //Also displays error-text in #errorMsg
    function throwError(msg) {
        document.querySelector("#errorMsg").textContent = msg;
        throw new Error(msg);
    }
    //Constants
    const NAME_MIN_LENGTH = 5;
    const BLACK = "#000000";
    const WHITE = "#ffffff";

    try {
        // Check name-length for both players
        // Check if names are same
        const player_names = document.querySelectorAll("input[placeholder='nickname']");
        for (const name of player_names) {
            if (name.value.length < NAME_MIN_LENGTH) {
                throwError("A player name is too short!");
            }
        }
        if (player_names[0].value == player_names[1].value) {
            throwError("Both players can not have the same name!");
        }

        // Check color for both players
        // Error if: both colors are the same or color is black or white
        const player_colors = [
            document.querySelector("#color1").value,
            document.querySelector("#color2").value,
        ];
        for (const color of player_colors) {
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

/**
 * Gömmer där man väljer nickname och färg och startar spelet och det gör spelbortet synligt igen och visar vem som spelar.
 * 
 * Det sätter även färgen på spelaren till den som den har valt.
 */
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

    let playerChar, playerName;

    //Choose starting player randomly
    if (Math.random() < 0.5) {
        oGameData.currentPlayer = playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
    }

    //Display current player in h1
    document.querySelector(".jumbotron h1").textContent = "Aktuell spelare är " + playerName + " (" + oGameData.currentPlayer + ")";

    // Tabell
    document.querySelector("#game-area table").addEventListener("click", executeMove);
}

/**
 * Hanterar vad som händer när den spelaren som har tur klickar på en spelfältsruta.
 * @param {PointerEvent} pointerEvent Pointerhändelsen från tabellen.
 */
function executeMove(pointerEvent) {
    // Ignorera om händelsen inte var på en tabellruta.
    if (pointerEvent.target.nodeName !== "TD") {
        return;
    }

    const td = pointerEvent.target;
    const fieldNumber = td.getAttribute("data-id");
    const jumbotronHeader = document.querySelector(".jumbotron h1");

    // Ignorera händelsen om rutan redan är upptagen.
    if (oGameData.gameField[fieldNumber] != M_NO) {
        return;
    }

    // Uppdatera spelplanen och dess relaterad data.
    oGameData.gameField[fieldNumber] = oGameData.currentPlayer;
    td.textContent = oGameData.currentPlayer;
    td.style.backgroundColor = oGameData.currentPlayer == M_P1 ? oGameData.colorPlayerOne : oGameData.colorPlayerTwo;

    // Titta om spelet är slut.
    const gameResult = oGameData.checkForGameOver();
    if (gameResult == GAMERESULT_NONE) {
        // Ändra så att det är den andra spelarens tur.
        oGameData.currentPlayer = oGameData.currentPlayer == M_P1 ? oGameData.playerTwo : oGameData.playerOne
        const playerName = oGameData.currentPlayer == M_P1 ? oGameData.nickNamePlayerOne : oGameData.nickNamePlayerTwo;
        jumbotronHeader.textContent = "Aktuell spelare är " + playerName + " (" + oGameData.currentPlayer + ")";
        return;
    }

    // Avsluta spel och uppdatera headertexten.
    document.querySelector("#game-area table").removeEventListener("click", executeMove);
    document.querySelector("form").classList.remove("d-none");

    if (gameResult == GAMERESULT_DRAW) {
        jumbotronHeader.textContent = "Spelet var oavgjort! Spela igen?";
    } else {
        const playerXText = oGameData.nickNamePlayerOne + " (" + (M_P1) + ")";
        const playerOText = oGameData.nickNamePlayerTwo + " (" + (M_P2) + ")";
        jumbotronHeader.textContent = "Vinnare är " + (gameResult == GAMERESULT_X_WON ? playerXText : playerOText) + "! Spela igen?";
    }

    // Skulle vara snyggare att inte gömma spelplanen.
    document.querySelector("#game-area").classList.add("d-none");

    // Kör om init för att återställa de interna värdena så att en ny runda kan påbörjas.
    oGameData.initGlobalObject();
}

const GAMERESULT_NONE = 0;
const GAMERESULT_X_WON = 1;
const GAMERESULT_O_WON = 2;
const GAMERESULT_DRAW = 3;

/**
 * Kontrollerar för tre i rad.
 * 
 * Returnerar {@link GAMERESULT_NONE} om det inte är någon vinnare.
 * 
 * Returnerar {@link GAMERESULT_X_WON} om spelaren med ett kryss (X) är vinnare.
 * 
 * Returnerar {@link GAMERESULT_O_WON} om spelaren med en cirkel (O) är vinnare.
 * 
 * Returnerar {@link GAMERESULT_DRAW} om det är oavgjort.
 * 
 * Funktionen tar inte emot några värden.
 */
oGameData.checkForGameOver = function () {

    const checkHorizontal = function () {
        //Check 1st row
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[1] == M_P1 && oGameData.gameField[2] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[1] == M_P2 && oGameData.gameField[2] == M_P2) {
            return GAMERESULT_O_WON;
        }

        //Check 2nd row
        if (oGameData.gameField[3] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[5] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[3] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[5] == M_P2) {
            return GAMERESULT_O_WON;
        }

        //Check 3rd row
        if (oGameData.gameField[6] == M_P1 && oGameData.gameField[7] == M_P1 && oGameData.gameField[8] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[6] == M_P2 && oGameData.gameField[7] == M_P2 && oGameData.gameField[8] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // No horizontal result
        return GAMERESULT_NONE;
    }

    const checkVertical = function () {
        if (oGameData.gameField[0] === M_P1 && oGameData.gameField[3] === M_P1 && oGameData.gameField[6] === M_P1
            || oGameData.gameField[1] === M_P1 && oGameData.gameField[4] === M_P1 && oGameData.gameField[7] === M_P1
            || oGameData.gameField[2] === M_P1 && oGameData.gameField[5] === M_P1 && oGameData.gameField[8] === M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[0] === M_P2 && oGameData.gameField[3] === M_P2 && oGameData.gameField[6] === M_P2
            || oGameData.gameField[1] === M_P2 && oGameData.gameField[4] === M_P2 && oGameData.gameField[7] === M_P2
            || oGameData.gameField[2] === M_P2 && oGameData.gameField[5] === M_P2 && oGameData.gameField[8] === M_P2) {
            return GAMERESULT_O_WON;
        }
        return GAMERESULT_NONE;
    }

    const checkDiagonal = function () {
        // Backslash Diagonal
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[8] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[8] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // Forwardslash Diagonal
        if (oGameData.gameField[2] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[6] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[2] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[6] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // No diagonal result
        return GAMERESULT_NONE;
    }

    const checkArr = [checkHorizontal, checkVertical, checkDiagonal];
    for (let i = 0; i < checkArr.length; i++) {
        const result = checkArr[i]();
        if (result !== GAMERESULT_NONE) {
            return result;
        }
    }

    // Check for draw
    function isGameDrawn() {
        for (const field of oGameData.gameField) {
            if (field === M_NO) {
                return false;
            }
        };
        return true;
    };
    if (isGameDrawn()) {
        return GAMERESULT_DRAW;
    }

    // There are still empty fields and no winner.
    return GAMERESULT_NONE;
}

/**
 * Testar {@link oGameData.checkForGameOver} genom att sätta varje ruta till ett
 * slumpmässigt giltigt värde, och skriver ut resultatet till konsollen.
 * Slutar med att återställa alla rutor till de tidigare värdena.
 * @param {number} amount Antal tester.
 */
function randomizedTest(amount) {
    if (!Number.isInteger(amount) || amount < 1) {
        amount = 1;
    }

    const possibleFields = [M_NO, M_P1, M_P2];

    const previousFieldValues = oGameData.gameField.slice();

    for (let i = 0; i < amount; i++) {

        for (let i = 0; i < oGameData.gameField.length; i++) {
            const setField = Math.floor(Math.random() * possibleFields.length);
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

        const result = oGameData.checkForGameOver();
        switch (result) {
            case GAMERESULT_NONE:
                console.log("Game in progress...");
                break;
            case GAMERESULT_X_WON:
                console.log("X won the game!");
                break;
            case GAMERESULT_O_WON:
                console.log("O won the game!");
                break;
            case GAMERESULT_DRAW:
                console.log("Game ended with a DRAW");
                break;
        }
    }

    oGameData.gameField = previousFieldValues;
}
