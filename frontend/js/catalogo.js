import { API_URL } from "./config.js";
let filtroAtual = "todos";
let produtosOriginais = [];

// --- Favoritos ---
function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function setFavoritos(lista) {
    localStorage.setItem("favoritos", JSON.stringify(lista));
}

function isFavorito(id) {
    return getFavoritos().includes(id);
}

function toggleFavorito(id) {
    let favoritos = getFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fav => fav !== id);
    } else {
        favoritos.push(id);
    }
    setFavoritos(favoritos);
}

// --- Buscar produtos ---
async function buscarProdutos() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();
        return produtos;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
}

function aplicarFiltro(produtos, tipo) {
    return tipo === "todos"
        ? produtos
        : produtos.filter((p) => p.category === tipo);
}

function aplicarBusca(produtos, termo) {
    const termoNormalizado = termo.toLowerCase().trim();
    return produtos.filter((p) =>
        p.name.toLowerCase().includes(termoNormalizado)
    );
}

function atualizarExibicao() {
    const barra = document.getElementById("barra-pesquisa");
    const termoBusca = barra.value;

    let filtrados = aplicarFiltro(produtosOriginais, filtroAtual);
    filtrados = aplicarBusca(filtrados, termoBusca);

    exibirProdutos(filtrados);
}

function configurarFiltros() {
    document.querySelectorAll(".botoes-filtros").forEach((btn) => {
        btn.addEventListener("click", () => {
            const tipo = btn.getAttribute("data-category");
            const jaAtivo = btn.classList.contains("ativo");

            document.querySelectorAll(".botoes-filtros").forEach((b) =>
                b.classList.remove("ativo")
            );

            if (jaAtivo) {
                filtroAtual = "todos";
            } else {
                filtroAtual = tipo;
                btn.classList.add("ativo");
            }

            atualizarExibicao();
        });
    });
}

function configurarPesquisa() {
    const barra = document.getElementById("barra-pesquisa");
    barra.addEventListener("input", atualizarExibicao);
}

function exibirProdutos(produtosFiltrados) {
    const container = document.getElementById("container-produtos");
    container.innerHTML = "";

    produtosFiltrados.forEach((produto) => {
        const item = document.createElement("div");
        item.classList.add("produto-itens");
        item.setAttribute("data-category", produto.category);
        item.setAttribute("data-id", produto.id);

        const coracao = isFavorito(produto.id.toString()) ? "♥" : "♡";

        item.innerHTML = `
            <img src="${produto.img}" alt="${produto.name}">
            <p class="produto-itens">${produto.name}</p>
            <div class="linha-preco-favorito">
                <p class="produto-price">R$${parseFloat(produto.price).toFixed(2)}</p>
                <span class="icone-favorito" data-id="${produto.id}">${coracao}</span>
            </div>
        `;

        item.querySelector(".icone-favorito").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorito(produto.id.toString());
            atualizarExibicao();
        });

        item.addEventListener("click", () => openProductModal(produto));
        container.appendChild(item);
    });
}

// --- Modal de Produto ---
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalSize = document.getElementById('modalSize');
const modalColor = document.getElementById('modalColor');

function openProductModal(produto) {
    modalImage.src = produto.img || '';
    modalImage.alt = produto.name;

    modalName.textContent = produto.name;
    modalPrice.textContent = `R$ ${parseFloat(produto.price).toFixed(2)}`;
    modalDescription.textContent = produto.description || '-';
    modalSize.textContent = produto.size || '-';
    modalColor.textContent = produto.color || '-';

    productModal.style.display = 'flex';
}

closeModalBtn.onclick = () => {
    productModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    } else if (event.target === overlayAjuda) {
        overlayAjuda.classList.remove("ativo");
        mostrarBotoesFlutuantes();
    } else if (event.target === overlayFavoritos) {
        overlayFavoritos.classList.remove("ativo");
        whatsappBtn.style.display = "none";
        mostrarBotoesFlutuantes();
    }
};

// --- Botões Flutuantes ---
function ocultarBotoesFlutuantes() {
    botaoAjuda.style.display = "none";
    botaoAbrir.style.display = "none";
    whatsappBtn.style.display = "none";
}

function mostrarBotoesFlutuantes() {
    botaoAjuda.style.display = "flex";
    botaoAbrir.style.display = "flex";
    if (getFavoritos().length > 0) {
        whatsappBtn.style.display = "flex";
    }
}

// --- Modal de Favoritos ---
const overlayFavoritos = document.getElementById("overlayFavoritos");
const listaFavoritos = document.getElementById("listaFavoritos");
const botaoAbrir = document.getElementById("abrirFavoritos");
const botaoLimpar = document.querySelector(".limpar-favoritos");
const whatsappBtn = document.getElementById("whatsapp-btn");

botaoAbrir.addEventListener("click", () => {
    const favoritos = getFavoritos();
    listaFavoritos.innerHTML = "";

    const produtosFavoritos = produtosOriginais.filter(p =>
        favoritos.includes(p.id.toString())
    );

    if (produtosFavoritos.length === 0) {
        listaFavoritos.innerHTML = `<p style="padding: 1rem;">Nenhum favorito encontrado.</p>`;
        whatsappBtn.style.display = "none";
    } else {
        whatsappBtn.style.display = "flex";
        let mensagem = "Olá! Tenho interesse nestes produtos:\n\n";
        produtosFavoritos.forEach((p, index) => {
            mensagem += `${index + 1}. ${p.name} - R$${parseFloat(p.price).toFixed(2)}\n`;
        });
        mensagem += "\nPoderia me ajudar?";
        const msg = encodeURIComponent(mensagem);
        const numero = "5581995343400";
        whatsappBtn.href = `https://wa.me/${numero}?text=${msg}`;
    }

    produtosFavoritos.forEach(produto => {
        const item = document.createElement("div");
        item.classList.add("produto-itens");

        item.innerHTML = `
            <img src="${produto.img}" alt="${produto.name}">
            <p class="produto-itens">${produto.name}</p>
            <div class="linha-preco-favorito">
                <p class="produto-price">R$${parseFloat(produto.price).toFixed(2)}</p>
                <span class="icone-favorito grande" data-id="${produto.id}">❤</span>
            </div>
        `;

        item.querySelector("img").addEventListener("click", () => openProductModal(produto));
        item.querySelector(".produto-itens").addEventListener("click", () => openProductModal(produto));

        item.querySelector(".icone-favorito.grande").addEventListener("click", (e) => {
            e.stopPropagation();
            const id = produto.id.toString();
            const novosFavoritos = getFavoritos().filter(fav => fav !== id);
            setFavoritos(novosFavoritos);
            atualizarExibicao();
            botaoAbrir.click();
        });

        listaFavoritos.appendChild(item);
    });

    overlayFavoritos.classList.add("ativo");
    ocultarBotoesFlutuantes();
});

botaoLimpar.addEventListener("click", () => {
    setFavoritos([]);
    overlayFavoritos.classList.remove("ativo");
    whatsappBtn.style.display = "none";
    atualizarExibicao();
    mostrarBotoesFlutuantes();
});

// --- Modal de Ajuda (FAQ) ---
const overlayAjuda = document.createElement("div");
overlayAjuda.id = "overlayAjuda";
overlayAjuda.className = "overlay-ajuda";
overlayAjuda.innerHTML = `
  <div class="modal-ajuda" onclick="event.stopPropagation()">
    <div class="conteudo-ajuda">
      <div class="header-ajuda">
        <h3 class="titulo-ajuda">Como podemos ajudar?</h3>
        <button class="fechar-ajuda" id="fecharAjuda">Fechar</button>
      </div>
      <hr class="divisor-modal" />
      <div class="faq-conteudo">
        <h4>Quem Somos?</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <h4>Entregas</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <h4>Dúvidas</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <h4>Onde Encontrar</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  </div>
`;
document.body.appendChild(overlayAjuda);

const botaoAjuda = document.createElement("button");
botaoAjuda.id = "botaoAjuda";
botaoAjuda.className = "botao-ajuda-flutuante";
botaoAjuda.innerHTML = `<img src="./img/geral/logo.png" alt="Ajuda" />`;

botaoAjuda.addEventListener("click", () => {
    overlayAjuda.classList.add("ativo");
    ocultarBotoesFlutuantes();
});

document.body.appendChild(botaoAjuda);

document.getElementById("fecharAjuda").addEventListener("click", () => {
    overlayAjuda.classList.remove("ativo");
    mostrarBotoesFlutuantes();
});

// --- Inicialização ao carregar a página ---
document.addEventListener("DOMContentLoaded", async () => {
    produtosOriginais = await buscarProdutos();
    atualizarExibicao();
    configurarFiltros();
    configurarPesquisa();
});