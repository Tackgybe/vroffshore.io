document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');

    let score = 0;
    let isGameOver = false;
    let animationId = null;

    // Player (Boat) properties
    let boat = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 60,
        width: 30,
        height: 45,
        speed: 6
    };

    // Obstacles (Rocks) array
    let obstacles = [];
    let obstacleTimer = 0;

    // Track keyboard controls
    let keys = {
        ArrowLeft: false,
        ArrowRight: false
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            keys[e.key] = true;
            // Prevent page from scrolling when pressing arrow keys
            e.preventDefault(); 
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            keys[e.key] = false;
        }
    });

    // Spawn obstacles periodically
    function spawnObstacle() {
        const width = Math.random() * 35 + 25;
        const x = Math.random() * (canvas.width - width);
        obstacles.push({
            x: x,
            y: -40,
            width: width,
            height: 25,
            speed: 3.5
        });
    }

    // Draw the player's boat
    function drawBoat() {
        // Hull
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(boat.x + 8, boat.y + 15, 14, 25); 
        
        // Sail
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.moveTo(boat.x + 15, boat.y);
        ctx.lineTo(boat.x + 30, boat.y + 18);
        ctx.lineTo(boat.x + 15, boat.y + 25);
        ctx.fill(); 
    }

    // Draw obstacles (rocks)
    function drawObstacles() {
        ctx.fillStyle = '#808080';
        obstacles.forEach(obs => {
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
            } else {
                ctx.rect(obs.x, obs.y, obs.width, obs.height);
            }
            ctx.fill();
        });
    }

    // Check collision between boat and rocks
    function checkCollision() {
        for (let obs of obstacles) {
            if (
                boat.x < obs.x + obs.width &&
                boat.x + boat.width > obs.x &&
                boat.y < obs.y + obs.height &&
                boat.y + boat.height > obs.y
            ) {
                isGameOver = true;
            }
        }
    }

    // Main game loop
    function updateGame() {
        if (isGameOver) {
            cancelAnimationFrame(animationId);
            restartBtn.classList.remove('hidden');
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move boat based on input boundaries
        if (keys.ArrowLeft && boat.x > 0) {
            boat.x -= boat.speed;
        }
        if (keys.ArrowRight && boat.x < canvas.width - boat.width) {
            boat.x += boat.speed;
        }

        // Handle obstacle spawning and movement
        obstacleTimer++;
        if (obstacleTimer > 60) {
            spawnObstacle();
            obstacleTimer = 0;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.y += obs.speed;
            
            // Remove off-screen obstacles and add to score
            if (obs.y > canvas.height) {
                obstacles.splice(i, 1);
                score += 10;
                scoreDisplay.textContent = score;
            }
        }

        drawBoat();
        drawObstacles();
        checkCollision();

        animationId = requestAnimationFrame(updateGame);
    }

    // Restart game listener
    restartBtn.addEventListener('click', () => {
        score = 0;
        scoreDisplay.textContent = score;
        obstacles = [];
        boat.x = canvas.width / 2 - 15;
        isGameOver = false;
        restartBtn.classList.add('hidden');
        updateGame();
    });

    // Kick off the game loop automatically on load
    updateGame();
});
