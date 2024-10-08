// Cow Pie Bingo was created on an iPad.

console.log("Get ready for some Cow Pie Bingo!");

let players = [];
let numPlayers;
let maxTime;
let gridSize = 10; // Define the grid size (10x10 for simplicity)
let cowPosition = { x: 0, y: 0 };
let cowPreviousMove = 'stay';  // Initialize with a default move
let cowTimeout;

function startGame() {
    numPlayers = document.getElementById('numPlayers').value;
    maxTime = parseInt(document.getElementById('gameTime').value) * 60000; // Convert to milliseconds
    setupPlayers();
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    
    startCountdown(maxTime); // Start the countdown timer

    initiateCowMovement();

    window.scrollTo(0, 0);
}

function startCountdown(time) {
    const timerElement = document.getElementById('timer');
    let timeLeft = time / 1000; // Convert milliseconds to seconds

    const countdownInterval = setInterval(() => {
        timerElement.innerHTML = `Time Left: ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerElement.innerHTML = 'Time is up!';
            endGame();
        }
        
        timeLeft--;
    }, 1000); // Update every second
}

function setupPlayers() {
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        let playerName = prompt(`Enter name for player ${i + 1}`);
        players.push({ playerName: playerName, square: i });
    }
    // Divide the pasture into a grid and assign squares to players
    // You can implement a visual representation of this if needed
}

function initiateCowMovement() {
    cowPosition = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    drawCow();  // Draw the cow at the initial position

    let moveStart = Date.now();
    let pieDropped = false;  // Track whether the cowpie has been dropped
    let moveInterval = setInterval(() => {
        if (Date.now() - moveStart > maxTime) {
            clearInterval(moveInterval);
            if (!pieDropped) {
                dropCowPie();  // Ensure cowpie drops if it hasn't already
            } else {
                endGame();
            }
            return;
        }

        let moveChance = Math.random();
        let move = moveChance < 0.2 ? cowPreviousMove : getRandomMove();
        
        switch (move) {
            case 'up': cowPosition.y = Math.max(0, cowPosition.y - 1); break;
            case 'down': cowPosition.y = Math.min(gridSize - 1, cowPosition.y + 1); break;
            case 'left': cowPosition.x = Math.max(0, cowPosition.x - 1); break;
            case 'right': cowPosition.x = Math.min(gridSize - 1, cowPosition.x + 1); break;
            case 'stay': break;
        }

        cowPreviousMove = move;
        drawCow();  // Redraw the cow at the new position

        // Drop the cowpie at a defined portion of the game time
        if (!pieDropped && Date.now() - moveStart > maxTime * 0.25) {
            pieDropped = true;
            dropCowPie();
        }
        
    }, 250);
}

function getRandomMove() {
    const moves = ['up', 'down', 'left', 'right', 'stay'];
    return moves[Math.floor(Math.random() * moves.length)];
}

function drawCow() {
    let svgElement = document.getElementById('cow-svg');
    
    if (!svgElement) {
        // If the cow SVG does not exist, create and add it
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("id", "cow-svg");
        svgElement.setAttribute("width", "50px"); // Adjust the width
        svgElement.setAttribute("height", "50px"); // Adjust the height
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("style", `position: absolute; top: ${cowPosition.y * 50}px; left: ${cowPosition.x * 50}px;`); // Adjust size accordingly
        document.getElementById('pasture').appendChild(svgElement);
    }
    
    svgElement.innerHTML = `
        <!-- Cow body -->
        <ellipse cx="25" cy="30" rx="12" ry="8" fill="white" stroke="black" stroke-width="1.5" />

        <!-- Cow head -->
        <circle cx="25" cy="15" r="6" fill="white" stroke="black" stroke-width="1.5" />

        <!-- Cow ears -->
        <ellipse cx="18" cy="12" rx="3" ry="2" fill="white" stroke="black" stroke-width="1.5" />
        <ellipse cx="32" cy="12" rx="3" ry="2" fill="white" stroke="black" stroke-width="1.5" />

        <!-- Cow eyes -->
        <circle cx="22" cy="14" r="1" fill="black" />
        <circle cx="28" cy="14" r="1" fill="black" />

        <!-- Cow nose -->
        <ellipse cx="25" cy="18" rx="3" ry="1.5" fill="pink" stroke="black" stroke-width="1" />

        <!-- Cow legs -->
        <rect x="18" y="38" width="3" height="7" fill="black" />
        <rect x="29" y="38" width="3" height="7" fill="black" />
    `;
    
    svgElement.setAttribute("style", `position: absolute; top: ${Math.min(cowPosition.y * 50, window.innerHeight - 50)}px; left: ${Math.min(cowPosition.x * 50, window.innerWidth - 50)}px;`);
}

function dropCowPie() {
    const pieSize = 20;  // Adjust size as needed

    // Add cow pie to the pasture
    document.getElementById('pasture').innerHTML += `
        <svg width="${pieSize}" height="${pieSize}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style="position: absolute; top: ${cowPosition.y * 50 + 40}px; left: ${cowPosition.x * 50 + 25}px;">
            <!-- Poop Emoji Base -->
            <path d="M25,10
                     C20,10 15,15 15,20
                     C15,25 20,30 25,30
                     C30,30 35,25 35,20
                     C35,15 30,10 25,10
                     Z"
                  fill="brown" stroke="black" stroke-width="1" />
        
            <!-- Top Part -->
            <path d="M25,5
                     C20,5 15,10 15,15
                     C15,20 20,25 25,25
                     C30,25 35,20 35,15
                     C35,10 30,5 25,5
                     Z"
                  fill="saddlebrown" stroke="black" stroke-width="1" />
        
            <!-- Eyes -->
            <circle cx="20" cy="17" r="1" fill="black" />
            <circle cx="30" cy="17" r="1" fill="black" />
        
            <!-- Mouth -->
            <path d="M22,22
                     Q25,24 28,22"
                  stroke="black" stroke-width="1.5" fill="none" />
        </svg>`;
    
    // Determine the winner based on the cow's position
    let winner = players.find(player => player.square === (cowPosition.y * gridSize + cowPosition.x) % numPlayers);

    // Display the winner's name in the overlay
    document.getElementById('status').innerHTML = winner ? `Ohh CRAP - ${winner.playerName} Wins!<br><a href="https://iandonmorgan.github.io">PLAY AGAIN</a>` : 'No winner!';

    // Show the status div
    document.getElementById('status').style.display = 'block';
}

function endGame() {
    document.getElementById('status').innerHTML = `Congrats ${winner.playerName}!<br><a href="https://iandonmorgan.github.io">PLAY AGAIN</a>`;
}