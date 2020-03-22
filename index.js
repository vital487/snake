snakeGame(document.getElementById('board').getContext('2d'), 500, 500)

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

async function snakeGame(context, width, height) {
    let blockWidth = width / 20
    let blockHeight = height / 20
    let direction = 'left'
    let alive = true
    let fruit = { x: blockWidth * Math.floor(Math.random() * 20), y: blockHeight * Math.floor(Math.random() * 20) }
    let snakeBody = [{ x: width / 2, y: height / 2 }]

    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 37:
                direction = direction != 'right' ? 'left' : 'right'
                break
            case 38:
                direction = direction != 'down' ? 'up' : 'down'
                break
            case 39:
                direction = direction != 'left' ? 'right' : 'left'
                break
            case 40:
                direction = direction != 'up' ? 'down' : 'up'
                break
        }
    });

    drawRect(context, fruit.x, fruit.y, blockWidth, blockHeight, '#0c0')

    for (let i = 0; i < snakeBody.length; i++) {
        drawRect(context, snakeBody[i].x, snakeBody[i].y, blockWidth, blockHeight, '#a12')
    }

    while (alive) {
        await sleep(100)

        if (snakeBody[0].x === fruit.x && snakeBody[0].y === fruit.y) {
            alive = drawSnake(context, snakeBody, blockWidth, blockHeight, direction, width, height, false)

            let goodPosition = false

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

    document.getElementById('alive').style.backgroundColor = '#c00'
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}