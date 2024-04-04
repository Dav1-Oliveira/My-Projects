document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('gameBoard');
    const boardSize = 400;
    const cellSize = 20;
    let gameSpeed = 150; // Velocidade inicial do jogo.
    let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    let fruit = { x: 300, y: 200 };
    let dx = cellSize;
    let dy = 0;
    let changingDirection = false;
    let score = 0;

    function saveRecord(score) {
        localStorage.setItem('record', score);
    }

    function getRecord() {
        return localStorage.getItem('record') || 0;
    }

    function main() {
        if (hasGameEnded()) return;
        changingDirection = false;
        setTimeout(() => {
            clearBoard();
            drawFruit();
            moveSnake();
            drawSnake();
            main();
        }, gameSpeed);
    }

    function clearBoard() {
        board.innerHTML = '';
    }

    function drawSnake() {
        snake.forEach(part => {
            const snakeElement = document.createElement('div');
            snakeElement.style.left = `${part.x}px`;
            snakeElement.style.top = `${part.y}px`;
            snakeElement.classList.add('snake');
            board.appendChild(snakeElement);
        });
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        
        const ateFruit = snake[0].x === fruit.x && snake[0].y === fruit.y;
        if (ateFruit) {
            score++;
            updateScore();
            generateFruit();
        } else {
            snake.pop();
        }
    }

    function generateFruit() {
        let validFruit = false;
        while (!validFruit) {
            fruit.x = Math.floor(Math.random() * (boardSize / cellSize)) * cellSize;
            fruit.y = Math.floor(Math.random() * (boardSize / cellSize)) * cellSize;
            validFruit = !snake.some(part => part.x === fruit.x && part.y === fruit.y);
        }
    }

    function drawFruit() {
        const fruitElement = document.createElement('div');
        fruitElement.style.left = `${fruit.x}px`;
        fruitElement.style.top = `${fruit.y}px`;
        fruitElement.classList.add('fruit');
        board.appendChild(fruitElement);
    }

    function hasGameEnded() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                document.getElementById('restartButton').style.display = 'block';
                return true;
            }
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= boardSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= boardSize;
        if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
            document.getElementById('restartButton').style.display = 'block';
            return true;
        }

        return false;
    }

    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;
        let keyPressed;
        // Verifica se o evento é de um botão ou de um teclado
        if (event.keyCode) {
            keyPressed = event.keyCode;
        } else if (event.target.id) {
            // Mapeia os IDs dos botões para os códigos de tecla correspondentes
            const keyMap = {
                'upButton': 38,
                'downButton': 40,
                'leftButton': 37,
                'rightButton': 39
            };
            keyPressed = keyMap[event.target.id];
        }

        const goingUp = dy === -cellSize;
        const goingDown = dy === cellSize;
        const goingRight = dx === cellSize;
        const goingLeft = dx === -cellSize;

        if (keyPressed === 87 && !goingDown) { // W
            dx = 0;
            dy = -cellSize;
        } else if (keyPressed === 83 && !goingUp) { // S
            dx = 0;
            dy = cellSize;
        } else if (keyPressed === 65 && !goingRight) { // A
            dx = -cellSize;
            dy = 0;
        } else if (keyPressed === 68 && !goingLeft) { // D
            dx = cellSize;
            dy = 0;
        } else if (keyPressed === 37 && !goingRight) { // ArrowLeft
            dx = -cellSize;
            dy = 0;
        } else if (keyPressed === 38 && !goingDown) { // ArrowUp
            dx = 0;
            dy = -cellSize;
        } else if (keyPressed === 39 && !goingLeft) { // ArrowRight
            dx = cellSize;
            dy = 0;
        } else if (keyPressed === 40 && !goingUp) { // ArrowDown
            dx = 0;
            dy = cellSize;
        }
    }

    function updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Pontuação: ${score}`;

        const record = getRecord();
        if (score > record) {
            saveRecord(score);
            updateRecordDisplay();
        }

        if (gameSpeed > 80) {
            gameSpeed = Math.max(gameSpeed - 5, 80);
        }
    }

    function updateRecordDisplay() {
        const recordElement = document.getElementById('record');
        recordElement.textContent = `Recorde: ${getRecord()}`;
    }

    function restartGame() {
        gameSpeed = 150; // Reseta a velocidade do jogo para o valor inicial.
        snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
        fruit = { x: 300, y: 200 };
        dx = cellSize;
        dy = 0;
        score = 0;
        updateScore();
        document.getElementById('restartButton').style.display = 'none';
        main();
    }

    // Adiciona manipuladores de evento de clique para os botões virtuais
    document.getElementById('upButton').addEventListener('click', function() {
        changeDirection({ keyCode: 38 }); // Simula a tecla de seta para cima
    });
    document.getElementById('downButton').addEventListener('click', function() {
        changeDirection({ keyCode: 40 }); // Simula a tecla de seta para baixo
    });
    document.getElementById('leftButton').addEventListener('click', function() {
        changeDirection({ keyCode: 37 }); // Simula a tecla de seta para a esquerda
    });
    document.getElementById('rightButton').addEventListener('click', function() {
        changeDirection({ keyCode: 39 }); // Simula a tecla de seta para a direita
    });

    document.addEventListener('keydown', changeDirection);

    document.getElementById('restartButton').addEventListener('click', restartGame);

    document.addEventListener('keydown', function(event) {
        if ((event.key === ' ' || event.key === 'Enter') && document.getElementById('restartButton').style.display !== 'none') {
            restartGame();
        }
    });

    updateRecordDisplay(); // Atualiza a exibição do recorde ao carregar a página.

    main(); // Inicia o jogo.
});
