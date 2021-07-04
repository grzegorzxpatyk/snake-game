import { exampleArr } from './exampleStorage.js';

console.log(exampleArr);

document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('.score .score-display');
    const scoreDisplayGameOver = document.querySelector(
        '.score-game-over .score-display'
    );
    const startBtn = document.querySelector('.start');
    const restartBtn = document.querySelector('.restart');

    const width = 10;
    let currentIndex = 0; // so first div in our grid
    let appleIndex = 0; // so first div in our grid
    let currentSnake = [2, 1, 0]; // Head of the snake at 2 and the tail at 0, body at 1

    let direction = 1;
    let score = 0;
    let speed = 0.9; // Time interval is multiplicated times speed(so the interval is smaller every time snake hits the apple)
    let intervalTime = 0;
    let interval = 0;

    document.querySelector('.game').classList.toggle('blur');

    // function to toggle display of gameover screen

    // by default new-game-screen should be loaded at DOMContentLoaded, and should dissapear
    // when the startBtn is clicked.
    // then the game-over-screen should appear when snake hits walls or itself.
    // when the restart button is clicked the screen disappears.
    function gameOverScreen() {
        if (currentSnake !== null) {
            document
                .querySelector('.game-over-screen')
                .classList.toggle('visible');
            document.querySelector('.game').classList.toggle('blur');
        }
    }

    // to start, and restart the game
    function startGame() {
        if (
            !document
                .querySelector('.new-game-screen')
                .classList.contains('hidden')
        ) {
            document.querySelector('.new-game-screen').classList.add('hidden');
            document.querySelector('.game').classList.toggle('blur');
        } else {
            gameOverScreen();
        }
        // document.querySelector(".game").classList.toggle("blur");

        currentSnake.forEach(
            (index) => squares[index].classList.remove('snake') //removes the body of a snake
        );

        squares[currentSnake[0]].classList.remove('snake-head'); //removes the head

        squares[appleIndex].classList.remove('apple');
        clearInterval(interval);
        score = 0;

        randomApple();

        direction = 1;
        scoreDisplay.innerText = score;
        scoreDisplayGameOver.innerText = score;
        intervalTime = 600;
        currentSnake = [2, 1, 0];
        currentIndex = 0;
        currentSnake.forEach((index) => squares[index].classList.add('snake'));
        squares[currentSnake[0]].classList.add('snake-head');
        interval = setInterval(moveOutcomes, intervalTime);
    }

    // function that deals with ALL the move outcomes of the snake
    function moveOutcomes() {
        //deals with snake hitting walls and hitting self - game over
        if (
            (currentSnake[0] + width >= width * width && direction === width) || // if snake hits bottom
            (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
            (currentSnake[0] % width === 0 && direction === -1) || //if snakes hits left wall
            (currentSnake[0] - width < 0 && direction === -width) || // if snake hits the top
            squares[currentSnake[0] + direction].classList.contains('snake') //if snake goes into itself
        ) {
            gameOverScreen();
            return clearInterval(interval); //this will clear the interval if any of the above happen
        }
        //outcome of those ^^ is GAME OVER

        const tail = currentSnake.pop(); // removes last ite of the array and shows it
        squares[tail].classList.remove('snake'); // removes class of snake from the TAIL
        squares[currentSnake[0]].classList.remove('snake-head');

        // erasing the direction class from every div inside grid
        squares.forEach(index => index.classList.remove('right'));
        squares.forEach(index => index.classList.remove('left'));
        squares.forEach(index => index.classList.remove('up'));
        squares.forEach(index => index.classList.remove('down'));
        
        // gives direction to the head of the array
        currentSnake.unshift(currentSnake[0] + direction); 

        //deals with snake hitting APPLE
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple();
            score++;
            scoreDisplay.textContent = score;
            scoreDisplayGameOver.textContent = score;
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutcomes, intervalTime);
        }

        squares[currentSnake[0]].classList.add('snake');
        squares[currentSnake[0]].classList.add('snake-head');

        if (direction === 1) {
            squares[currentSnake[0]].classList.add('right');
            
        } else if (direction === -1) {
            squares[currentSnake[0]].classList.remove('right');
            squares[currentSnake[0]].classList.remove('up');
            squares[currentSnake[0]].classList.remove('down');
            
            squares[currentSnake[0]].classList.add('left');
        } else if (direction === -10) {
            squares[currentSnake[0]].classList.remove('right');
            squares[currentSnake[0]].classList.remove('left');
            squares[currentSnake[0]].classList.remove('down');
            
            squares[currentSnake[0]].classList.add('up');
        } else if (direction === 10) {
            squares[currentSnake[0]].classList.remove('right');
            squares[currentSnake[0]].classList.remove('up');
            squares[currentSnake[0]].classList.remove('left');
            
            squares[currentSnake[0]].classList.add('down');
        } 
    }

    //generate new apple once apple is eaten
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (squares[appleIndex].classList.contains('snake')); //making sure that apple doesnt appear "on snake"
        squares[appleIndex].classList.add('apple');
    }

    // asign functions to keycodes
    function control(e) {
        squares[currentIndex].classList.remove('snake'); //we are removing the class of snake

        if (e.keyCode === 39) { // right arrow
            direction = 1; //if we press the right arrow on our keyboard, the snake will turn right.
        } else if (e.keyCode === 38) {
            direction = -width; // up arrow
        } else if (e.keyCode === 37) {
            direction = -1; // left arrow
        } else if (e.keyCode === 40) { // down arrow
            direction = +width;
        }

    }

    document.addEventListener('keyup', control);
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

});
