import { API_URL } from "./config.js";

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
let produtosOriginais = [];

async function checkAdmin() {
  try {
    const res = await fetch(`${API_URL}/check-auth`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (!data.authenticated) throw new Error('Não autorizado');
    return true;
  } catch {
    alert('Você precisa fazer login para acessar essa página.');
    window.location.href = 'login.html';
    return false;
  }
}

async function logout() {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro no logout');

    alert('Logout realizado');
    window.location.href = 'login.html';
  } catch (error) {
    alert('Erro ao realizar logout');
  }
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/all_products`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

    const products = await res.json();
    produtosOriginais = products;

    exibirProdutos(produtosOriginais);
  } catch (error) {
    alert(`Erro ao carregar produtos: ${error.message}`);
  }
}

function exibirProdutos(produtos) {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';

  if (!produtos.length) {
    tbody.innerHTML = '<tr><td colspan="8">Nenhum produto encontrado.</td></tr>';
    return;
  }

  produtos.forEach(p => {
    const tr = document.createElement('tr');

    if (!p.is_active) {
      tr.classList.add("inactive-row");
    }

    tr.innerHTML = `
      <td data-label="Ativo">
        <input type="checkbox" class="product-active-checkbox" data-id="${p.id}" ${p.is_active ? 'checked' : ''} />
      </td>
      <td data-label="ID">${p.id}</td>
      <td data-label="Nome">${p.name}</td>
      <td data-label="Categoria">${p.category}</td>
      <td data-label="Preço">R$ ${p.price.toFixed(2)}</td>
      <td data-label="Descrição">${p.description || ''}</td>
      <td data-label="Tamanho">${p.size || ''}</td>
      <td data-label="Cor">${p.color || ''}</td>
      <td data-label="Ações">
        <button type="button" onclick="editProduct(${p.id})">Editar</button>
        <button type="button" onclick="deleteProduct(${p.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const oldBtn = document.getElementById('updateActiveStatus');
  if (oldBtn) oldBtn.remove();

  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Atualizar Status de Produtos';
  updateBtn.classList.add('btn-primary');
  updateBtn.style.marginTop = '1rem';
  updateBtn.id = 'updateActiveStatus';

  updateBtn.addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.product-active-checkbox');
    const updates = Array.from(checkboxes).map(cb => ({
      id: parseInt(cb.dataset.id),
      is_active: cb.checked
    }));

    try {
      const res = await fetch(`${API_URL}/products/update-active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ updates })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status');
      alert('Status de produtos atualizado com sucesso!');
    } catch (err) {
      alert(err.message);
    }
  });

  document.querySelector('#productsTable').after(updateBtn);
}

// Busca
function aplicarBusca(produtos, termo) {
  const termoNormalizado = termo.toLowerCase().trim();
  return produtos.filter(p => p.name.toLowerCase().includes(termoNormalizado));
}

function configurarPesquisa() {
  const barra = document.getElementById("barra-pesquisa");
  if (!barra) return;

  barra.addEventListener("input", () => {
    const termo = barra.value;
    const filtrados = aplicarBusca(produtosOriginais, termo);
    exibirProdutos(filtrados);
  });
}

// Adicionar produto
document.getElementById('formAddProduct').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  if (!form.name.value.trim() || !form.category.value.trim() || !form.price.value || form.img.files.length === 0) {
    alert('Preencha os campos obrigatórios corretamente e selecione uma imagem.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro ao adicionar produto');

    alert('Produto adicionado!');
    form.reset();
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
});

async function deleteProduct(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao deletar produto');
    alert('Produto deletado com sucesso!');
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
}

// Modal e edição
const editModal = document.getElementById('editModal');
const formEdit = document.getElementById('formEditProduct');
const cancelEditBtn = document.getElementById('cancelEdit');

async function editProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Produto não encontrado');
    const product = await res.json();

    formEdit.id.value = product.id;
    formEdit.name.value = product.name;
    formEdit.category.value = product.category;
    formEdit.price.value = product.price;
    formEdit.img.value = '';

    formEdit.description.value = product.description || '';
    formEdit.size.value = product.size || '';
    formEdit.color.value = product.color || '';

    editModal.classList.add('show');
    editModal.setAttribute('aria-hidden', 'false');
  } catch (error) {
    alert(error.message);
  }
}

cancelEditBtn.onclick = () => {
  editModal.classList.remove('show');
  editModal.setAttribute('aria-hidden', 'true');
};

formEdit.onsubmit = async (e) => {
  e.preventDefault();

  const id = formEdit.id.value;
  const formData = new FormData();

  formData.append('name', formEdit.name.value.trim());
  formData.append('category', formEdit.category.value.trim());
  formData.append('price', formEdit.price.value);
  formData.append('description', formEdit.description.value.trim());
  formData.append('size', formEdit.size.value.trim());
  formData.append('color', formEdit.color.value.trim());

  const fileInput = formEdit.querySelector('input[name="img"]');
  if (fileInput.files.length > 0) {
    formData.append('img', fileInput.files[0]);
  }

  if (!formEdit.name.value.trim() || !formEdit.category.value.trim() || isNaN(parseFloat(formEdit.price.value))) {
    alert('Preencha os campos obrigatórios corretamente.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro ao atualizar produto');

    alert('Produto atualizado com sucesso!');
    editModal.classList.remove('show');
    editModal.setAttribute('aria-hidden', 'true');
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
};

const selectTag = document.getElementById('selectTag');
const selectProducts = document.getElementById('selectProducts');
const btnSaveTagProducts = document.getElementById('btnSaveTagProducts');

document.getElementById('formAddTag').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  if (!name) return alert('Digite o nome da tag');

  try {
    const res = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Erro ao criar tag');
    alert('Tag criada com sucesso!');
    form.reset();
    await loadTags(); // Atualiza o select de tags
  } catch (err) {
    alert(err.message);
  }
});


const tagsList = document.getElementById('tagsList');

function exibirTagsNaLista(tags) {
  if (!tagsList) return;
  tagsList.innerHTML = '';

  if (!tags.length) {
    tagsList.innerHTML = '<li>Nenhuma tag cadastrada.</li>';
    return;
  }

  tags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag.name;
    tagsList.appendChild(li);
  });
}


async function loadTags() {
  try {
    const res = await fetch(`${API_URL}/tags`, { credentials: 'include' });
    const tags = await res.json();

    selectTag.innerHTML = '<option value="">-- Escolha uma tag --</option>';
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.id;
      option.textContent = tag.name;
      selectTag.appendChild(option);
    });

    exibirTagsNaLista(tags);

  } catch (err) {
    console.error('Erro ao carregar tags:', err);
  }
}

async function loadAllProductsForSelect() {
    try {
        const res = await fetch(`${API_URL}/all_products`, { credentials: 'include' });
        const products = await res.json();
        selectProducts.innerHTML = '';
        products.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} (${p.category})`;
            selectProducts.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

selectTag.addEventListener('change', async () => {
    const tagId = selectTag.value;
    if (!tagId) return;

    try {
        const res = await fetch(`${API_URL}/tags/${tagId}/products`, { credentials: 'include' });
        const associatedProducts = await res.json();
        // Desmarcar todos
        Array.from(selectProducts.options).forEach(opt => opt.selected = false);
        // Marcar produtos associados
        associatedProducts.forEach(p => {
            const opt = Array.from(selectProducts.options).find(o => parseInt(o.value) === p.id);
            if (opt) opt.selected = true;
        });
    } catch (err) {
        alert('Erro ao carregar produtos da tag: ' + err.message);
    }
});

btnSaveTagProducts.addEventListener('click', async () => {
    const tagId = selectTag.value;
    if (!tagId) { alert('Selecione uma tag!'); return; }

    const selectedProducts = Array.from(selectProducts.selectedOptions).map(o => parseInt(o.value));

    try {
        const res = await fetch(`${API_URL}/tags/${tagId}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ product_ids: selectedProducts })
        });
        if (!res.ok) throw new Error('Falha ao salvar associações');
        alert('Associações atualizadas com sucesso!');
    } catch (err) {
        alert(err.message);
    }
});

// Inicialização
window.onload = async () => {
    const loggedIn = await checkAdmin();
    if (loggedIn) {
        await loadProducts();
        configurarPesquisa();
        await loadTags();
        await loadAllProductsForSelect();
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await logout();
        });
    }
};