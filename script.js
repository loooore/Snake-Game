const canvas = document.querySelector("canvas")
const ctx /* contexto */ = canvas.getContext("2d")

const score = document.querySelector(".score_value")
const scoreMenu = document.querySelector(".score")
const finalScore = document.querySelector(".final_score > span")
const menu = document.querySelector(".menu_screen")
const btnPlay = document.querySelector(".btn_play")
const settings = document.querySelector(".settings > span")


const audio = new Audio("assets/audio.mp3")

// ctx.fillStyle = "red"
// ctx.fillRect(300, 300, 50, 50) retângulo preenchido - PosX, PoY, width, heigth

const size = 30

const inicialPosition = {x: 270, y: 240}

let snake = [inicialPosition]

const incrementScore =  () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = (min, max) => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

// Estilo da comida
const drawFood = () => {
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)    
    ctx.shadowBlur = 0
}

// Estilo da cobrinha
const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position, index) => { // percorrer todo o arrey 
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }
        ctx.fillRect(position.x, position.y, size, size)
    }) 
}

const moveSnake = () => {
    if (!direction) return

     // pegando o último elemento, msm coisa do [snake.length - 1]
    const head = snake.at(-1)
    
    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size})
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size})
    }

    // removendo o 1 elemento
    snake.shift()
}

// Colocando um grind no fundo, um quadriculado
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

// Checar a colisão
const checkCollision = () => {
    const head = snake.at(-1)
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2 // excluindo a cabeça

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    
    menu.style.display = 'flex'
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
    scoreMenu.style.display = 'none'
}

// Verificar se a comida foi comida
const checkEat = () => {
    const head = snake.at(-1)

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()
        audio.volume = 0.25;

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const gameLoop = () => {
    // Parar o loop pra n dar bug
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    checkEat()
    drawSnake()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100);
}

gameLoop()

// Criar um evento de teclado
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left" || key == 'd' && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right" || key == "a" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up" || key == "s" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down" || key == "w" && direction != "down") {
        direction = "up"
    } 
}) 

btnPlay.addEventListener("click", (evt) => {
    scoreMenu.style.display = 'block'
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = "none"

    snake = [inicialPosition]
    food.x = randomPosition()
    food.y = randomPosition()
    food.color = randomColor()
})
