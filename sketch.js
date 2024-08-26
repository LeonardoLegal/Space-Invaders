let balas = [];
let inimigos = [];
let pontos = 0;
let vidas = 10; // Nova melhoria: número de vidas
let maxBalas = 5; // Limita o número de balas simultâneas

let spritePersonagem;
let spriteInimigo;
let somBala;
let somInimigo;

function preload() {
  // Carregar imagens e sons
  spritePersonagem = loadImage('personagem.png');
  spriteInimigo = loadImage('inimigo.png');
  somBala = loadSound('bala.mp3');
  somInimigo = loadSound('explosao.mp3');
}

function setup() {
  createCanvas(600, 400);
  for(let n = 0; n < 10; n++){
    criaInimigo();
  }
}

function draw() {
  background(240);
  verificaAcerto();
  
  // Desenha o personagem com sprite
  image(spritePersonagem, mouseX - 30, height - 80, 60, 60);

  // Percorre o array de inimigos
  for(let i of inimigos){
    if(i.y > height - 50){
      vidas--; // Perde uma vida se o inimigo chega ao fundo
      if (vidas <= 0) {
        textAlign(CENTER);
        textSize(16);
        text("Você perdeu! Pontos: " + pontos, width / 2, height - 10);
        noLoop();
        return;
      }
      // Remove o inimigo que chegou ao fundo
      inimigos.splice(inimigos.indexOf(i), 1);
      criaInimigo();
    }
    
    i.y = i.y + 3;
    image(spriteInimigo, i.x, i.y, i.t, i.t);
  }

  // Percorre o array de balas
  for(let b of balas){
    if (b.y < 0){
      balas.splice(balas.indexOf(b), 1);
    }
   
    b.y = b.y - 5;
    fill(255, 0, 0);
    circle(b.x, b.y, b.t);
  }

  // Desenha as informações na tela
  textAlign(LEFT);
  textSize(16);
  fill(0);
  text("Pontos: " + pontos, 10, 20);
  text("Vidas: " + vidas, 10, 40);
}

function mousePressed() {
  if (balas.length < maxBalas) { // Verifica se o número máximo de balas não foi atingido
    let bala = {
      x: mouseX,
      y: height - 80,
      t: 8
    }
    balas.push(bala);
    somBala.play(); // Toca o som da bala
  }
}

function criaInimigo() {
  let inimigo = {
    x: random(0, width - 50),
    y: random(-800, 0),
    t: 30,
  }
  inimigos.push(inimigo);
}

function verificaAcerto() {
  for (let b of balas){
    for (let i of inimigos){
      let acertou = collideRectCircle(i.x, i.y, i.t, i.t, b.x, b.y, b.t);
      if (acertou){
        inimigos.splice(inimigos.indexOf(i), 1);
        balas.splice(balas.indexOf(b), 1);
        criaInimigo();
        pontos++;
        somInimigo.play(); // Toca o som da explosão do inimigo
        break; // Sai do loop para evitar múltiplos acertos
      }
    }
  }

  // Aumenta a dificuldade: cria um novo inimigo a cada 10 pontos
  if (pontos % 10 === 0 && pontos > 0 && inimigos.length < 20) {
    criaInimigo();
  }
}
