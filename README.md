## Bootcamp-Gobaber

Projeto final vai entregar um sistema de agendamento para barbearia.

A entrega deve ser realizada para Desktop e App.

React, React Native, Node js.

Segue os comandos e pacotes utilizados durante o desenvolvimento, ambiente Docker a banco de dados Postgres

# ---------- Pacotes ------------------

# Express

> yarn add Express

# Nodemon

> yarn add nodemon -D

# Sucrase lidando com "import" e "export default"

> yarn add sucrase -D

# Bcryptjs (Hash de senha)

> yarn add bcryptjs

# JWT

> yarn add jsonwebtoken

# Sequelize

> yarn add sequelize

# Sequelize cli

> yarn add sequelize-cli -Docker

# pg pg-hstore

> yarn add pg pg-hstore

# Yup validação de Dados

> yarn add yup

# Trabalhando com arquivos Multer

> yarn add multer

# Trabalhando com data ( @next ultima versão )

> yarn add date-fns@next

# Mongoose manipulando Mongo DB

> yarn add mongoose

# --------- Comandos Projeto ------------

# Iniciando Projeto

> yarn init -y

# Rodando servidor

> yarn dev

# Eslint

> yarn add eslint -D

> yarn eslint --init (instalando padrão Airbnb)

# Prettier

> yarn add prettier eslint-config-prettier eslint-plugin-prettier -D

# --------- Instalando o Docker ----------------

# Atualize o aptíndice do pacote.

> sudo apt-get update

# Instale a versão mais recente do Docker Engine - Community and containserd:

> sudo apt-get install docker-ce docker-ce-cli containerd.io

# ---------------- Banco de Dados --------------------------

# Instalando o postgres no Docker

> (ubuntu usar sudo) docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11

# Todos os Containers

> docker ps -a

> docker ps (mostra o Container atual rodando)

# Verifica se tem erro no container

> docker logs NomeBanco

# Start no Container

> docker start Nome_Container ou ID

# Instalando o Mongo no Docker

> docker run --name mongobarber -p 27017:27017 -d -t mongo

# ------- Migrations (tabela) ---------

# CREATE

-> users

> yarn sequelize migration:create --name=create-users

-> Criando campo de avatar para tabela de usuário

> yarn sequelize migration:create --name=add-avatar-field-to-users

-> files

> yarn sequelize migration:create --name=create-files

-> Appointements (Agendamentos)

> yarn sequelize migration:create --name=create-appointments

# RODANDO A MIGRATION

> yarn sequelize db:migrate

# DESFAZENDO A MIGRATION

> yarn sequelize db:migrate:undo:all (todas)

> yarn sequelize db:migrate:undo (ultima)
