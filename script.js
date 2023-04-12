let state = 30;

const MINIMIZER = 1;
const MAXIMIZER = -1;

let playerTurn = null;
let computerTurn = null;

const cheatingBox = document.getElementById('cheating');

const stateElem = document.getElementById('state');
const optionsElem = document.getElementById('options');
const gameButtonsElem = document.getElementById('game-buttons');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const playerBtn = document.getElementById('player');
const computerBtn = document.getElementById('computer');
const messageElem = document.getElementById('message');

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
playerBtn.addEventListener('click', selectPlayer);
computerBtn.addEventListener('click', selectComputer);

cheatingBox.addEventListener('change', function() {
    const cheatingMsg = document.getElementById('cheating-msg');
    if (this.checked) {
        cheatingMsg.innerHTML = "Aj, aj, aj. Nav smuki šmaukties, varbūt tomēr nevajag?";
    } else {
        cheatingMsg.innerHTML = "";
    }
});

function findBestMove() {
    // Pieņemts, ka spēli sāk maksimizētājs,
    // katru gājienu algoritms meklēs labāko gājienu, tā itkā spēle būtu sākusies ar pašreizējo skaitu,
    // teorētiski varētu saglabāt visu koku un vadīties pēc tā neģenerējot jaunu koku pēc katra gājiena,
    // laika apsvērumu dēļ pārrēķinu pēc katra gājiena
    // tapēc izmantojam maksimizētāju priekš katra gājiena, bet tik pat labi
    // var atkomentēt visas zemāk izkomentētās rindiņas un nokomentēt to alternatīvas - rezultāts būtu tas pats

    let bestMove = null;
    // let bestScore = -Infinity;
    let bestScore = Infinity;
	for (let i = 1; i <= 6; i++) {
		if (state - i >= 0) {
            // let score = minimax(0, MINIMIZER, state - i);
			let score = minimax(0, MAXIMIZER, state - i);
            // if (score > bestScore) {
			if (score < bestScore) {
				bestScore = score;
				bestMove = i;
                // console.log("bestMove=" + bestMove)
			}
		}
	}

    return bestMove
}

// galvenā funkcija
function minimax(depth, player, state) {
	// Ja gala virsotne (punkti ir sasniegts kā 0), atgriež, kas uzvar minimizētājs vai maksimizētājs
	if (state == 0) {
		return player == MAXIMIZER ? MAXIMIZER : MINIMIZER;
	}

	// izvēlas optimālāko ceļu
	if (player == MAXIMIZER) {
        // uzliek bestScore kā - bezgalību, jo Math.max salīdzina un izvēlas visaugstāko vērtību, defaultā ir 0
		let bestScore = -Infinity;

        // iet cauri visiem iespējamajiem gājieniem
		for (let i = 1; i <= 6; i++) {
            // ja punktu skaits ir mazāks nekā iespējamie gājieni labākais gājiens ir atrasts
			if (state - i >= 0) {
                // ja nav sasniegts maksimālais dziļums,
                // mēģinam iet cauri visam velreiz, tikai šoreiz kā minimizētājs
				let score = minimax(depth + 1, MINIMIZER, state - i);
                // salīdzinam kurš ir labākais gājiens
				bestScore = Math.max(score, bestScore);
                // console.log("score=" + score)
                // console.log("bestScore=" + bestScore)
			}
		}
		return bestScore;
    // šeit viss notiek kā pirmstam tikai otrādi
	} else {
		let bestScore = Infinity;
		for (let i = 1; i <= 6; i++) {
			if (state - i >= 0) {
				let score = minimax(depth + 1, MAXIMIZER, state - i);
				bestScore = Math.min(score, bestScore);
                // console.log("score=" + score)
                // console.log("bestScore=" + bestScore)
			}
		}
		return bestScore;
	}
}

function computerMove() {
	let bestMove = findBestMove();

	state -= bestMove;
	stateElem.textContent = state;

	if (state == 0) {
		messageElem.textContent = 'Tu zaudēji! :(';
		startBtn.style.display = 'none';
		restartBtn.style.display = 'block';
		optionsElem.style.display = 'block';
		return;
	}

	playerTurn = true;
	computerTurn = false;
	messageElem.textContent = 'Tavs gājiens!';

    giveHint()

    for (const child of gameButtonsElem.children) {
        if (parseInt(child.id) > state)
        {
            child.style.display = 'none'
        }
    }
    gameButtonsElem.style.display = 'block'

}

function giveHint() {
    if (!cheatingBox.checked) {
        return
    }

    const messageElem = document.getElementById('cheating-info');

    let bestMove = findBestMove(MINIMIZER)
    messageElem.innerHTML = "Labākais gājiens ir " + bestMove;
}

function playerMove(selectedMove) {
    gameButtonsElem.style.display = 'none'

	state -= selectedMove;
	stateElem.textContent = state;

	if (state == 0) {
		messageElem.textContent = 'Tu uzverēji!';
        if (cheatingBox.checked) {
            messageElem.textContent = 'Tu uzverēji... Bet tu šmaucies :/'
        }
		startBtn.style.display = 'none';
		restartBtn.style.display = 'block';
		optionsElem.style.display = 'block';
		return;
	}

	// Set the turn flags
	playerTurn = false;
	computerTurn = true;
	messageElem.textContent = 'Datora gājiens...';

	// Make the computer's move
	setTimeout(computerMove, 1000);
}

function startGame() {
	if (!playerTurn && !computerTurn) {
		messageElem.textContent = 'Izvēlies kurš sāks';
		return;
	}

	// startBtn.style.display = 'none';
	optionsElem.style.display = 'none';


    for (const child of gameButtonsElem.children) {
        child.style.display = 'default'
    }

	stateElem.style.display = 'block';

	if (playerTurn) {
        playerTurn = true;
        computerTurn = false;
        messageElem.textContent = 'Tavs gājiens!';
        gameButtonsElem.style.display = 'block';
	} else {
        playerTurn = false;
        computerTurn = true;
        messageElem.textContent = 'Datora gājiens...';
        gameButtonsElem.style.display = 'none';

        setTimeout(computerMove, 1000);
	}

    giveHint()
}

function restartGame() {
	state = 30;
	stateElem.textContent = state;
	messageElem.textContent = '';
	startBtn.style.display = 'block';
	restartBtn.style.display = 'none';
	playerTurn = null;
	computerTurn = null;
}

function selectPlayer() {
	playerTurn = true;
	computerTurn = false;
	messageElem.textContent = 'Tavs gājiens!';
}

function selectComputer() {
	playerTurn = false;
	computerTurn = true;
	messageElem.textContent = 'Datora gājiens...';
}
