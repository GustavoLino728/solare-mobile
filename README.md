# Solare Mobile - Catálogo de Acessórios de Aço Inox

**Solare Mobile** é um projeto desenvolvido com o objetivo de oferecer autonomia para uma loja de acessórios de aço inox, permitindo que ela mantenha e atualize seu catálogo de forma independente, com uma experiência otimizada tanto para o cliente quanto para o administrador.

---

## 💡 Objetivo

O projeto visa empoderar o lojista, proporcionando um ambiente digital simples e intuitivo para exposição e gerenciamento de produtos, sem a necessidade de suporte técnico contínuo. Ao mesmo tempo, oferece ao cliente uma experiência fluida, com recursos úteis para pesquisa, seleção e interesse direto via WhatsApp.

---

## ⚙️ Funcionalidades do Catálogo

- 🔍 **Filtro por categoria** (ex: anéis, brincos, colares)
- 🧠 **Barra de busca inteligente**
- ⭐ **Sistema de favoritos** com persistência via `localStorage`
- 🛍️ **Modal de detalhes dos produtos** com imagens e descrições
- 💬 **Carrinho automático para WhatsApp**  
  (envio automático para o número da loja com os produtos favoritados)
- ❓ **Modal de ajuda** com explicações sobre o funcionamento e a identidade da marca

---

## 🔐 Funcionalidades da Área Administrativa

- ✅ **CRUD completo de produtos** (criação, leitura, atualização e exclusão)
- 👁️ **Controle de visibilidade dos produtos**  
  (ideal para produtos temporariamente fora de estoque)
- 💾 Integração com **Supabase** para persistência e escalabilidade dos dados
- 🔒 **Acesso restrito** via autenticação para a interface administrativa

---

## 🧱 Tecnologias Utilizadas

- **Frontend**:  
  - HTML5  
  - CSS3  
  - JavaScript (puro)

- **Backend**:  
  - Python com **Flask**

- **Banco de dados e autenticação**:  
  - **Supabase** (PostgreSQL + autenticação)

- **Deploy**:  
  - **Vercel** (frontend)  
  - **Render** (backend com Flask)

---

## 🚀 Evolução e Aprendizado

Durante o desenvolvimento do projeto, foram enfrentadas diversas dificuldades técnicas, especialmente relacionadas à manipulação dinâmica de DOM, integração com APIs externas e controle de estado de UI com JavaScript puro.

Ao longo do processo, foi possível:

- Consolidar o entendimento da arquitetura client-server com Flask e Supabase
- Melhorar a organização do código e separação de responsabilidades
- Compreender e aplicar princípios de UX voltados para e-commerce
- Explorar soluções para deploy e integração contínua com ferramentas modernas como Vercel e Railway
- Aprimorar habilidades em autenticação e segurança básica para a área administrativa

O projeto evoluiu significativamente a partir de versões mais simples que utilizavam apenas JSON estático, até alcançar uma estrutura dinâmica e escalável, integrando banco de dados real, autenticação e gerenciamento remoto via interface protegida.

---

## 🌐 Projeto Online

A versão atual do catálogo pode ser acessada em:  
🔗 [https://solare-catalogo.vercel.app](https://solare-catalogo.vercel.app)

---

