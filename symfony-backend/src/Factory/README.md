# Factories

## Rôle des Factories

Les **factories** (via [Zenstruck Foundry](https://github.com/zenstruck/foundry)) permettent de **générer facilement des entités Doctrine** pour :

- Les **tests unitaires** et fonctionnels.
- Les **fixtures avancées** (complément de `AppFixtures`).
- Créer des entités cohérentes avec des valeurs aléatoires réalistes.
- Automatiser la génération d’objets complexes.

Documentation officielle :  

- [Zenstruck Foundry](https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html)  
- [Foundry - GitHub](https://github.com/zenstruck/foundry)

---

## Organisation

Les factories se trouvent dans `src/Factory`.

### Exemple type : `UserFactory.php`

Une factory génère des utilisateurs cohérents.  
Elle **étend `PersistentProxyObjectFactory`** (recommandé pour les entités Doctrine persistables)

## Commandes utiles

Générer une factory
`php bin/console make:factory`

Créer un utilisateur avec la factory
`UserFactory::createOne();`

Créer plusieurs utilisateurs
`UserFactory::createMany(10);`

Utiliser une factory dans une fixture
`UserFactory::createOne(['email' => 'custom@test.com', 'roles' => ['ROLE_ADMIN']]);`

## Bonnes pratiques

- Toujours centraliser la logique de génération dans la factory (ex. hashing de mot de passe, valeurs par défaut).
- Les factories remplacent Faker directement dans les fixtures → plus propre et réutilisable.
- Utiliser initialize() pour post-traiter l’entité après instanciation.
- Étendre PersistentProxyObjectFactory pour une entité Doctrine (persistance en DB).

## Workflow recommandé

1. Créer une factory pour chaque entité.
2. Utiliser la factory :
    - Dans les tests (UserFactory::createOne()).
    - Dans les fixtures (UserFactory::createMany(5)).
3. Laisser AppFixtures.php orchestrer les entités principales, mais déléguer la logique de création aux factories.
