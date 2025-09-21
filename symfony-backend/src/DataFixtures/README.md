# DataFixtures - Version Corrigée

## 🎯 Objectif

Les **fixtures** permettent d'**initialiser la base de données** avec des jeux de données prédéfinis pour le développement et les tests. Cette version corrigée gère intelligemment l'existence des utilisateurs pour éviter les doublons.

## ✨ Fonctionnalités principales

### 🔄 Gestion intelligente des utilisateurs existants

- **AdminFixtures** : Vérifie si `admin@test.com` existe déjà
  - ✅ **Existe** → Met à jour le mot de passe et les propriétés
  - 🆕 **N'existe pas** → Crée un nouveau compte admin

- **RegularUsersFixtures** : Même logique pour `user1@test.com` à `user5@test.com`
  - ✅ **Existe** → Met à jour les propriétés nécessaires
  - 🆕 **N'existe pas** → Crée de nouveaux comptes

### 🏗️ Architecture modulaire

```structure
src/DataFixtures/
├── AppFixtures.php              # Orchestrateur principal
├── Users/
│   ├── AdminFixtures.php        # Gestion de l'admin
│   ├── RegularUsersFixtures.php # Gestion des utilisateurs standards
│   └── UserFixtures.php         # Orchestrateur utilisateurs
└── README.md
```

## 👥 Comptes créés

| Type | Email | Mot de passe | Rôle | Propriétés |
|------|-------|--------------|------|------------|
| **Admin** | <admin@test.com> | Admin123! | ROLE_ADMIN | ✅ Vérifié, 🔒 2FA désactivé |
| **User 1** | <user1@test.com> | User123! | ROLE_USER | ✅ Vérifié, 🔒 2FA désactivé |
| **User 2** | <user2@test.com> | User123! | ROLE_USER | ✅ Vérifié, 🔒 2FA désactivé |
| **...** | ... | ... | ... | ... |
| **User 5** | <user5@test.com> | User123! | ROLE_USER | ✅ Vérifié, 🔒 2FA désactivé |

## 🚀 Commandes disponibles

### Commandes principales

```bash
# Charger toutes les fixtures (gestion intelligente des doublons)
php bin/console doctrine:fixtures:load

# Ajouter sans vider la base
php bin/console doctrine:fixtures:load --append
```

### Commandes par groupes

```bash
# Créer/mettre à jour seulement l'admin
php bin/console doctrine:fixtures:load --group=admin --append

# Créer/mettre à jour seulement les utilisateurs standards  
php bin/console doctrine:fixtures:load --group=users --append

# Créer/mettre à jour admin + utilisateurs ensemble
php bin/console doctrine:fixtures:load --group=all_users --append

# Charger toute l'application (données complètes)
php bin/console doctrine:fixtures:load --group=app --append
```

### Reset complet de la base

```bash
# Réinitialisation complète (pour développement)
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create  
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

## 🔧 Améliorations apportées

### ✅ Correctifs techniques

1. **AdminFixtures.php**
   - ✅ Gestion de l'existence de l'admin
   - ✅ Mise à jour des propriétés (`isVerified`, `password`)
   - ✅ Injection du `UserPasswordHasherInterface`

2. **RegularUsersFixtures.php**  
   - ✅ Correction de l'erreur de syntaxe ligne 27
   - ✅ Gestion de l'existence des utilisateurs
   - ✅ Noms aléatoires (`firstName`, `lastName`) via Faker

3. **UserFactory.php**
   - ✅ Correction de l'encodage des commentaires
   - ✅ Ajout de `firstName`, `lastName`, `isPasswordSet`
   - ✅ Suppression des logs de debug

4. **Architecture générale**
   - ✅ Messages informatifs lors du chargement
   - ✅ Gestion robuste des références
   - ✅ Respect des bonnes pratiques Symfony 7.2

### 🎨 Améliorations UX

- **Messages colorés** : Distinction entre création (🆕) et mise à jour (✅)
- **Logs informatifs** : Affichage des comptes créés/mis à jour
- **Documentation claire** : Tableaux récapitulatifs et exemples

## 💡 Utilisation pratique

### Développement quotidien

```bash
# Ajouter/mettre à jour seulement les users de test
php bin/console doctrine:fixtures:load --group=all_users --append
```

### Tests spécifiques

```bash
# Besoin seulement d'un admin pour tester l'interface d'admin
php bin/console doctrine:fixtures:load --group=admin --append

# Besoin de users standards pour tester les fonctionnalités
php bin/console doctrine:fixtures:load --group=users --append
```

### Initialisation complète

```bash
# Projet neuf ou réinitialisation complète
php bin/console doctrine:fixtures:load --group=app
```

## 🔐 Sécurité

- ✅ **Mots de passe hashés** automatiquement
- ✅ **Mots de passe forts** même en développement  
- ✅ **Données cohérentes** (isVerified, isPasswordSet)
- ✅ **2FA configuré** mais désactivé par défaut

## 🏗️ Extension future

La structure permet d'ajouter facilement d'autres fixtures :

```php
// Dans AppFixtures.php
public function getDependencies(): array
{
    return [
        UserFixtures::class,
        PostFixtures::class,      // À ajouter
        CategoryFixtures::class,  // À ajouter
    ];
}
```

## 📋 Groupes disponibles

| Groupe | Description | Fixtures incluses |
|--------|-------------|-------------------|
| `admin` | Admin uniquement | AdminFixtures |
| `users` | Users standards uniquement | RegularUsersFixtures |
| `all_users` | Admin + Users | AdminFixtures + RegularUsersFixtures |
| `app` | Application complète | Toutes les fixtures |
