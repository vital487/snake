/**
 * Represents a snake game.
 * 
 * @argument {*} canvas canvas where everything is going to be paint
 * @argument {String} difficulty easy | normal | hard | impossible
 * @argument {Function} timeCallback callback to get game timer; needs String param for the timer time
 * @argument {Function} scoreCallback callback to get player score; needs Number param for score
 */
class Snake {
    constructor(canvas, timeCallback, scoreCallback) {
        //Game canvas
        this.CANVAS = canvas
        //Canvas 2D context
        this.CONTEXT = canvas.getContext('2d')
        //Canvas width
        this.width = this.CANVAS.width
        //Canvas height
        this.height = this.CANVAS.height
        //Time between each snake movement. Less time, more difficult
        this.timeBetweenMoves = null
        //Score
        this.score = 0
        //Factor that is multiplied by the score
        this.scoreFactor = null
        //Columns in the X axis
        this.COLUMNS = 20
        //Lines in the Y axis
        this.LINES = 20
        //Snake block width
        this.blockWidth = this.width / this.COLUMNS
        //Snake block height
        this.blockHeight = this.height / this.LINES
        //Snake direction
        this.direction = null
        //Game is or not in pause
        this.pause = false
        //Last used difficulty
        this.difficulty = null
        //Key as already been pressed in this loop
        this.keyAlreadyPressed = false
        //Snake is alive
        this.alive = true
        //Game should continue
        this.play = false
        //Score callback
        this.scoreCallback = scoreCallback
        //Game timer
        this.timer = new Timer((time) => timeCallback(time))
        //Fruit information
        this.fruit = null
        //Snake block data
        this.snakeBody = null

        this.setKeys()
    }

    setDefaultValues(difficulty) {  
        this.score = 0
        this.direction = 'left'
        this.fruit = new Block(this.blockWidth * Math.floor(Math.random() * this.COLUMNS), this.blockHeight * Math.floor(Math.random() * this.LINES), this.blockWidth, this.blockHeight, '#0c0')
        this.snakeBody = [new Block(this.width / 2, this.height / 2, this.blockWidth, this.blockHeight, '#a12')]

        this.setDifficulty(difficulty)
        this.clearCanvas()
    }

    clearCanvas() {
        this.CONTEXT.fillStyle = '#fff'
        this.CONTEXT.fillRect(0, 0, this.width, this.height)
    }

    async start(difficulty) {
        if (this.play && this.alive) return;

        //Set default values
        this.setDefaultValues(difficulty)

        //Paint fruit
        this.paintFruit()
        //Paint snake
        this.drawRect(this.snakeBody[0].x, this.snakeBody[0].y, this.snakeBody[0].width, this.snakeBody[0].height, '#a12')

        //Sets score on screen
        this.scoreCallback(`${this.score}`)

        //Start timer
        this.timer.start()

        this.alive = true
        this.play = true

        //Main loop
        while (this.alive && this.play) {
            this.keyAlreadyPressed = false
            await this.sleep(this.timeBetweenMoves)

            //while (pause){}

            if (this.snakeBody[0].x === this.fruit.x && this.snakeBody[0].y === this.fruit.y) {
                this.score += this.scoreFactor * 50
                //Sets score on screen
                this.scoreCallback(`${this.score}`)

                this.alive = this.drawSnake(this.CONTEXT, this.snakeBody, this.blockWidth, this.blockHeight, this.direction, this.width, this.height, false)

                let goodPosition = false
                let x, y
                while (!goodPosition) {
                    x = this.blockWidth * Math.floor(Math.random() * this.COLUMNS)
                    y = this.blockHeight * Math.floor(Math.random() * this.LINES)

                    for (let i = 0; i < this.snakeBody.length; i++) {
                        if (this.snakeBody[i].x === x && this.snakeBody[i].y === y)
                            break
                    }

                    goodPosition = true
                }

                //Sets new fruit x coordinate
                this.fruit.x = x
                //Sets new fruit y coordinate
                this.fruit.y = y
                //Paints new fruit position
                this.paintFruit()
            }
            else {
                this.alive = this.drawSnake(this.CONTEXT, this.snakeBody, this.blockWidth, this.blockHeight, this.direction, this.width, this.height, true)
            }
        }

        //Stop timer
        this.timer.stop()
    }

    stop() {
        this.play = false
    }

    /**
     * Verifies if next snake move is valid.
     * @returns {Boolean} true if move is valid or false if it is not
     */
    verifyNextMove() {
        let head = this.snakeBody[0]

        //If next snake move is going to pass the border
        switch (this.direction) {
            case 'left':
                if (head.x - this.blockWidth < 0) return false
                break;
            case 'right':
                if (head.x + this.blockWidth > this.width - 1) return false
                break;
            case 'up':
                if (head.y - this.blockHeight < 0) return false
                break;
            case 'down':
                if (head.y + this.blockHeight > this.height - 1) return false
                break;
        }

        //If next snake move is going to be on itself
        if (this.snakeBody.length > 1) {
            for (let i = 1; i < this.snakeBody.length; i++) {
                if (head.x === this.snakeBody[i].x && head.y === this.snakeBody[i].y) {
                    return false
                }
            }
        }

        return true
    }

    /**
     * Verifies 
     * @param {*} context 
     * @param {*} snakeBody 
     * @param {*} width 
     * @param {*} height 
     * @param {*} direction 
     * @param {*} maxWidth 
     * @param {*} maxHeight 
     * @param {*} destroyTail 
     */
    drawSnake(context, snakeBody, width, height, direction, maxWidth, maxHeight, destroyTail) {
        let tail = this.snakeBody[this.snakeBody.length - 1]

        //Verify if next move is valid
        if (!this.verifyNextMove()) return false

        //Remove last block from snake
        if (destroyTail) this.drawRect(tail.x, tail.y, tail.width, tail.height, '#fff')
        //Add other block with tail coordenates
        else {
            let block = new Block()
            block.set(tail)
            this.snakeBody.push(block)
        }

        //Set snake blocks equal to its front block position
        for (let i = this.snakeBody.length - 1; i > 0; i--) {
            this.snakeBody[i].set(this.snakeBody[i - 1])
        }

        //Set next move coordenates to snake head
        switch (this.direction) {
            case 'left':
                this.snakeBody[0].x -= this.blockWidth
                break
            case 'right':
                this.snakeBody[0].x += this.blockWidth
                break
            case 'up':
                this.snakeBody[0].y -= this.blockHeight
                break
            case 'down':
                this.snakeBody[0].y += this.blockHeight
                break
        }

        this.paintSnakeHead()

        return true
    }

    /**
     * Paint snake head (this.snakeBody[0]).
     */
    paintSnakeHead() {
        this.drawRect(this.snakeBody[0].x, this.snakeBody[0].y, this.snakeBody[0].width, this.snakeBody[0].height, '#a12')
    }

    /**
     * Paints fruit element on canvas.
     */
    paintFruit() {
        this.drawRect(this.fruit.x, this.fruit.y, this.fruit.width, this.fruit.height, '#0c0')
    }

    /**
     * 
     * @param {*} context canvas context
     * @param {Number} x x coordenate
     * @param {Number} y y coordenate
     * @param {Number} width rect width
     * @param {Number} height rect height
     * @param {String} color rect fill color
     */
    drawRect(x, y, width, height, color) {
        this.CONTEXT.fillStyle = color
        this.CONTEXT.fillRect(x, y, width, height)
    }

    /**
     * Set some keydown listeners for keyboard gameplay.
     */
    setKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.keyAlreadyPressed) {
                switch (event.keyCode) {
                    //LEFT key
                    case 37:
                        this.direction = this.direction != 'right' ? 'left' : 'right'
                        break
                    //UP key
                    case 38:
                        this.direction = this.direction != 'down' ? 'up' : 'down'
                        break
                    //RIGHT key
                    case 39:
                        this.direction = this.direction != 'left' ? 'right' : 'left'
                        break
                    //DOWN key
                    case 40:
                        this.direction = this.direction != 'up' ? 'down' : 'up'
                        break
                    //P key
                    case 80:
                        this.pause = !this.pause
                        break
                    //R key
                    case 82:
                        this.start(this.difficulty)
                        break
                }
                this.keyAlreadyPressed = true
            }
        })
    }

    /**
     * Sets game difficulty.
     * @param {String} difficulty easy | normal | hard | impossible
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty
        switch (difficulty) {
            case 'easy':
                this.timeBetweenMoves = 700
                this.scoreFactor = 1
                break
            case 'normal':
                this.timeBetweenMoves = 150
                this.scoreFactor = 1.5
                break
            case 'hard':
                this.timeBetweenMoves = 70
                this.scoreFactor = 2
                break
            case 'impossible':
                this.timeBetweenMoves = 40
                this.scoreFactor = 3
                break
        }
    }

    /**
     * Waits 'ms' for the next instruction. Must call this function with await.
     * @param {number} ms miliseconds that will be used to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}