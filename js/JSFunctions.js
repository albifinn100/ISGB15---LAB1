"use strict";
const TID = "thisTimer";
//Körs när sidan laddats
window.addEventListener("load", function (e) {
    oGameData.initGlobalObject();
    //Lägger till d-none klassen till objektet med id't game-area
    const start = document.querySelector("#newGame");
    document.querySelector("#game-area").classList.add("d-none");
    //Lägger till en eventlistener till objektet med id't newGame
    start.addEventListener("click", function (e) {
        validateForm();
    });





    const startB = start.parentElement;

    const Tdiv = document.createElement("div");
    {
        const timer = document.createElement("input");
        {
            timer.setAttribute("type", "checkbox");
            timer.setAttribute("id", TID);
            timer.style.width = "auto";
        }


        Tdiv.appendChild(timer);

        const timertext = document.createElement("label");
        {
            timertext.setAttribute("for", TID);
            timertext.appendChild(document.createTextNode("5 sek timer jaho!"));

        }

        Tdiv.appendChild(timertext);
    }

    startB.insertBefore(Tdiv, start);

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

function validateForm() {
    //Skriver ut fel som görs.
    function throwError(msg) {
        document.querySelector("#errorMsg").textContent = msg;
        throw new Error(msg);
    }
    //Konstanter för längd av namn och svart och vit
    const NAME_MAX_LENGTH = 5;
    const BLACK = "#000000";
    const WHITE = "#ffffff";

    try {
        // Kollar namnen på spelarna och om de är längre än 4
        let player_names = document.querySelectorAll("input[placeholder='nickname']");
        for (let name of player_names) {
            if (name.value.length < NAME_MAX_LENGTH) {
                throwError("A player name is too short!");
            }
        }
        if (player_names[0].value == player_names[1].value) {
            throwError("Both players can not have the same name!");
        }
        // Kollar vilka färger och om de är svart eller vit
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

    initiateGame();
}

//Gömmer där man väljer nickname och färg och startar spelet och det gör spelbortet synligt igen och visar vem som spelar.
//Det sätter även färgen på spelaren till den som den har valt.
function initiateGame() {
    document.querySelector("form").classList.add("d-none");
    document.querySelector("#game-area").classList.remove("d-none");
    document.querySelector("#errorMsg").textContent = "";

    oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;

    oGameData.colorPlayerOne = document.querySelector("#color1").value;
    oGameData.colorPlayerTwo = document.querySelector("#color2").value;

    document.querySelectorAll("td").forEach((field) => {
        field.textContent = "";
        field.style.backgroundColor = "white";
    });

    let playerChar, playerName;
    //Slumpar vilken spelare som ska börja.
    let r = Math.random();
    console.log(r);

    if (r < 0.5) {
        oGameData.currentPlayer = playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
    }

    document.querySelector(".jumbotron>h1").textContent = "Current player is: " + playerName;

    document.querySelector("#game-area table").addEventListener("click", executeMove);

    let timer = document.querySelector("#thisTimer");
    oGameData.timerEnabled = timer.checked;

    if (timer.checked) {
        oGameData.timerId = setTimeout(byt, 5000);
        console.log("logged");
    }


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

function executeMove(clk) {

    const NO_WINNER = 0;
    const X_WINNER = 1;
    const O_WINNER = 2;
    const DRAW = 3;


    if (clk.target.nodeName !== "TD")
        return;

    const jumb = document.querySelector(".jumbotron>h1");
    const ruta = clk.target;
    console.log("nope");
    const rutNummer = ruta.getAttribute("data-id");

    if (oGameData.gameField[rutNummer] === M_P1 || oGameData.gameField[rutNummer] === M_P2)
        return;

    oGameData.gameField[rutNummer] = oGameData.currentPlayer;
    ruta.textContent = oGameData.currentPlayer;

    if (oGameData.currentPlayer === M_P1) {
        ruta.style.backgroundColor = oGameData.colorPlayerOne;
    }
    else if (oGameData.currentPlayer === M_P2) {
        ruta.style.backgroundColor = oGameData.colorPlayerTwo;
    }

    let res = oGameData.checkForGameOver();

    if (res == NO_WINNER) {
        byt();
        console.log("nopebyt")
        return;

    }
    clearTimeout(oGameData.timerId);
    document.querySelector("#game-area table").removeEventListener("click", executeMove);
    document.querySelector("form").classList.remove("d-none");
    document.querySelector("#game-area").classList.add("d-none");
    if (res == X_WINNER)
        jumb.textContent = "Vinnare är: " + M_P1 + "! Spela igen?";
    else if (res == O_WINNER)
        jumb.textContent = "Vinnare är: " + M_P2 + "! Spela igen?";
    else if (res == DRAW)
        jumb.textContent = "Det blev: " + "Oavgjort" + "! Spela igen?";
    oGameData.initGlobalObject();

}

function byt() {

    clearTimeout(oGameData.timerId);

    if (oGameData.currentPlayer === M_P1)
        oGameData.currentPlayer = M_P2;
    else if (oGameData.currentPlayer === M_P2)
        oGameData.currentPlayer = M_P1;

    let playerNickname
    if (oGameData.currentPlayer === M_P1)
        playerNickname = oGameData.nickNamePlayerOne;
    else if (oGameData.currentPlayer === M_P2)
        playerNickname = oGameData.nickNamePlayerTwo;

    document.querySelector(".jumbotron>h1").textContent = "Current player is: " + playerNickname + "!";

    if(oGameData.timerEnabled)
    {
        oGameData.timerId = setTimeout(byt, 5000);
        console.log("bytbyt");
    }

};