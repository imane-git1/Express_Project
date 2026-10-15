# Express Project

API Express.js de gestion d’authentification avec Prisma et MySQL.

Ce projet fournit un backend pour :
- inscription d’utilisateur
- connexion avec JWT
- confirmation d’email
- récupération et réinitialisation de mot de passe
- gestion du profil utilisateur
- accès administrateur pour certaines actions

## Stack technique

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS
- Dotenv

## Fonctionnalités

- Inscription utilisateur
- Validation des données d’entrée
- Connexion sécurisée avec token JWT
- Vérification d’email
- Gestion des rôles (`user`, `admin`)
- Profil utilisateur
- Mise à jour du profil
- Suppression d’un utilisateur par un admin
- Mot de passe oublié
- Réinitialisation du mot de passe
- Authentification sur les endpoints protégés
- Middleware de contrôle d’accès

## Structure du projet

```bash
.
├── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── config
│   └── prismaClient.js
├── controllers
│   └── authController.js
├── middlewares
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── prisma
│   └── schema.prisma
├── routes
│   └── authRoutes.js
├── services
│   └── auth_service.js
├── validators
│   └── authValidator.js
└── generated
    └── prisma
```

## Base de données

Le schéma Prisma utilise une table `User` avec les champs suivants :

- `id`
- `name`
- `email` (unique)
- `password`
- `role` (par défaut : `user`)
- `isActive` (par défaut : `true`)
- `email_verification_token`
- `email_verification_expires`
- `password_reset_token`
- `password_reset_expires`
- `created_at`
- `updated_at`

Le datasource est configuré pour MySQL :

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
DATABASE_URL="mysql://user:password@localhost:3306/express_project"
PORT=3000
AUTH_JWT_SECRET="votre_cle_secrete"
AUTH_JWT_TOKEN_EXPIRES_IN="1h"
```

Exemple :

```env
DATABASE_URL="mysql://root:password@localhost:3306/express_project"
PORT=3000
AUTH_JWT_SECRET="supersecretkey"
AUTH_JWT_TOKEN_EXPIRES_IN="1h"
```

## Installation

1. Cloner le projet
2. Installer les dépendances :

```bash
npm install
```

3. Générer le client Prisma :

```bash
npx prisma generate
```

4. Appliquer les migrations :

```bash
npx prisma migrate dev
```

5. Lancer le serveur :

```bash
node server.js
```

Le serveur démarre sur :

```bash
http://localhost:3000
```

## API

Les endpoints sont exposés sous le préfixe `/api/auth`.

### 1. Inscription

```http
POST /api/auth/register
```

Body :

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678",
  "role": "user"
}
```

### 2. Connexion

```http
POST /api/auth/login
```

Body :

```json
{
  "email": "john@example.com",
  "password": "12345678"
}
```

Retour :

```json
{
  "message": "Login successful",
  "token": "jwt_token"
}
```

### 3. Confirmation d’email

```http
GET /api/auth/confirm-email/:token
```

### 4. Liste des utilisateurs

```http
GET /api/auth/users
```

### 5. Détail d’un utilisateur

```http
GET /api/auth/user/:id
```

Accès protégé par middleware d’authentification et vérification admin.

### 6. Profil utilisateur

```http
GET /api/auth/profile
```

Accès protégé avec token JWT.

### 7. Mise à jour du profil

```http
PUT /api/auth/user_profile
```

Body :

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "newpassword123"
}
```

### 8. Suppression d’un utilisateur

```http
DELETE /api/auth/:id
```

Accès protégé et réservé aux admins.

### 9. Mot de passe oublié

```http
POST /api/auth/forgot-password
```

Body :

```json
{
  "email": "john@example.com"
}
```

### 10. Réinitialisation du mot de passe

```http
POST /api/auth/reset-password
```

Body :

```json
{
  "token": "token_generé",
  "newPassword": "nouveauMotDePasse123"
}
```

## Sécurité

- Hashage des mots de passe avec `bcryptjs`
- Validation des entrées avec `express-validator`
- Utilisation de JWT pour l’authentification
- Vérification du rôle admin pour certaines routes
- Middleware d’authentification sur les routes protégées

## Notes

Ce projet est une base backend robuste pour une application d’authentification avec Express et Prisma. Il peut servir de point de départ pour :
- un SaaS
- une application de gestion
- un système d’utilisateurs
- une API sécurisée avec comptes et rôles

## Licence

Projet personnel / non spécifiée dans le dépôt.

---

## Informations du dépôt GitHub fournies

URL d'édition fournie : https://github.com/imane-git1/Express_Project/edit/main/README.md

Repo: imane-git1/Express_Project
Repo ID: 942914578

Language composition: [{"name":"JavaScript","percent":100}]
