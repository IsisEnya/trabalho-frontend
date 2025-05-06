// Valores iniciais
let hunger = parseInt(localStorage.getItem('fome')) || 10;
let joy = parseInt(localStorage.getItem('alegria')) || 10;

// Atualiza as barras e emojis
function updateBars() {
  const fomeBarra = document.getElementById('fome-barra');
  const alegriaBarra = document.getElementById('alegria-barra');
  const emojiFome = document.getElementById('emoji-fome');
  const emojiAlegria = document.getElementById('emoji-alegria');

  if (fomeBarra) fomeBarra.value = hunger;
  if (alegriaBarra) alegriaBarra.value = joy;

  if (emojiFome) emojiFome.textContent = hunger <= 0 ? '💀' : '😊';
  if (emojiAlegria) emojiAlegria.textContent = joy <= 0 ? '😢' : '😊';

  localStorage.setItem('fome', hunger);
  localStorage.setItem('alegria', joy);
}

// Alimentar o mascote
function alimentar() {
  if (hunger < 20) hunger += 2;
  updateBars();
}

// Brincar com o mascote
function brincar() {
  if (joy < 20) joy += 2;
  updateBars();
}

// Carinho (clique no mascote)
function carinho() {
  joy += 1;
  updateBars();
}

// Salvar nome do mascote
function salvarNome(event) {
  event.preventDefault();
  const nomeInput = document.getElementById('nomeMascote');
  if (nomeInput) {
    localStorage.setItem('nomeMascote', nomeInput.value);
    window.location.href = 'mascote.html';
  }
}

// Descobrir localização
function descobrirLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada no seu navegador.");
    return;
  }

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

// Início — Executa conforme a página
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('form-nome');
  const nomeDisplay = document.getElementById('nomeMascoteDisplay');

  if (form) {
    // Página de nomeação
    form.addEventListener('submit', salvarNome);
  }

  if (nomeDisplay) {
    // Página do mascote
    const nome = localStorage.getItem('nomeMascote') || 'Sem nome definido';
    nomeDisplay.textContent = nome;

    document.getElementById('btn-alimentar')?.addEventListener('click', alimentar);
    document.getElementById('btn-brincar')?.addEventListener('click', brincar);
    document.getElementById('mascote')?.addEventListener('click', carinho);

    function updateBars() {
      const fomeBarra = document.getElementById('fome-barra');
      const alegriaBarra = document.getElementById('alegria-barra');
      const emojiFome = document.getElementById('emoji-fome');
      const emojiAlegria = document.getElementById('emoji-alegria');
      const alertaFome = document.getElementById('fome-alerta');
      const alertaAlegria = document.getElementById('alegria-alerta');
    
      if (fomeBarra) fomeBarra.value = hunger;
      if (alegriaBarra) alegriaBarra.value = joy;
    
      if (emojiFome) emojiFome.textContent = hunger <= 0 ? '💀' : '😊';
      if (emojiAlegria) emojiAlegria.textContent = joy <= 0 ? '😢' : '😊';
    
      if (alertaFome) alertaFome.style.display = hunger <= 0 ? 'block' : 'none';
      if (alertaAlegria) alertaAlegria.style.display = joy <= 0 ? 'block' : 'none';
    
      localStorage.setItem('fome', hunger);
      localStorage.setItem('alegria', joy);
    }
    
    descobrirLocalizacao();

    // Redução automática de fome e alegria
    setInterval(() => {
      if (hunger > 0) hunger -= 1;
      if (joy > 0) joy -= 1;
      updateBars();
    }, 2000);
  }
});
