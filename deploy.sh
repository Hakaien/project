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
if ! npx ng build; then
  echo -e "${RED}❌ Échec du build Angular.${NC}"
  exit 1
fi

# Vérifie si le dossier de sortie existe
BUILD_OUTPUT_DIR="dist/$(node -p "require('./angular.json').defaultProject")/browser"

echo ${BUILD_OUTPUT_DIR}
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
  echo -e "${RED}❌ Dossier de build introuvable : $BUILD_OUTPUT_DIR${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Build réussi. Copie vers Symfony...${NC}"

# Nettoie le dossier Symfony public/app
rm -rf "../$SYMFONY_PUBLIC_APP_DIR"
mkdir -p "../$SYMFONY_PUBLIC_APP_DIR"

# Copie les fichiers buildés
cp -r "$BUILD_OUTPUT_DIR"/* "../$SYMFONY_PUBLIC_APP_DIR/"

echo -e "${GREEN}🎉 Déploiement terminé dans Symfony !${NC}"
