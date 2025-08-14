import { API_URL } from "./config.js";

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
let produtosOriginais = [];

// Verifica autenticação
async function checkAdmin() {
  try {
    const res = await fetch(`${API_URL}/check-auth`, { credentials: 'include' });
    const data = await res.json();
    if (!data.authenticated) throw new Error('Não autorizado');
    return true;
  } catch {
    alert('Você precisa fazer login para acessar esta página.');
    window.location.href = 'login.html';
    return false;
  }
}

// Logout
async function logout() {
  try {
    const res = await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Erro no logout');
    alert('Logout realizado');
    window.location.href = 'login.html';
  } catch {
    alert('Erro ao realizar logout');
  }
}

// Carrega produtos
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/all_products`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
    produtosOriginais = await res.json();
    exibirProdutos(produtosOriginais);
  } catch (error) {
    alert(`Erro ao carregar produtos: ${error.message}`);
  }
}

// Exibe produtos na tabela
function exibirProdutos(produtos) {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  if (!produtos.length) {
    tbody.innerHTML = '<tr><td colspan="9">Nenhum produto encontrado.</td></tr>';
    return;
  }

  produtos.forEach(p => {
    const tr = document.createElement('tr');
    if (!p.is_active) tr.classList.add("inactive-row");
    tr.innerHTML = `
      <td data-label="Ativo"><input type="checkbox" class="product-active-checkbox" data-id="${p.id}" ${p.is_active ? 'checked' : ''} /></td>
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

  // Botão atualizar status
  const oldBtn = document.getElementById('updateActiveStatus');
  if (oldBtn) oldBtn.remove();

  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Atualizar Status de Produtos';
  updateBtn.classList.add('btn-primary');
  updateBtn.style.marginTop = '1rem';
  updateBtn.id = 'updateActiveStatus';
  updateBtn.addEventListener('click', async () => {
    const updates = Array.from(document.querySelectorAll('.product-active-checkbox'))
      .map(cb => ({ id: parseInt(cb.dataset.id), is_active: cb.checked }));
    try {
      const res = await fetch(`${API_URL}/products/update-active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ updates })
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      alert('Status de produtos atualizado com sucesso!');
    } catch (err) { alert(err.message); }
  });
  document.querySelector('#productsTable').after(updateBtn);
}

// Exportar Excel
document.getElementById('exportExcelBtn').addEventListener('click', () => {
  if (!produtosOriginais.length) return alert("Nenhum produto para exportar!");
  const dadosFormatados = produtosOriginais.map(p => ({
    'ID': p.id, 'Nome': p.name, 'Categoria': p.category,
    'Preço (R$)': p.price.toFixed(2), 'Tamanho': p.size || '',
    'Descrição': p.description || '', 'Cor': p.color || '', 'Está Ativo': p.is_active ? 'Sim' : 'Não'
  }));
  const ws = XLSX.utils.json_to_sheet(dadosFormatados);
  ws['!cols'] = [{wch:6},{wch:25},{wch:15},{wch:12},{wch:10},{wch:40},{wch:15},{wch:10}];
  ws['!autofilter'] = { ref: `A1:H${dadosFormatados.length+1}` };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produtos");
  const range = XLSX.utils.decode_range(ws['!ref']);
  for(let C=range.s.c; C<=range.e.c; ++C){
    const cell_address = XLSX.utils.encode_cell({c:C,r:0});
    if(!ws[cell_address]) continue;
    ws[cell_address].s = { fill:{fgColor:{rgb:"CCCCCC"}}, font:{bold:true,color:{rgb:"000000"}}, border:{top:{style:"thin",color:{rgb:"000000"}},bottom:{style:"thin",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"000000"}},right:{style:"thin",color:{rgb:"000000"}}}};
  }
  for(let R=1; R<=range.e.r; ++R){
    for(let C=range.s.c; C<=range.e.c; ++C){
      const cell_address = XLSX.utils.encode_cell({c:C,r:R});
      if(!ws[cell_address]) continue;
      ws[cell_address].s = { border:{top:{style:"thin",color:{rgb:"000000"}},bottom:{style:"thin",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"000000"}},right:{style:"thin",color:{rgb:"000000"}}} };
    }
  }
  XLSX.writeFile(wb,"produtos.xlsx");
});

// Busca
function aplicarBusca(produtos, termo) { return produtos.filter(p => p.name.toLowerCase().includes(termo.toLowerCase().trim())); }
function configurarPesquisa() {
  const barra = document.getElementById("barra-pesquisa");
  if(!barra) return;
  barra.addEventListener("input", ()=>{ exibirProdutos(aplicarBusca(produtosOriginais, barra.value)); });
}

function configurarPesquisaTagProducts() {
  const barra = document.getElementById('searchTagProducts');
  if(!barra) return;
  barra.addEventListener('input', () => {
    const termo = barra.value.toLowerCase().trim();
    const labels = productsCheckboxContainer.querySelectorAll('label');
    labels.forEach(label => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(termo) ? 'block' : 'none';
    });
  });
}

// Adicionar produto
document.getElementById('formAddProduct').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  if(!form.name.value.trim() || !form.category.value.trim() || !form.price.value || form.img.files.length===0) return alert('Preencha os campos obrigatórios corretamente e selecione uma imagem.');
  try{
    const res = await fetch(`${API_URL}/products`, {method:'POST', body:new FormData(form), credentials:'include'});
    if(!res.ok) throw new Error('Erro ao adicionar produto');
    alert('Produto adicionado!');
    form.reset();
    loadProducts();
  }catch(err){ alert(err.message); }
});

// Deletar produto
async function deleteProduct(id){
  if(!confirm("Tem certeza que deseja excluir este produto?")) return;
  try{
    const res = await fetch(`${API_URL}/products/${id}`, { method:'DELETE', credentials:'include' });
    if(!res.ok) throw new Error('Erro ao deletar produto');
    alert('Produto deletado com sucesso!');
    loadProducts();
  }catch(err){ alert(err.message); }
}

// Editar produto
const editModal = document.getElementById('editModal');
const formEdit = document.getElementById('formEditProduct');
document.getElementById('cancelEdit').onclick = () => { editModal.classList.remove('show'); editModal.setAttribute('aria-hidden','true'); }

async function editProduct(id){
  try{
    const res = await fetch(`${API_URL}/products/${id}`, { credentials:'include'});
    if(!res.ok) throw new Error('Produto não encontrado');
    const p = await res.json();
    formEdit.id.value = p.id;
    formEdit.name.value = p.name;
    formEdit.category.value = p.category;
    formEdit.price.value = p.price;
    formEdit.description.value = p.description || '';
    formEdit.size.value = p.size || '';
    formEdit.color.value = p.color || '';
    editModal.classList.add('show');
    editModal.setAttribute('aria-hidden','false');
  }catch(err){ alert(err.message); }
}

formEdit.onsubmit = async e=>{
  e.preventDefault();
  const id = formEdit.id.value;
  const fd = new FormData();
  fd.append('name', formEdit.name.value.trim());
  fd.append('category', formEdit.category.value.trim());
  fd.append('price', formEdit.price.value);
  fd.append('description', formEdit.description.value.trim());
  fd.append('size', formEdit.size.value.trim());
  fd.append('color', formEdit.color.value.trim());
  const fileInput = formEdit.querySelector('input[name="img"]');
  if(fileInput.files.length>0) fd.append('img', fileInput.files[0]);
  if(!formEdit.name.value.trim() || !formEdit.category.value.trim() || isNaN(parseFloat(formEdit.price.value))) return alert('Preencha os campos obrigatórios corretamente.');
  try{
    const res = await fetch(`${API_URL}/products/${id}`, { method:'PUT', body:fd, credentials:'include'});
    if(!res.ok) throw new Error('Erro ao atualizar produto');
    alert('Produto atualizado com sucesso!');
    editModal.classList.remove('show');
    editModal.setAttribute('aria-hidden','true');
    loadProducts();
  }catch(err){ alert(err.message); }
}

// Tags
const selectTag = document.getElementById('selectTag');
const productsCheckboxContainer = document.getElementById('productsCheckboxContainer');
const btnSaveTagProducts = document.getElementById('btnSaveTagProducts');

document.getElementById('formAddTag').addEventListener('submit', async e=>{
  e.preventDefault();
  const name = e.target.name.value.trim();
  if(!name) return alert('Digite o nome da tag');
  try{
    const res = await fetch(`${API_URL}/tags`, {method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body:JSON.stringify({name})});
    if(!res.ok) throw new Error('Erro ao criar tag');
    alert('Tag criada com sucesso!');
    e.target.reset();
    await loadTags();
  }catch(err){ alert(err.message); }
});

document.getElementById('btnDeleteTag').addEventListener('click', async ()=>{
  const tagId = selectTag.value;
  if(!tagId) return alert('Selecione uma tag para deletar!');
  if(!confirm('Tem certeza que deseja deletar esta tag?')) return;
  try{
    const res = await fetch(`${API_URL}/tags/${tagId}`, {method:'DELETE', credentials:'include'});
    if(!res.ok) { const data = await res.json(); throw new Error(data.message || 'Erro ao deletar tag'); }
    alert('Tag deletada com sucesso!');
    await loadTags();
    productsCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked=false);
  }catch(err){ alert(err.message); }
});

async function loadTags(){
  try{
    const res = await fetch(`${API_URL}/tags`, { credentials:'include' });
    const tags = await res.json();
    selectTag.innerHTML = '<option value="">-- Escolha uma tag --</option>';
    tags.forEach(t=>{ const o = document.createElement('option'); o.value=t.id; o.textContent=t.name; selectTag.appendChild(o); });
  }catch(err){ console.error('Erro ao carregar tags:', err); }
}

async function loadAllProductsForCheckboxes(){
  try{
    const res = await fetch(`${API_URL}/all_products`, { credentials:'include' });
    const products = await res.json();
    productsCheckboxContainer.innerHTML = '';
    products.forEach(p=>{
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '0.3rem';
      label.innerHTML = `<input type="checkbox" value="${p.id}" /> ${p.name} (${p.category})`;
      productsCheckboxContainer.appendChild(label);
    });
  }catch(err){ console.error('Erro ao carregar produtos:', err); }
}

selectTag.addEventListener('change', async ()=>{
  const tagId = selectTag.value;
  const checkboxes = productsCheckboxContainer.querySelectorAll('input[type="checkbox"]');
  if(!tagId){
    checkboxes.forEach(cb => cb.checked = false);
    return;
  }
  try{
    const res = await fetch(`${API_URL}/tags/${tagId}/products`, { credentials:'include' });
    const associated = await res.json();
    checkboxes.forEach(cb => cb.checked = associated.some(p => p.id === parseInt(cb.value)));
  }catch(err){ alert('Erro ao carregar produtos da tag: ' + err.message); }
});

btnSaveTagProducts.addEventListener('click', async ()=>{
  const tagId = selectTag.value;
  if(!tagId) return alert('Selecione uma tag!');

  const selectedProducts = Array.from(productsCheckboxContainer.querySelectorAll('input[type="checkbox"]:checked'))
                               .map(cb => parseInt(cb.value));

  try{
    const res = await fetch(`${API_URL}/tags/${tagId}/products`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      credentials:'include', 
      body: JSON.stringify({product_ids:selectedProducts})
    });
    if(!res.ok) throw new Error('Falha ao salvar associações');
    alert('Associações atualizadas com sucesso!');
  }catch(err){ alert(err.message); }
});

// Inicialização
window.onload = async () => {
  if (await checkAdmin()) {
    await loadProducts();
    configurarPesquisa();
    await loadTags();
    await loadAllProductsForCheckboxes();
    configurarPesquisaTagProducts();
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
};
