# Composants de contrôles de formulaire

Cette documentation décrit l'utilisation des composants de contrôles de formulaire personnalisés pour votre application Angular.

## Structure des composants

```
shared/components/form-controls/
├── input-error/          # Composant d'affichage des erreurs
├── input-text/           # Composant input texte générique
└── input-email/          # Composant input email avec validation visuelle
```

## Composants disponibles

### InputErrorComponent

Composant responsable de l'affichage des erreurs de validation.

**Propriétés :**

- `control: AbstractControl | null` - Le contrôle de formulaire à vérifier
- `fieldName: string` - Le nom du champ pour l'affichage des erreurs

**Erreurs gérées :**

- `required` - Champ requis
- `email` / `emailFormat` - Format d'email invalide
- `minlength` / `maxlength` - Longueur de caractères
- `passwordStrength` - Force du mot de passe
- `pattern` - Format invalide

### InputTextComponent

Composant input texte générique avec gestion des erreurs.

**Propriétés :**

- `label: string` - Label du champ
- `placeholder: string` - Texte d'aide
- `required: boolean` - Champ requis (défaut: false)
- `disabled: boolean` - Champ désactivé (défaut: false)
- `readonly: boolean` - Champ en lecture seule (défaut: false)
- `type: string` - Type d'input (défaut: 'text')
- `maxlength?: number` - Longueur maximale
- `minlength?: number` - Longueur minimale
- `autofocus: boolean` - Focus automatique (défaut: false)
- `control: FormControl | null` - Contrôle de formulaire
- `fieldName: string` - Nom du champ pour les erreurs

**Types supportés :**

- `text` (défaut)
- `password`
- `tel`
- `url`
- etc.

### InputEmailComponent

Composant spécialisé pour les emails avec validation visuelle.

**Propriétés :**

- `label: string` - Label (défaut: 'Email')
- `placeholder: string` - Texte d'aide (défaut: '<exemple@domaine.com>')
- `required: boolean` - Champ requis (défaut: false)
- `disabled: boolean` - Champ désactivé (défaut: false)
- `readonly: boolean` - Champ en lecture seule (défaut: false)
- `autofocus: boolean` - Focus automatique (défaut: false)
- `control: FormControl | null` - Contrôle de formulaire
- `fieldName: string` - Nom du champ (défaut: 'Email')
- `showValidationIcon: boolean` - Afficher les icônes de validation (défaut: true)

**Fonctionnalités :**

- Validation visuelle avec icônes ✓/✗
- Autocomplete="email"
- Type="email" automatique

## Utilisation

### 1. Import dans votre module/composant

```typescript
import { InputTextComponent } from './shared/components/form-controls/input-text/input-text.component';
import { InputEmailComponent } from './shared/components/form-controls/input-email/input-email.component';
import { InputErrorComponent } from './shared/components/form-controls/input-error/input-error.component';
```

### 2. Utilisation basique

```html
<!-- Input texte simple -->
<app-input-text
  label="Nom"
  placeholder="Entrez votre nom"
  [required]="true"
  [control]="form.get('name')"
  fieldName="Nom">
</app-input-text>

<!-- Input email -->
<app-input-email
  label="Email"
  [required]="true"
  [control]="form.get('email')">
</app-input-email>

<!-- Input mot de passe -->
<app-input-text
  label="Mot de passe"
  type="password"
  [required]="true"
  [control]="form.get('password')"
  fieldName="Mot de passe">
</app-input-text>
```

### 3. Exemple complet avec FormBuilder

```typescript
export class MonComposant {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]]
  });

  constructor(private fb: FormBuilder) {}
}
```

## Intégration avec vos validateurs

Les composants utilisent automatiquement vos validateurs personnalisés :

- `emailFormatValidator` - Validation email personnalisée
- `passwordStrengthValidator` - Validation force du mot de passe

## Directives intégrées

- `AutofocusDirective` - Focus automatique sur le premier champ
- `SanitizeDirective` - Nettoyage des données (si utilisée)

## Accessibilité

Tous les composants respectent les standards d'accessibilité :

- Labels associés aux inputs
- Attributs ARIA appropriés
- Messages d'erreur annoncés par les lecteurs d'écran
- Navigation au clavier

## Styles

Les composants utilisent des classes CSS modulaires :

- `.form-field` - Container principal
- `.form-label` - Label du champ
- `.form-input` - Input de base
- `.form-input--error` - État d'erreur
- `.form-input--valid` - État valide
- `.form-input--disabled` - État désactivé

## Personnalisation

Vous pouvez personnaliser l'apparence en modifiant les fichiers SCSS correspondants ou en surchargeant les classes CSS dans vos styles globaux.

## Intégration avec Symfony

Ces composants sont conçus pour fonctionner avec votre API Symfony :

1. Les données de formulaire sont sérialisées en JSON
2. Envoyées à vos endpoints Symfony via HttpClient
3. Les erreurs de validation côté serveur peuvent être mappées aux contrôles

Exemple d'intégration :

```typescript
onSubmit() {
  if (this.form.valid) {
    this.http.post('/api/users', this.form.value)
      .subscribe({
        next: (response) => {
          // Succès
        },
        error: (error) => {
          // Mapper les erreurs serveur aux contrôles
          this.mapServerErrorsToForm(error.error.violations);
        }
      });
  }
}
```
