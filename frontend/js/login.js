import { API_URL } from "./config.js";

// Captura o evento de envio do formulário
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita o recarregamento da página

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await login(email, senha);
  });
});

// Função para fazer login
async function login(email, senha) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, senha })
    });

    if (!res.ok) {
      const err = await res.json();
      document.getElementById('error-message').innerText = err.message || 'Erro no login';
      return false;
    }

    // Login bem-sucedido
    window.location.href = 'admin.html';
    return true;
  } catch (error) {
    document.getElementById('error-message').innerText = 'Erro na comunicação com o servidor';
    return false;
  }
}
