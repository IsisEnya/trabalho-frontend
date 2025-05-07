let hunger = parseInt(localStorage.getItem('fome')) || 10;
let joy = parseInt(localStorage.getItem('alegria')) || 10;

let fomeFalou = false;
let alegriaFalou = false;
let morto = false;

function alimentar() {
  if (morto) return;
  if (hunger < 20) hunger += 2;
  mostrarImagemTemporaria('img/sendo alimentado.png');
  updateBars();
  verificarMorte();
}

function carinho() {
  if (morto) return;
  if (joy < 20) joy += 1;
  mostrarImagemTemporaria('img/falando.png');
  falar("Não fez mais do que o básico.");
  updateBars();
  verificarMorte();
}

function mostrarImagemTemporaria(src) {
  const imagem = document.getElementById('imagemMascote');
  imagem.src = src;
  setTimeout(() => atualizarImagemEstado(), 1000);
}

function updateBars() {
  const fomeBarra = document.getElementById('fome-barra');
  const alegriaBarra = document.getElementById('alegria-barra');
  const emojiFome = document.getElementById('emoji-fome');
  const emojiAlegria = document.getElementById('emoji-alegria');

  fomeBarra.value = hunger;
  alegriaBarra.value = joy;

  emojiFome.textContent = hunger <= 0 ? '💀' : '😊';
  emojiAlegria.textContent = joy <= 0 ? '😢' : '😊';

  if (hunger <= 0 && !fomeFalou) {
    falar("Me alimente, humano desprezível!");
    fomeFalou = true;
  } else if (hunger > 0) {
    fomeFalou = false;
  }

  if (joy <= 0 && !alegriaFalou) {
    falar("Paz não é uma opção.");
    alegriaFalou = true;
  } else if (joy > 0) {
    alegriaFalou = false;
  }

  localStorage.setItem('fome', hunger);
  localStorage.setItem('alegria', joy);
}

function atualizarImagemEstado() {
  const imagem = document.getElementById('imagemMascote');
  if (hunger <= 0 && joy <= 0) {
    imagem.src = 'img/com fome e sem alegria.png';
  } else if (hunger <= 0) {
    imagem.src = 'img/triste sem fome.png';
  } else if (joy <= 0) {
    imagem.src = 'img/fome mas feliz.png';
  } else {
    imagem.src = 'img/feliz.png';
  }
}

function verificarMorte() {
  if (hunger <= 0 && joy <= 0 && !morto) {
    morto = true;
    const imagem = document.getElementById('imagemMascote');
    imagem.src = 'img/com fome e sem alegria.png';
    falar("... Adeus, mundo cruel.");

    document.getElementById('btn-alimentar')?.remove();
    imagem.onclick = null;

    const container = document.querySelector('.container');
    const retryButton = document.createElement('button');
    retryButton.textContent = "💀 Tentar de novo";
    retryButton.onclick = () => {
      localStorage.clear();
      window.location.href = 'home.html';
    };
    container.appendChild(retryButton);
  }
}

function falar(texto) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  speechSynthesis.speak(utterance);
}

function salvarNome(event) {
  event.preventDefault();
  const nomeInput = document.getElementById('nomeMascote');
  if (nomeInput && nomeInput.value.trim().length > 0) {
    localStorage.setItem('nomeMascote', nomeInput.value.trim());
    window.location.href = 'mascote.html';
  } else {
    alert("Digite um nome válido!");
  }
}

function descobrirLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada no seu navegador.");
    return;
  }

  alert("🔍 Tentando descobrir onde você está...");

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          const cidade = data.address?.city || data.address?.town || data.address?.village || "sua cidade";
          alert(`🐶 Oi! Parece que você está em ${cidade}.`);
        })
        .catch(() => {
          alert("🐶 Não consegui descobrir onde você está, mas estou feliz de te ver!");
        });
    },
    () => {
      alert("🐶 Não consegui acessar sua localização.");
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('form-nome');
  const nomeDisplay = document.getElementById('nomeMascoteDisplay');

  if (form) {
    form.addEventListener('submit', salvarNome);
  }

  if (nomeDisplay) {
    const nome = localStorage.getItem('nomeMascote') || 'Sem nome definido';
    nomeDisplay.textContent = nome;
    document.getElementById('nomeTitulo').textContent = `Nome do Mascote: ${nome}`;

    document.getElementById('btn-alimentar')?.addEventListener('click', alimentar);
    document.getElementById('imagemMascote')?.addEventListener('click', carinho);

    descobrirLocalizacao();
    updateBars();
    atualizarImagemEstado();
    verificarMorte();

    setInterval(() => {
      if (!morto) {
        if (hunger > 0) hunger--;
        if (joy > 0) joy--;
        updateBars();
        atualizarImagemEstado();
        verificarMorte();
      }
    }, 2000);
  }
});