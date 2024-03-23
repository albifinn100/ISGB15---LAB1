"use strict";

const TIMER_CHECKBOX_ID = "timer-checkbox";
const TURN_TIME_LIMIT = 5000;

// När sidan har laddats.
window.addEventListener("load", (e) => {
    oGameData.initGlobalObject();
    document.querySelector("#game-area").classList.add("d-none");
    const startButton = document.querySelector("#newGame");
    startButton.addEventListener("click", (e) => {
        validateForm();
        // Förhindra att lägga till # i websidolänken, uppskrollning, etc.
        e.preventDefault();
    });

    // Lägg till de timerrelaterade elementen.
    const buttonParent = startButton.parentElement;

    // Skapa en div som läggs före startknappen.
    const timerDiv = document.createElement("div");
    {
        // Skapa checkboxen.
        const timerCheckbox = document.createElement("input");
        {
            timerCheckbox.setAttribute("type", "checkbox");
            timerCheckbox.setAttribute("id", TIMER_CHECKBOX_ID);
            timerCheckbox.style.width = "auto";
        }
        timerDiv.appendChild(timerCheckbox);

        // Skapa checkboxtexten.
        const timerLabel = document.createElement("label");
        {
            timerLabel.setAttribute("for", TIMER_CHECKBOX_ID);
            timerLabel.appendChild(document.createTextNode("Vill du begränsa tiden till 5 sekunder per drag?"));
        }
        timerDiv.appendChild(timerLabel);
    }
    buttonParent.insertBefore(timerDiv, startButton);
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

    // Inkapslad hjälparfunktion för att skriva ut felmeddelandet.
    function throwError(message) {
        document.querySelector("#errorMsg").textContent = message;
        throw new Error(message);
    }

    const NAME_MIN_LENGTH = 5;
    const COLOR_BLACK = "#000000";
    const COLOR_WHITE = "#ffffff";

    try {
        // Bekräfta att namnen är tillräkligt långa, och inte är samma.
        const player_names = document.querySelectorAll("input[placeholder='nickname']");
        for (const name of player_names) {
            if (name.value.length < NAME_MIN_LENGTH) {
                throwError("En spelare har för kort namn!");
            }
        }
        if (player_names[0].value == player_names[1].value) {
            throwError("Båda spelare får inte ha samma namn!");
        }

        // Bekräfta att färgerna är olika och inte är vit eller svart.
        const player_colors = [
            document.querySelector("#color1").value,
            document.querySelector("#color2").value,
        ];
        for (const color of player_colors) {
            if (color == COLOR_WHITE || color == COLOR_BLACK) {
                throwError("En spelare har en ogiltig färg!");
            }
        }
        if (player_colors[0] == player_colors[1]) {
            throwError("Båda spelare får inte ha samma färg!");
        }
    } catch (e) {
        console.log(e);
        return;
    }

    // Alla krav är uppfyllda. Initiera spelet.
    initiateGame();
}

/**
 * Gömmer där man väljer nickname och färg och startar spelet och det gör spelbortet synligt igen och visar vem som spelar.
 * 
 * Det sätter även färgen på spelaren till den som den har valt.
 */
function initiateGame() {
    // Göm formuläret och visa spelplanen.
    document.querySelector("form").classList.add("d-none");
    document.querySelector("#game-area").classList.remove("d-none");
    document.querySelector("#errorMsg").textContent = "";

    // Lagra spelarnamnen.
    oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;

    // Lagra spelarfärgerna.
    oGameData.colorPlayerOne = document.querySelector("#color1").value;
    oGameData.colorPlayerTwo = document.querySelector("#color2").value;

    // Återställ alla fält.
    document.querySelectorAll("td").forEach((field) => {
        field.textContent = "";
        field.style.backgroundColor = "white";
    });

    let playerChar, playerName;

    // Slumpmässigt välj vem som får första turen.
    if (Math.random() < 0.5) {
        oGameData.currentPlayer = playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
    }

    // Visa nuvarande spelare i h1 headern.
    document.querySelector(".jumbotron h1").textContent = "Aktuell spelare är " + playerName + " (" + oGameData.currentPlayer + ")";

    // Lägg till klicklyssnare på hela tabellen.
    document.querySelector("#game-area table").addEventListener("click", executeMove);

    // Hantera tidsbegränsningen.
    const timerCheckbox = document.querySelector("#" + TIMER_CHECKBOX_ID);
    oGameData.timerEnabled = timerCheckbox.checked;
    if (timerCheckbox.checked) {
        console.log("Tidbegränsning aktiverad!");
        oGameData.timerId = setTimeout(swapPlayerTurn, TURN_TIME_LIMIT);
    }
}

function swapPlayerTurn() {
    // Avsluta den tidigare timeouten, om den fanns
    clearTimeout(oGameData.timerId);

    // Byt tur.
    oGameData.currentPlayer = oGameData.currentPlayer == M_P1 ? oGameData.playerTwo : oGameData.playerOne
    const playerName = oGameData.currentPlayer == M_P1 ? oGameData.nickNamePlayerOne : oGameData.nickNamePlayerTwo;
    document.querySelector(".jumbotron h1").textContent = "Aktuell spelare är " + playerName + " (" + oGameData.currentPlayer + ")";

    // Starta en ny timeout om det var aktiverat.
    if (oGameData.timerEnabled) {
        oGameData.timerId = setTimeout(swapPlayerTurn, TURN_TIME_LIMIT);
    }
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
        swapPlayerTurn();
        return;
    }

    // Avsluta spel och uppdatera headertexten.
    clearTimeout(oGameData.timerId);
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
        // Första raden
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[1] == M_P1 && oGameData.gameField[2] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[1] == M_P2 && oGameData.gameField[2] == M_P2) {
            return GAMERESULT_O_WON;
        }

        // Andra raden
        if (oGameData.gameField[3] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[5] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[3] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[5] == M_P2) {
            return GAMERESULT_O_WON;
        }

        // Tredje raden
        if (oGameData.gameField[6] == M_P1 && oGameData.gameField[7] == M_P1 && oGameData.gameField[8] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[6] == M_P2 && oGameData.gameField[7] == M_P2 && oGameData.gameField[8] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // Ingen horisontell vinst.
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
        // Omvänt snedsträck
        if (oGameData.gameField[0] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[8] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[0] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[8] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // Snedsträck
        if (oGameData.gameField[2] == M_P1 && oGameData.gameField[4] == M_P1 && oGameData.gameField[6] == M_P1) {
            return GAMERESULT_X_WON;
        }
        if (oGameData.gameField[2] == M_P2 && oGameData.gameField[4] == M_P2 && oGameData.gameField[6] == M_P2) {
            return GAMERESULT_O_WON;
        }
        // Ingen diagonal vinst.
        return GAMERESULT_NONE;
    }

    const checkArr = [checkHorizontal, checkVertical, checkDiagonal];
    for (const checkFunction of checkArr) {
        const result = checkFunction();
        if (result !== GAMERESULT_NONE) {
            return result;
        }
    }

    // Titta igenom alla fält. Om minst ett fortfarande är tomt så håller spelet fortfarande på.
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

    return GAMERESULT_NONE;
}

/**
 * Testar {@link oGameData.checkForGameOver} genom att sätta varje ruta till ett
 * slumpmässigt giltigt värde, och skriver ut resultatet till konsollen.
 * Slutar med att återställa alla rutor till de tidigare värdena.
 * 
 * Kalla direkt i webbläsarkonsolen.
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
