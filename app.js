document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".grid div");
    const scoreDisplay = document.querySelector("span");
    const startBtn = document.querySelector(".start");

    const width = 10;
    let currentIndex = 0; // so first div in our grid
    let appleIndex = 0; // so first div in our grid
    let currentSnake = [2, 1, 0]; // Head of the snake at 2 and the tail at 0, body at 1

    let direction = 1;
    let score = 0;
    let speed = 0.9; // Time interval is multiplicated times speed(so the interval is smaller every time snake hits the apple)
    let intervalTime = 0;
    let interval = 0;

    // to start, and restart the game
    function startGame() {
        currentSnake.forEach((index) =>
            squares[index].classList.remove("snake")
        );
        squares[appleIndex].classList.remove("apple");
        clearInterval(interval);
        score = 0;

        randomApple();

        direction = 1;
        scoreDisplay.innerText = score;
        intervalTime = 1000;
        currentSnake = [2, 1, 0];
        currentIndex = 0;
        currentSnake.forEach((index) => squares[index].classList.add("snake"));
        interval = setInterval(moveOutcomes, intervalTime);
    }

    // function that deals with ALL the move outcomes of the snake
    function moveOutcomes() {
        //deals with snake hitting walls and hitting self
        if (
            (currentSnake[0] + width >= width * width && direction === width) || // if snake hits bottom
            (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
            (currentSnake[0] % width === 0 && direction === -1) || //if snakes hits left wall
            (currentSnake[0] - width < 0 && direction === -width) || // if snake hits the top
            squares[currentSnake[0] + direction].classList.contains("snake") //if snake goes into itself
        ) {
            return clearInterval(interval); //this will clear the interval if any of the above happen
        }

        const tail = currentSnake.pop(); // removes last ite of the array and shows it
        squares[tail].classList.remove("snake"); // removes class of snake from the TAIL
        squares[currentSnake[0]].classList.remove("snake-head");
        currentSnake.unshift(currentSnake[0] + direction); // gives direction to the head of the array

        //deals with snake hitting APPLE
        if (squares[currentSnake[0]].classList.contains("apple")) {
            squares[currentSnake[0]].classList.remove("apple");
            squares[tail].classList.add("snake");
            currentSnake.push(tail);
            randomApple();
            score++;
            scoreDisplay.textContent = score;
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutcomes, intervalTime);
        }

        squares[currentSnake[0]].classList.add("snake");
        squares[currentSnake[0]].classList.add("snake-head");
    }

    //generate new apple once apple is eaten
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (squares[appleIndex].classList.contains("snake")); //making sure that apple doesnt appear "on snake"
        squares[appleIndex].classList.add("apple");
    }

    // asign functions to keycodes
    function control(e) {
        squares[currentIndex].classList.remove("snake"); //we are removing the class of snake

        if (e.keyCode === 39) {
            direction = 1; //if we press the right arrow on our keyboard, the snake will turn right.
        } else if (e.keyCode === 38) {
            direction = -width; // up arrow
        } else if (e.keyCode === 37) {
            direction = -1; // left arrow
        } else if (e.keyCode === 40) {
            direction = +width;
        }
    }

    document.addEventListener("keyup", control);
    startBtn.addEventListener("click", startGame);
});
