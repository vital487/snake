let alive = true
let play = true
let timerInterval
const canvas = document.getElementById('board')
document.getElementById('difficulty').value = 'hard'

canvas.height = 700
canvas.width = canvas.height

function setTime(time) {
    document.getElementById('timer').textContent = time
}

function setScore(score) {
    document.getElementById('score').textContent = score
}

let game = new Snake(canvas, setTime, setScore)
game.start(document.getElementById('difficulty').value)

document.getElementById('start_restart').addEventListener('click', (event) => {
    game.start(document.getElementById('difficulty').value)
})

document.getElementById('stop').addEventListener('click', (event) => {
    game.stop()
})




