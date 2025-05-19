#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Chemins
ANGULAR_DIR="angular-frontend"
SYMFONY_PUBLIC_APP_DIR="symfony-backend/public"

echo -e "${GREEN}➡️  Build Angular (production)...${NC}"
cd "$ANGULAR_DIR" || exit 1

# Build Angular
if ! npx ng build --configuration production; then
  echo -e "${RED}❌ Échec du build Angular.${NC}"
  exit 1
fi

# Vérifie si le dossier de sortie existe
BUILD_OUTPUT_DIR="dist/$(node -p "require('./angular.json').defaultProject")/browser"

if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
  echo -e "${RED}❌ Dossier de build introuvable : $BUILD_OUTPUT_DIR${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Build Angular réussi.${NC}"

# Compile Tailwind CSS avec la CLI
echo -e "${GREEN}➡️  Compilation Tailwind CSS...${NC}"

# Obtenir le chemin absolu vers angular-frontend
ANGULAR_ABS_PATH=$(pwd)

TAILWIND_INPUT="$ANGULAR_ABS_PATH/src/input.css"
TAILWIND_OUTPUT="$ANGULAR_ABS_PATH/src/output.css"

if ! npx @tailwindcss/cli -i "$TAILWIND_INPUT" -o "$TAILWIND_OUTPUT" --minify; then
  echo -e "${RED}❌ Échec de la compilation Tailwind CSS.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Compilation Tailwind réussie.${NC}"

# Retour au dossier racine du script
cd ..

# Nettoie le dossier Symfony public/app
rm -rf "$SYMFONY_PUBLIC_APP_DIR"
mkdir -p "$SYMFONY_PUBLIC_APP_DIR"

# Copie les fichiers buildés Angular
cp -r "$ANGULAR_DIR/$BUILD_OUTPUT_DIR"/* "$SYMFONY_PUBLIC_APP_DIR/"

# Copie le fichier CSS Tailwind compilé dans le dossier Symfony public
cp "$TAILWIND_OUTPUT" "$SYMFONY_PUBLIC_APP_DIR/"

echo -e "${GREEN}🎉 Déploiement terminé dans Symfony !${NC}"
