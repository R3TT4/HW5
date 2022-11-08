// Name: Everett Johnson
// Class: CPSC 332 
// Assignment: Homework 5
// Last Modified: 11/7/2022

var color1 = "#FF00FF";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    var startBoxLeft = x / 1.5;
    var startBoxRight = startBoxLeft + (x / 1.5);
    var startBoxTop = y / 2;
    var startBoxBot = startBoxTop + (y / 8);

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            won = true;
                            endGame = true;
                            checkWinState();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    checkWinState();
                    endGame = true;
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx * gameSpeed;
        y += dy * gameSpeed;

        if (!paused && !endGame) {
            requestAnimationFrame(draw);
        }

    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    var gameSpeed = 1;
    //pause game variable
    var paused = false;
    var endGame = false;
    //high score tracking variables
    var highScore = 0;
    var won = false;
    //other variables?

    //event listeners added
    //game speed changes handler      
    document.getElementById("speed-slider").addEventListener("input", adjustGameSpeed);
    //pause game event handler 
    document.getElementById("pause-button").addEventListener("click", togglePauseGame);
    //start a new game event handler  
    document.getElementById("reset-button").addEventListener("click", startNewGame);
    //continue playing
    document.getElementById("continue-button").addEventListener("click", continuePlaying);
    //reload click event listener   
    document.getElementById("reload-button").addEventListener("click", () => {
        location.reload();
    });

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("High Score: " + highScore, (canvas.width / 2) - 30, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //draw the rectangle menu backdrop
        setShadow();
        ctx.fillStyle = "green";
        ctx.fillRect(20, 20, 440, 280);

        //draw the menu header
        ctx.font = "28pt Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Breakout Game", x / 2, y / 3);

        //start game button area
        ctx.fillStyle = "yellow";
        ctx.fillRect(x / 1.5, y / 2, x / 1.5, y / 8);
        ctx.font = "18pt Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Start Game", (x / 1.5) + 20, (y / 2) + y / 8 - 10);

        resetShadow();

        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later                
        canvas.addEventListener("click", startGameClick); //Need to restrict to button only
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black";
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "transparent";
    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game       
        canvas.removeEventListener("click", startGameClick);
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        let xVal = event.pageX - canvas.offsetLeft,
            yVal = event.pageY - canvas.offsetTop;

        if (xVal < startBoxRight &&
            xVal > startBoxLeft &&
            yVal > startBoxTop &&
            yVal < startBoxBot) {
            clearMenu();
            draw();
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        //update the slider display                
        //update the game speed multiplier    
        document.getElementById("speed-label").innerText = "Game Speed: " + document.getElementById("speed-slider").value;
        gameSpeed = document.getElementById("speed-slider").value;
    };

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        if (!paused) {
            paused = true;
        } else {
            paused = false;
            requestAnimationFrame(draw);
        }
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        if (won) {
            ctx.font = "28pt Arial";
            ctx.fillStyle = "Black";
            ctx.fillText("YOU WIN!", (canvas.width / 3) - 20, canvas.height / 2);
        } else {
            ctx.font = "28pt Arial";
            ctx.fillStyle = "Black";
            ctx.fillText("YOU LOSE!", (canvas.width / 3) - 20, canvas.height / 2);
        }
    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        highScore = 0;
        resetBoard(3);
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        if (endGame && won) {
            highScore += score;
            score = 0;
            resetBoard(lives);
        }

    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        //reset paddle position
        paddleX = (canvas.width - paddleWidth) / 2;
        //reset bricks         
        bricks = [];

        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        //reset score and lives
        gameSpeed = 1;
        paused = false;
        endGame = false;
        won = false;
        score = 0;
        lives = resetLives;
        requestAnimationFrame(draw);
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game     
    //draw();
    drawMenu();

};//end window.onload function