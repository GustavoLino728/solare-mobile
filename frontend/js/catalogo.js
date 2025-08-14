import { API_URL } from "./config.js";
let filtroAtual = "todos";
let produtosOriginais = [];

// --- Favoritos (Carrinho) ---
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
        removeQuantidade(id);
    } else {
        favoritos.push(id);
        if (!getQuantidades()[id]) setQuantidade(id, 1); // inicia com 1
    }
    setFavoritos(favoritos);
}

// --- Quantidades ---
function getQuantidades() {
    return JSON.parse(localStorage.getItem("quantidades")) || {};
}
function setQuantidades(obj) {
    localStorage.setItem("quantidades", JSON.stringify(obj));
}
function setQuantidade(id, qtd) {
    const quantidades = getQuantidades();
    quantidades[id] = qtd;
    setQuantidades(quantidades);
}
function removeQuantidade(id) {
    const quantidades = getQuantidades();
    delete quantidades[id];
    setQuantidades(quantidades);
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

            filtroAtual = jaAtivo ? "todos" : tipo;
            if (!jaAtivo) btn.classList.add("ativo");

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

        item.innerHTML = `
            <img src="${produto.img}" alt="${produto.name}">
            <p class="produto-itens">${produto.name}</p>
            <div class="linha-preco-favorito">
                <p class="produto-price">R$${parseFloat(produto.price).toFixed(2)}</p>
                <button class="icone-favorito ${isFavorito(produto.id.toString()) ? 'favorito-ativo' : ''}" data-id="${produto.id}">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
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
    document.body.classList.add('modal-open');
}

closeModalBtn.onclick = () => {
    productModal.style.display = 'none';
    document.body.classList.remove('modal-open');
};

window.onclick = (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    } else if (event.target === overlayAjuda) {
        overlayAjuda.classList.remove("ativo");
        document.body.classList.remove('modal-open');
        mostrarBotoesFixos();
    } else if (event.target === overlayFavoritos) {
        overlayFavoritos.classList.remove("ativo");
        document.body.classList.remove('modal-open');
        mostrarBotoesFixos();
    }
};

// --- Botões fixos ---
function mostrarBotoesFixos() {
    document.querySelector(".barra-botoes-fixos").style.display = "flex";
}

function ocultarBotoesFixos() {
    document.querySelector(".barra-botoes-fixos").style.display = "none";
}

// --- Modal de Favoritos (Carrinho) ---
const overlayFavoritos = document.getElementById("overlayFavoritos");
const listaFavoritos = document.getElementById("listaFavoritos");
const botaoAbrir = document.getElementById("abrirFavoritos");
const botaoLimpar = document.querySelector(".limpar-favoritos");
const whatsappBtn = document.getElementById("whatsapp-btn");

botaoAbrir.addEventListener("click", () => {
    const favoritos = getFavoritos();
    const quantidades = getQuantidades();
    listaFavoritos.innerHTML = "";

    const produtosFavoritos = produtosOriginais.filter(p =>
        favoritos.includes(p.id.toString())
    );

    produtosFavoritos.forEach(produto => {
        const id = produto.id.toString();
        const qtd = quantidades[id] || 1;

        const item = document.createElement("div");
        item.classList.add("produto-itens");


        item.innerHTML = `
            <img src="${produto.img}" alt="${produto.name}">
            <div class="linha-nome-favorito">
                <p class="produto-itens">${produto.name}</p>
                <span class="icone-favorito grande favorito-ativo" data-id="${produto.id}">
                    <i class="fa-solid fa-cart-shopping"></i>
                </span>
            </div>
            <div class="produto-preco">
                <p class="produto-price">R$${parseFloat(produto.price).toFixed(2)}</p>
            </div>
            <div class="quantidade-container">
                <p>Qntd: </p>
                <button class="menos">-</button>
                <span class="quantidade">${qtd}</span>
                <button class="mais">+</button>
            </div>
        `;


        // Abrir modal produto
        item.querySelector("img").addEventListener("click", () => openProductModal(produto));
        item.querySelector(".produto-itens").addEventListener("click", () => openProductModal(produto));

        // Remover do carrinho
        item.querySelector(".icone-favorito.grande").addEventListener("click", (e) => {
            e.stopPropagation();
            const novosFavoritos = getFavoritos().filter(fav => fav !== id);
            setFavoritos(novosFavoritos);
            removeQuantidade(id);
            atualizarExibicao();
            botaoAbrir.click();
        });

        // Controle de quantidade
        item.querySelector(".menos").addEventListener("click", () => {
            let novaQtd = Math.max(1, (getQuantidades()[id] || 1) - 1);
            setQuantidade(id, novaQtd);
            botaoAbrir.click();
        });
        item.querySelector(".mais").addEventListener("click", () => {
            let novaQtd = (getQuantidades()[id] || 1) + 1;
            setQuantidade(id, novaQtd);
            botaoAbrir.click();
        });

        listaFavoritos.appendChild(item);
    });

    overlayFavoritos.classList.add("ativo");
    document.body.classList.add('modal-open');
    ocultarBotoesFixos();
});

// Limpar carrinho
botaoLimpar.addEventListener("click", () => {
    setFavoritos([]);
    setQuantidades({});
    overlayFavoritos.classList.remove("ativo");
    document.body.classList.remove('modal-open');
    atualizarExibicao();
    mostrarBotoesFixos();
});

document.getElementById("closeFavoritos").addEventListener("click", () => {
    overlayFavoritos.classList.remove("ativo");
    document.body.classList.remove('modal-open');
    mostrarBotoesFixos();
});

// --- Botão WhatsApp ---
whatsappBtn.onclick = () => {
    const favoritosAtualizados = getFavoritos();
    const quantidades = getQuantidades();

    const produtosFavoritosAtualizados = produtosOriginais.filter(p =>
        favoritosAtualizados.includes(p.id.toString())
    );

    let total = 0;
    const mensagemProdutos = produtosFavoritosAtualizados.map((p) => {
        const qtd = quantidades[p.id.toString()] || 1;
        const subtotal = qtd * parseFloat(p.price);
        total += subtotal;
        return `${qtd}x - ${p.name} - ID ${p.id} - R$${parseFloat(p.price).toFixed(2)}.`;
    }).join("\n");

    const mensagem = encodeURIComponent(
        `Olá! Tenho interesse nestes produtos: ${mensagemProdutos} \n Total: R$ ${total.toFixed(2)}. Poderia me ajudar?`
    );

    const numero = "5581995343400";
    const link = `https://wa.me/${numero}?text=${mensagem}`;
    window.open(link, '_blank');
};

// --- Modal de Ajuda ---
const overlayAjuda = document.getElementById("overlayAjuda");
const botaoAjuda = document.getElementById("botaoAjuda");

botaoAjuda.addEventListener("click", () => {
    overlayAjuda.classList.add("ativo");
    document.body.classList.add('modal-open');
    ocultarBotoesFixos();
});
document.getElementById("closeAjuda").addEventListener("click", () => {
    overlayAjuda.classList.remove("ativo");
    document.body.classList.remove('modal-open');
    mostrarBotoesFixos();
});

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", async () => {
    produtosOriginais = await buscarProdutos();
    atualizarExibicao();
    configurarFiltros();
    configurarPesquisa();
    mostrarBotoesFixos();
});