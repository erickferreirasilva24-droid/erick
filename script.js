const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

const tamanho = 20;
const quantidade = canvas.width / tamanho;

let cobra;
let comida;
let direcao;
let proximaDirecao;
let pontuacao;
let jogoRodando;
let intervalo;

// Inicia o jogo
function iniciarJogo() {
    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    comida = criarComida();

    direcao = { x: 1, y: 0 };
    proximaDirecao = { x: 1, y: 0 };

    pontuacao = 0;
    jogoRodando = true;

    scoreElement.textContent = pontuacao;
    message.textContent = "Use as setas do teclado para jogar!";

    clearInterval(intervalo);
    intervalo = setInterval(atualizar, 100);

    desenhar();
}

// Cria a comida em uma posição aleatória
function criarComida() {
    let novaComida;

    do {
        novaComida = {
            x: Math.floor(Math.random() * quantidade),
            y: Math.floor(Math.random() * quantidade)
        };
    } while (
        cobra &&
        cobra.some(parte =>
            parte.x === novaComida.x &&
            parte.y === novaComida.y
        )
    );

    return novaComida;
}

// Atualiza o jogo
function atualizar() {
    if (!jogoRodando) return;

    direcao = proximaDirecao;

    const cabeca = {
        x: cobra[0].x + direcao.x,
        y: cobra[0].y + direcao.y
    };

    // Colisão com as paredes
    if (
        cabeca.x < 0 ||
        cabeca.x >= quantidade ||
        cabeca.y < 0 ||
        cabeca.y >= quantidade
    ) {
        gameOver();
        return;
    }

    // Colisão com o próprio corpo
    if (
        cobra.some(parte =>
            parte.x === cabeca.x &&
            parte.y === cabeca.y
        )
    ) {
        gameOver();
        return;
    }

    cobra.unshift(cabeca);

    // Comeu a comida
    if (
        cabeca.x === comida.x &&
        cabeca.y === comida.y
    ) {
        pontuacao++;
        scoreElement.textContent = pontuacao;
        comida = criarComida();
    } else {
        cobra.pop();
    }

    desenhar();
}

// Desenha tudo na tela
function desenhar() {
    // Fundo
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grade
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;

    for (let i = 0; i <= canvas.width; i += tamanho) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Comida
    ctx.fillStyle = "#ff3333";
    ctx.beginPath();

    ctx.arc(
        comida.x * tamanho + tamanho / 2,
        comida.y * tamanho + tamanho / 2,
        tamanho / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Cobra
    cobra.forEach((parte, index) => {
        ctx.fillStyle = index === 0 ? "#7cff4f" : "#39ff14";

        ctx.fillRect(
            parte.x * tamanho + 1,
            parte.y * tamanho + 1,
            tamanho - 2,
            tamanho - 2
        );
    });
}

// Game Over
function gameOver() {
    jogoRodando = false;
    clearInterval(intervalo);

    message.textContent =
        `💀 Game Over! Pontuação: ${pontuacao}`;

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff3333";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );
}

// Controles
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direcao.y !== 1) {
                proximaDirecao = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (direcao.y !== -1) {
                proximaDirecao = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
            if (direcao.x !== 1) {
                proximaDirecao = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
            if (direcao.x !== -1) {
                proximaDirecao = { x: 1, y: 0 };
            }
            break;
    }
});

// Botão de reiniciar
restartButton.addEventListener("click", iniciarJogo);

// Começa automaticamente
iniciarJogo();