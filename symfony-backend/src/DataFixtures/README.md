# DataFixtures

## Rôle des Fixtures

Les **fixtures** sont des classes permettant d’**initialiser la base de données** avec des données prédéfinies (ex. comptes admin, utilisateurs de test, jeux de données de développement).  
Elles sont utiles pour :

- Mettre en place des **jeux de données réalistes** pour le développement et les tests.
- Garantir la présence de comptes par défaut (ex. un compte `admin@test.com`).
- Automatiser l’amorçage de la base de données après une installation.

Symfony fournit le **DoctrineFixturesBundle** qui permet de charger facilement ces données.

**Documentation officielle :**

- [DoctrineFixturesBundle - Symfony](https://symfony.com/bundles/DoctrineFixturesBundle/current/index.html)  
- [Fixtures - Doctrine](https://www.doctrine-project.org/projects/doctrine-fixtures/en/latest/)

---

## Organisation

Les fixtures se trouvent dans le dossier `src/DataFixtures`.

### Exemple existant : `AppFixtures.php`

Cette classe sert à :

- Créer un **compte administrateur** par défaut (`ROLE_ADMIN`).
- Générer des **utilisateurs aléatoires** via [FakerPHP](https://fakerphp.github.io/).
- Définir les attributs essentiels (email, rôles, mot de passe hashé, vérification, 2FA désactivé).

```php
$admin = new User();
$admin->setEmail('admin@test.com');
$admin->setRoles(['ROLE_ADMIN']);
$admin->setPassword($this->passwordHasher->hashPassword($admin, 'Admin123!'));
$admin->setIsVerified(true);
```

## Commandes utiles

`php bin/console doctrine:fixtures:load`
/!\ Vide la base de donnée existante puis recharge les fixtures

Ajouter `--append` pour converser les données existantes:
`php bin/console doctrine:fixtures:load --append`

Créer une nouvelle fixture :
`php bin/console make:fixture`
Fichier créé dans src/DataFixtures

## Bonnes pratiques

- Toujours hasher les mots de passe (UserPasswordHasherInterface) → ne jamais stocker de mot de passe en clair.
- Utiliser Faker pour générer des données réalistes.
- Séparer les fixtures par entité ou logique métier (UserFixtures.php, ProductFixtures.php…).
- Référencer les objets créés via $this->addReference() afin de les réutiliser dans d’autres fixtures.
- Ne pas mettre trop de logique métier dans les fixtures → rester simple et lisible.

## Workflow recommandé

Modifier ou ajouter une fixture.

Vider la base et recharger :

- php bin/console doctrine:database:drop --force
- php bin/console doctrine:database:create
- php bin/console doctrine:migrations:migrate
- php bin/console doctrine:fixtures:load

Vérifier les données injectées (via Symfony Profiler ou directement en BDD).