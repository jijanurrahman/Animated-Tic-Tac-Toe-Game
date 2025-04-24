// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'x';
let gameActive = false;
let player1Name = "Player 1";
let player2Name = "Player 2";
let winnerFound = false;
let gameMoves = 0;

// Audio objects - using reliable free sound sources with proper preloading
const clickSound1 = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568.wav');
const clickSound2 = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270.wav');
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1389/1389.wav');
const drawSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000.wav');
const loseSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2053/2053.wav');

// Preload all sounds
[clickSound1, clickSound2, winSound, drawSound, loseSound].forEach(sound => {
    sound.load();
    // Make sure volume is appropriate
    sound.volume = 0.5;
});

// DOM elements
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const player1Card = document.querySelector('.player-x');
const player2Card = document.querySelector('.player-o');
const celebrationOverlay = document.getElementById('celebration-overlay');
const celebrationText = document.getElementById('celebration-text');
const celebrationImage = document.getElementById('celebration-image');
const continueButton = document.getElementById('continue-button');
const confettiContainer = document.getElementById('confetti-container');

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Celebration images
const celebrationImages = {
    win: [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjEzZGY3MWJmMTVkOWNiYjk0YzZiM2I5YjcxZTNkNTRlZmRkNjZhMSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/nV92wD5N8CkFO/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmE2OWRjNGQ1OWQxNWFhN2YzMjUwZjcxNDNmMzcwZjM1YWU5ZmE5YiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/artj92V8o75VPL7AeQ/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzc3NzNhN2JkYWMwZmYyMzU1NzBjOGMyMjIyZGEzN2IzYjQ1MmFlYSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/QYrMRSMLs4rQQKdLwD/giphy.gif'
    ],
    draw: [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZlM2FlNTcwMjcwMTc5OThmOTgxODA0N2NlYTRlMDVhZGY0YzliYiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/IzX9h9U8shckM/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGVkNGRiNjk0NjNlMmRhM2E4Y2JjYTJkMDVmN2NkZWNkYTA1NjBmMiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/dYZuqJLDVsWMLWyIxJ/giphy.gif'
    ],
    lose: [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzY1ZTNkMTAyM2QzOTcxYmUzY2EzOWQzYTYxZDgxYTE0MWE5ODFmYSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/OPU6wzx8JrHna/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDNhOGYwMTg5YTI5MmEwYjc0OGZkNTdiNTFkZWU4YTEyYTdiN2Q5YiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/2rtQMJvhzOnRe/giphy.gif'
    ]
};

// Initialize the game
function initGame() {
    // Create the cells
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }

    // Set up event listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', fullReset);
    continueButton.addEventListener('click', continueGame);
    
    // Set default names in input fields
    player1Input.value = player1Name;
    player2Input.value = player2Name;
    
    updateMessage("Enter player names and click Start Game!");
}

// Start the game
function startGame() {
    if (gameActive) return;
    
    // Get player names from inputs
    player1Name = player1Input.value.trim() || "Player 1";
    player2Name = player2Input.value.trim() || "Player 2";
    
    // Update input fields with sanitized names
    player1Input.value = player1Name;
    player2Input.value = player2Name;
    
    // Reset game state
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'x';
    gameActive = true;
    winnerFound = false;
    gameMoves = 0;
    
    // Clear the board visually
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
        cell.style.pointerEvents = 'auto';
    });
    
    // Update UI
    startButton.style.display = 'none';
    resetButton.style.display = 'flex';
    player1Card.classList.add('active');
    player2Card.classList.remove('active');
    
    updateMessage(`${player1Name}'s turn (X)`);
    
    // Play a start sound
    playSound(drawSound);
    
    // Add animation to the board
    boardElement.classList.add('animate__animated', 'animate__fadeIn');
    setTimeout(() => {
        boardElement.classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);
}

// Handle cell click
function handleCellClick(event) {
    if (!gameActive) return;
    
    const cellIndex = parseInt(event.target.dataset.index);
    
    // Check if cell is already filled
    if (board[cellIndex] !== '') return;
    
    // Play sound based on current player
    if (currentPlayer === 'x') {
        playSound(clickSound1);
    } else {
        playSound(clickSound2);
    }
    
    // Update the board state
    board[cellIndex] = currentPlayer;
    gameMoves++;
    
    // Update the cell visually with animation
    const cell = event.target;
    cell.textContent = currentPlayer.toUpperCase();
    cell.classList.add(currentPlayer);
    cell.classList.add('animate__animated', 'animate__bounceIn');
    setTimeout(() => {
        cell.classList.remove('animate__animated', 'animate__bounceIn');
    }, 500);
    
    // Check for winner
    if (checkWinner()) {
        const winnerName = currentPlayer === 'x' ? player1Name : player2Name;
        gameActive = false;
        showCelebration('win', winnerName);
        return;
    }
    
    // Check for draw
    if (gameMoves === 9) {
        gameActive = false;
        showCelebration('draw');
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    player1Card.classList.toggle('active');
    player2Card.classList.toggle('active');
    
    // Update message
    const currentPlayerName = currentPlayer === 'x' ? player1Name : player2Name;
    updateMessage(`${currentPlayerName}'s turn (${currentPlayer.toUpperCase()})`);
}

// Helper function for playing sounds reliably
function playSound(sound) {
    // Clone the sound to allow overlapping playback
    const soundClone = sound.cloneNode();
    soundClone.volume = 0.5; // Make sure volume is appropriate
    
    // Add event listener for when playback can begin
    soundClone.addEventListener('canplaythrough', () => {
        // Create a user interaction promise (needed for some browsers)
        const playPromise = soundClone.play();
        
        // Handle potential play() promise rejection
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    });
    
    // Try to load and play the sound
    soundClone.load();
}

// Check for winner
function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinnerCells(pattern);
            winnerFound = true;
            return true;
        }
    }
    return false;
}

// Highlight winner cells
function highlightWinnerCells(pattern) {
    const cells = document.querySelectorAll('.cell');
    pattern.forEach(index => {
        cells[index].classList.add('winner');
        cells[index].classList.add('animate__animated', 'animate__pulse');
        cells[index].style.animationIterationCount = 'infinite';
    });
}

// Update message element
function updateMessage(message) {
    messageElement.textContent = message;
    messageElement.classList.add('animate__animated', 'animate__fadeIn');
    setTimeout(() => {
        messageElement.classList.remove('animate__animated', 'animate__fadeIn');
    }, 500);
}

// Full reset (including player names)
function fullReset() {
    // Reset to default names
    player1Name = "Player 1";
    player2Name = "Player 2";
    player1Input.value = player1Name;
    player2Input.value = player2Name;
    
    // Reset game state and UI
    resetGameState();
    
    // Play a reset sound
    playSound(drawSound);
    
    updateMessage("Enter player names and click Start Game!");
}

// Continue game (preserves player names)
function continueGame() {
    // Close celebration overlay
    celebrationOverlay.classList.remove('active');
    clearConfetti();
    
    // Reset game state but keep player names
    resetGameState();
    
    // Set the player names back in the input fields
    player1Input.value = player1Name;
    player2Input.value = player2Name;
    
    updateMessage("Game reset! Click Start Game to play again.");
}

// Reset game state and UI
function resetGameState() {
    // Reset game state
    gameActive = false;
    
    // Update UI
    startButton.style.display = 'flex';
    resetButton.style.display = 'none';
    player1Card.classList.add('active');
    player2Card.classList.remove('active');
    
    // Clear cells with animation
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.add('animate__animated', 'animate__fadeOut');
    });
    
    setTimeout(() => {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner', 'animate__animated', 'animate__fadeOut', 'animate__pulse');
            cell.style.animationIterationCount = '';
            cell.style.pointerEvents = 'auto';
        });
        
        boardElement.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            boardElement.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    }, 500);
}

// Show celebration overlay
function showCelebration(type, winnerName = '') {
    // Set celebration content
    let message = '';
    let imageUrl = '';
    
    if (type === 'win') {
        message = `🎉 Congratulations! ${winnerName} Wins! 🎉`;
        imageUrl = celebrationImages.win[Math.floor(Math.random() * celebrationImages.win.length)];
        playSound(winSound);
        createConfetti(100);
    } else if (type === 'draw') {
        message = '😊 It\'s a Draw! Good game! 😊';
        imageUrl = celebrationImages.draw[Math.floor(Math.random() * celebrationImages.draw.length)];
        playSound(drawSound);
    } else if (type === 'lose') {
        const loserName = currentPlayer === 'x' ? player2Name : player1Name;
        message = `😢 ${loserName} Lost! Better luck next time! 😢`;
        imageUrl = celebrationImages.lose[Math.floor(Math.random() * celebrationImages.lose.length)];
        playSound(loseSound);
    }
    
    celebrationText.textContent = message;
    celebrationImage.src = imageUrl;
    
    // Show overlay with animation
    celebrationOverlay.classList.add('active');
    
    // If it's a win, show who lost too (after a delay)
    if (type === 'win') {
        setTimeout(() => {
            const loserName = currentPlayer === 'x' ? player2Name : player1Name;
            showLoseMessage(loserName);
        }, 3000);
    }
}

// Show lose message
function showLoseMessage(loserName) {
    if (!winnerFound) return;
    
    // Create and show a temporary message
    const loseMessage = document.createElement('div');
    loseMessage.textContent = `😢 ${loserName} Lost! 😢`;
    loseMessage.style.position = 'fixed';
    loseMessage.style.bottom = '100px';
    loseMessage.style.left = '50%';
    loseMessage.style.transform = 'translateX(-50%)';
    loseMessage.style.backgroundColor = 'rgba(0,0,0,0.7)';
    loseMessage.style.color = 'white';
    loseMessage.style.padding = '15px 30px';
    loseMessage.style.borderRadius = '50px';
    loseMessage.style.zIndex = '100';
    loseMessage.classList.add('animate__animated', 'animate__fadeInUp');
    
    document.body.appendChild(loseMessage);
    
    // Play lose sound
    playSound(loseSound);
    
    // Remove the message after a delay
    setTimeout(() => {
        loseMessage.classList.remove('animate__fadeInUp');
        loseMessage.classList.add('animate__fadeOutDown');
        setTimeout(() => {
            document.body.removeChild(loseMessage);
        }, 1000);
    }, 3000);
}

// Create confetti effect
function createConfetti(count) {
    clearConfetti();
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-10px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        confettiContainer.appendChild(confetti);
        
        // Animate the confetti
        let animationDuration = Math.random() * 3 + 2;
        let horizontalPosition = Math.random() * 100 - 50;
        
        confetti.animate([
            { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) translateX(${horizontalPosition}px) rotate(${Math.random() * 1000}deg)`, opacity: 0 }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (confettiContainer.contains(confetti)) {
                confettiContainer.removeChild(confetti);
            }
        }, animationDuration * 1000);
    }
}

// Clear all confetti
function clearConfetti() {
    confettiContainer.innerHTML = '';
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);