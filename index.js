let alive = true
let play = true
let timerInterval
const canvas = document.getElementById('board')


canvas.height = 700 /* document.body.clientHeight * 0.8 */
canvas.width = canvas.height;

/**
 * 
 * @param {*} context canvas context
 * @param {*} x x coordenate
 * @param {*} y y coordenate
 * @param {*} width rect width
 * @param {*} height rect height
 * @param {*} color rect fill color
 */
function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

function drawSnake(context, snakeBody, width, height, direction, maxWidth, maxHeight, destroyTail) {
    let head = snakeBody[0]
    let tail = snakeBody[snakeBody.length - 1]

    //If next snake move is going to pass the border
    switch (direction) {
        case 'left':
            if (head.x - width < 0) return false
            break;
        case 'right':
            if (head.x + width > maxWidth - 1) return false
            break;
        case 'up':
            if (head.y - height < 0) return false
            break;
        case 'down':
            if (head.y + height > maxHeight - 1) return false
            break;
    }

    //If next snake move is going to be on itself
    if (snakeBody.length > 1) {
        for (let i = 1; i < snakeBody.length; i++) {
            if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
                return false
            }
        }
    }

    //Remove last block from snake
    if (destroyTail) drawRect(context, tail.x, tail.y, width, height, '#fff')
    //Add other block with tail coordenates
    else snakeBody.push({ x: tail.x, y: tail.y })



    //Set snake blocks equal to its front block position
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i].x = snakeBody[i - 1].x
        snakeBody[i].y = snakeBody[i - 1].y
    }

    //Set next move coordenates to snake head
    switch (direction) {
        case 'left':
            snakeBody[0].x -= width
            break
        case 'right':
            snakeBody[0].x += width
            break
        case 'up':
            snakeBody[0].y -= height
            break
        case 'down':
            snakeBody[0].y += height
            break
    }

    //Paint snake head 
    drawRect(context, snakeBody[0].x, snakeBody[0].y, width, height, '#a12')

    return true
}

async function snakeGame(context, width, height, difficulty, scoreElement) {
    let score = 0
    let scoreFactor
    let blockWidth = width / 20
    let blockHeight = height / 20
    let direction = 'left'
    let pause = false
    let timeBetweenMoves
    let keyAlreadyPressed = false
    let fruit = { x: blockWidth * Math.floor(Math.random() * 20), y: blockHeight * Math.floor(Math.random() * 20) }
    let snakeBody = [{ x: width / 2, y: height / 2 }]

    //Set difficulty
    switch (difficulty) {
        case 'easy':
            timeBetweenMoves = 700
            scoreFactor = 1
            break
        case 'normal':
            timeBetweenMoves = 150
            scoreFactor = 1.5
            break
        case 'hard':
            timeBetweenMoves = 70
            scoreFactor = 2
            break
        case 'impossible':
            timeBetweenMoves = 40
            scoreFactor = 3
            break
    }

    //Keydown event
document.addEventListener('keydown', function (event) {
    if (!keyAlreadyPressed) {
        switch (event.keyCode) {
            //LEFT key
            case 37:
                direction = direction != 'right' ? 'left' : 'right'
                break
            //UP key
            case 38:
                direction = direction != 'down' ? 'up' : 'down'
                break
            //RIGHT key
            case 39:
                direction = direction != 'left' ? 'right' : 'left'
                break
            //DOWN key
            case 40:
                direction = direction != 'up' ? 'down' : 'up'
                break
            //P key
            case 80:
                pause = !pause
                break
            case 82:
                if (!alive || !play) {
                    let context = canvas.getContext('2d')
                    context.fillStyle = '#fff'
                    context.fillRect(0, 0, canvas.width, canvas.height)
                    alive = true
                    play = true
                    snakeGame(context, parseInt(canvas.width), parseInt(canvas.width), document.getElementById('difficulty').value, document.getElementById('score'))
                    document.getElementById('timer').textContent = '00:00:00'
                    timer(document.getElementById('timer'))
                }
                break
        }
        keyAlreadyPressed = true
    }
})

    drawRect(context, fruit.x, fruit.y, blockWidth, blockHeight, '#0c0')

    for (let i = 0; i < snakeBody.length; i++) {
        drawRect(context, snakeBody[i].x, snakeBody[i].y, blockWidth, blockHeight, '#a12')
    }

    scoreElement.textContent = `${score}`

    while (alive && play) {
        keyAlreadyPressed = false
        await sleep(timeBetweenMoves)

        //while (pause){}

        if (snakeBody[0].x === fruit.x && snakeBody[0].y === fruit.y) {
            score += scoreFactor * 50
            scoreElement.textContent = `${score}`

            alive = drawSnake(context, snakeBody, blockWidth, blockHeight, direction, width, height, false)

            let goodPosition = false
            let x, y
            while (!goodPosition) {
                x = blockWidth * parseInt(Math.random() * 20)
                y = blockHeight * parseInt(Math.random() * 20)

                for (let i = 0; i < snakeBody.length; i++) {
                    if (snakeBody[i].x === x && snakeBody[i].y === y)
                        break
                }

                goodPosition = true
            }

            fruit.x = x
            fruit.y = y
            drawRect(context, fruit.x, fruit.y, blockWidth, blockHeight, '#0c0')
        }
        else {
            alive = drawSnake(context, snakeBody, blockWidth, blockHeight, direction, width, height, true)
        }
    }

    clearInterval(timerInterval)
    document.getElementById('alive').style.backgroundColor = '#c00'
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function timer(element) {
    let hours = minutes = seconds = 0

    timerInterval = setInterval(() => {
        addSecond()
        element.textContent = `${numberToString(hours)}:${numberToString(minutes)}:${numberToString(seconds)}`
    }, 1000)

    function numberToString(number) {
        let str = `${number}`
        if (str.length === 1) return `0${str}`
        else return str
    }

    function addSecond() {
        if (seconds === 59) {
            seconds = 0
            addMinute()
        }
        else {
            seconds++
        }
    }

    function addMinute() {
        if (minutes === 59) {
            minutes = 0
            addHour()
        }
        else {
            minutes++
        }
    }

    function addHour() {
        if (hours === 23) {
            minutes = 0
        }
        else {
            hours++
        }
    }
}

document.getElementById('start_restart').addEventListener('click', (event) => {
    if (document.getElementById('start_restart').textContent === 'Start') {
        document.getElementById('start_restart').textContent = 'Restart'
        alive = true
        play = true
        snakeGame(canvas.getContext('2d'), parseInt(canvas.width), parseInt(canvas.width), document.getElementById('difficulty').value, document.getElementById('score'))
        timer(document.getElementById('timer'))
    }

    if (!alive || !play) {
        let context = canvas.getContext('2d')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        alive = true
        play = true
        snakeGame(context, parseInt(canvas.width), parseInt(canvas.width), document.getElementById('difficulty').value, document.getElementById('score'))
        document.getElementById('timer').textContent = '00:00:00'
        timer(document.getElementById('timer'))
    }
})

document.getElementById('stop').addEventListener('click', (event) => {
    play = false
})