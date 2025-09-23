# 💳 BankApp

BankApp est une application bancaire **full-stack** permettant aux utilisateurs de gérer leurs comptes, transactions et catégories de dépenses/revenus.  
Le projet inclut un **backend Spring Boot** sécurisé avec JWT et un **frontend Angular**.

---

## 🚀 Fonctionnalités principales

- 🔐 **Authentification JWT** (login / inscription / gestion de session)  
- 👤 **Gestion des profils clients** (informations personnelles liées à un utilisateur)  
- 💳 **Comptes bancaires**
  - Consultation des comptes de l’utilisateur connecté  
  - Statut des comptes (Actif, Bloqué, Clôturé)  
- 💸 **Transactions**
  - Historique des transactions d’un compte  
  - Association des transactions à une catégorie  
- 🏷️ **Catégorisation**
  - Catégories de dépense/revenu (ex : Logement, Alimentation, Salaire, etc.)  
  - Possibilité de catégoriser une transaction manuellement  
- 📊 **Suivi budgétaire** basé sur les catégories et l’historique  

---

## 🛠️ Stack technique

### Backend
- ☕ **Java 17+**
- ⚡ **Spring Boot 3+**
- 🔒 **Spring Security + JWT**
- 🗄️ **Spring Data JPA / Hibernate**
- 🐬 **PostgreSQL**

### Frontend
- 🅰️ **Angular 17+**
- 🎨 **Bootstrap**
- 📡 **RxJS / HttpClient**
- ✍️ **FormsModule / NgModel**

---

## 📌 Exemple d’appel API

### Récupérer les comptes de l’utilisateur connecté
``` GET /api/accounts/me ```

```Authorization: Bearer <jwt_token> ```

### Mettre à jour la catégorie d’une transaction
``` PATCH /api/transactions/{transactionId}/categorie ``` 

``` Content-Type: application/json | Authorization: Bearer <jwt_token>``` 

```
{
  "categorieId": 3
}
```

## 👨‍💻 Auteur

### Projet réalisé par Nathaniel Anton Hillary
🎓 Master Développement Full Stack — EFREI Paris
