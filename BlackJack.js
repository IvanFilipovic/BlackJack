/*
        Blackjack by Ivan Filipović
        25.08.2019
*/

// Varijable karti
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];

// DOM varijable
let textArea = document.getElementById('text-area'),
    newGameBtn = document.getElementById('newGameBtn'),
    hitBtn = document.getElementById('hitBtn'),
    stayBtn = document.getElementById('stayBtn');

// Varijable igre
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    playerScore = 0,
    dealerScore = 0,
    deck = [];

hitBtn.style.display = 'none';
stayBtn.style.display = 'none';
showStatus();


// Funkcija za početak igre
newGameBtn.addEventListener('click', function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getCard(), getCard() ];
    playerCards = [ getCard(), getCard() ];

    newGameBtn.style.display = 'none';
    hitBtn.style.display = 'inline';
    stayBtn.style.display = 'inline';
    showStatus();
});

hitBtn.addEventListener('click', function(){
    playerCards.push(getCard());
    checkEnd();
    showStatus();
});

stayBtn.addEventListener('click', function(){
    gameOver = true;
    checkEnd();
    showStatus();
});

// Stvaranje špila - objekt sa dvije vrijednosti boja i brojčana vrijednost
function createDeck(){
    let deck = [];
    for (let suitId = 0; suitId < suits.length; suitId++) {
        for (let valueId = 0; valueId < values.length; valueId++) {
            let card = {
                suit: suits[suitId],
                value: values[valueId]
            };
            deck.push(card);
        }
    }
    return deck;
}

// Funkcija za slučajnost
function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let shuffleId = Math.round(Math.random() * deck.length);
        let tmp = deck[shuffleId];
        deck[shuffleId] = deck[i];
        deck[i] = tmp;
    }
}

function getCardString(card) {
    return card.value + ' of ' + card.suit;
}

function getCard() {
    return deck.shift();
}

// Dodjeljivanje vrijednosti kartama

function getCardValue(card) {
    switch(card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray) {
    let score = 0,
        ace = false;
    for (let i = 0; i < cardArray.length; i++){
        let card = cardArray[i];
        score += getCardValue(card);
        if (card.value === 'Ace') {
            ace = true;
        }
    }
    // Vrijdnost asa 10 ili 1
    if (ace && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScore() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkEnd() {
    updateScore();

    if (gameOver) {
        // Ako je vrijednost kuće viša od 17 ne smije uzeti dodatnu kartu
        while (dealerScore < playerScore && playerScore <= 21 && dealerScore < 17) {
            dealerCards.push(getCard());
            updateScore();
        }
    }
    
    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }
    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }
    else if (gameOver) {

        if (playerScore > dealerScore) {
            playerWon = true;
        }
        else {
            playerWon = false;
        }
    }
}

function showStatus() {

    if (!gameStarted) {
        textArea.innerText = 'Welcome to Blackjack!';
        return;
    }
        
    let dealerCardString = '';
    for (let i=0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }
        
    let playerCardString = '';
    for (let i=0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + '\n';
    }
        
    updateScore();
         
    textArea.innerText = 
        'Dealer has:\n' +
        dealerCardString + 
        '(score: '+ dealerScore  + ')\n\n' +
          
        'Player has:\n' +
        playerCardString +
        '(score: '+ playerScore  + ')\n\n';
        
    if (gameOver) {
        if (playerWon) {
        textArea.innerText += "YOU WIN!";
        }
        else {
            textArea.innerText += "DEALER WINS";
        }
    newGameBtn.style.display = 'inline';
    hitBtn.style.display = 'none';
    stayBtn.style.display = 'none';
    }
}
