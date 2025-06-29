const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 15, paddleHeight = 100, ballRadius = 10;
const player = { x: 10, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight };
const ai = { x: canvas.width - paddleWidth - 10, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight };
const ball = { x: canvas.width/2, y: canvas.height/2, vx: 5, vy: 3, radius: ballRadius };

// Score
let playerScore = 0, aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = 36, color = "#eee") {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height/2;
    // Clamp within bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Basic AI for right paddle
function aiMove() {
    const center = ai.y + ai.height/2;
    if (ball.y < center - 20) ai.y -= 4;
    else if (ball.y > center + 20) ai.y += 4;
    // Clamp within bounds
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Ball and paddle collision detection
function paddleCollision(paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Reset ball after point
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.vy = (Math.random() * 4 - 2); // -2 to 2
}

// Game update loop
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -1;
    }

    // Left paddle collision
    if (paddleCollision(player)) {
        ball.x = player.x + player.width + ball.radius;
        ball.vx *= -1;
        // Add some "spin"
        ball.vy += ((ball.y - (player.y + player.height/2)) / (player.height/2)) * 2;
    }

    // Right paddle collision
    if (paddleCollision(ai)) {
        ball.x = ai.x - ball.radius;
        ball.vx *= -1;
        ball.vy += ((ball.y - (ai.y + ai.height/2)) / (ai.height/2)) * 2;
    }

    // Score
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    aiMove();
}

// Draw everything
function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 2, i, 4, 20, "#444");
    }

    // Paddles
    drawRect(player.x, player.y, player.width, player.height, "#eee");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#eee");

    // Ball
    drawCircle(ball.x, ball.y, ball.radius, "#eee");

    // Score
    drawText(playerScore, canvas.width/4, 50);
    drawText(aiScore, 3*canvas.width/4, 50);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();