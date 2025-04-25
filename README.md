# Pet & Go 🐾 - Sistema de Agendamento para Petshop

## 🎥 Demonstração do Projeto
[![Testes funcionais!](https://img.shields.io/badge/Clique%20para%20ver%20o%20projeto%20funcionando-red?style=for-the-badge&logo=youtube)](https://youtu.be/Oux3_-9Q22A)

👉 Este vídeo está hospedado no **YouTube**

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1NEUP5C42DDEsYXL6wlEx76Qn2RE3Vh6Y" alt="Pet & Go Home" width="1050">
   <img src="https://drive.google.com/uc?export=view&id=13E8nA-hN8ZsFE6S_KNTSCus6NhV4NCVU" alt="Pet & Go Home" width="1050">
    <img src="https://drive.google.com/uc?export=view&id=1wXxcMJogs-3O8ShG-a2v4zhb0xUJvLht" alt="Pet & Go Home" width="1050">
     <img src="https://drive.google.com/uc?export=view&id=1ntk__M1RpeYiJCESgCCISOSA_yac8oZs" alt="Pet & Go Home" width="1050">
      <img src="https://drive.google.com/uc?export=view&id=1DhzzII-lWEPP3zCS4K_2YlXmF8p4SraC" alt="Pet & Go Home" width="1050">

</p>

**Pet & Go** é uma plataforma desenvolvida para facilitar o agendamento de serviços em petshops, oferecendo uma experiência fluida tanto para os donos de pets quanto para os funcionários do estabelecimento.

Com uma interface simples e intuitiva, o sistema permite:
- Agendamentos rápidos,
- Upload de fotos dos pets,
- Visualização e gerenciamento dos agendamentos.

O sistema garante segurança e praticidade para cuidar dos pets com muito amor e organização! ❤️🐶

---

## ✨ Funcionalidades

### 🐾 Usuários
- ✅ Cadastro e login com autenticação JWT
- 📆 Agendamento de serviços como banho, tosa, etc.
- 🖼️ Upload de imagem do pet
- ✏️ Edição e cancelamento de agendamentos
- 📜 Histórico de serviços

### 🧑‍💼 Administrador
- 👁️ Visualização completa dos agendamentos
- 🔁 Atualização de status de agendamento
- 📊 Organização das agendas

---

## 🧪 Tecnologias Utilizadas

### 🖥️ Frontend
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### 🧠 Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### 🔐 Segurança
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![bcrypt](https://img.shields.io/badge/bcrypt-004488?style=for-the-badge&logoColor=white)

---

## 📋 Pré-requisitos

- Node.js (v16+)
- MySQL (v8+)
- NPM ou Yarn

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/joaovictorfaria/pet-n-go.git

# Acesse o diretório do projeto
cd pet-n-go

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite com suas credenciais:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=petshop
PORT=3000
JWT_SECRET=sua_chave_secreta

# Crie o banco de dados MySQL com as tabelas adequadas

# Inicie o servidor
npm start
