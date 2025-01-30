import Produto from './produtos.js';

console.log("Imported products:", Produto); // Debugging

function exibirProdutos(produtosFiltrados) {
    const container_produtos = document.getElementById("container-produtos");
    container_produtos.innerHTML = "";

    produtosFiltrados.forEach((produto) => {
        const produto_itens = `
          <div class="produto-itens" data-category="${produto.tipo}">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3 class="produto-itens">${produto.nome}</h3>
            <p>R$${produto.preco}</p>
          </div>
        `;
        container_produtos.innerHTML += produto_itens;
    });
}

function filtrarProdutos(tipo) {
    console.log("Filtering products by type:", tipo); // Debugging
    const produtosFiltrados =
        tipo === "todos"
            ? Produto
            : Produto.filter((produto) => produto.tipo === tipo);
    console.log("Filtered products:", produtosFiltrados); // Debugging
    exibirProdutos(produtosFiltrados);
}

document.querySelectorAll(".botoes-filtros").forEach((button) => {
    button.addEventListener("click", () => {
        const tipo = button.getAttribute("data-category");
        if (button.classList.contains("ativo")) {
            // Remove a classe "ativo" e exibe todos os produtos
            button.classList.remove("ativo");
            filtrarProdutos("todos");
        } else {
            // Remove a classe "ativo" de todos os botões
            document.querySelectorAll(".botoes-filtros").forEach((btn) => {
                btn.classList.remove("ativo");
            });

            // Adiciona a classe "ativo" ao botão clicado e filtra os produtos
            button.classList.add("ativo");
            filtrarProdutos(tipo);
        }
    })  ;
});

window.onload = () => {
    console.log("Page loaded, filtering products..."); // Debugging
    filtrarProdutos("todos");
    console.log(Produto);
};