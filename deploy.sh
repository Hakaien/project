#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Chemins
ANGULAR_DIR="angular-frontend"
SYMFONY_PUBLIC_DIR="symfony-backend/public"
ASSETS_SUBDIR="assets"

echo -e "${GREEN}➡️  Compilation Tailwind CSS...${NC}"
cd "$ANGULAR_DIR" || exit 1

# Installer les dépendances Node.js si package.json existe
echo -e "${GREEN}➡️  Installation des dépendances Node.js...${NC}"
npm install

ANGULAR_ABS_PATH=$(pwd)
TAILWIND_INPUT="$ANGULAR_ABS_PATH/src/input.css"
TAILWIND_OUTPUT="$ANGULAR_ABS_PATH/src/output.css"

if ! npx @tailwindcss/cli -i "$TAILWIND_INPUT" -o "$TAILWIND_OUTPUT" --minify; then
  echo -e "${RED}❌ Échec de la compilation Tailwind CSS.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Compilation Tailwind réussie.${NC}"

echo -e "${GREEN}➡️  Build Angular (production)...${NC}"
if ! npx ng build --configuration production; then
  echo -e "${RED}❌ Échec du build Angular.${NC}"
  exit 1
fi

BUILD_OUTPUT_DIR="dist/$(node -p "require('./angular.json').defaultProject")/browser"
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
  echo -e "${RED}❌ Dossier de build introuvable : $BUILD_OUTPUT_DIR${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build Angular réussi.${NC}"

cd ..

echo -e "${GREEN}🧹 Nettoyage du dossier Symfony public...${NC}"
rm -rf "$SYMFONY_PUBLIC_DIR"/*
mkdir -p "$SYMFONY_PUBLIC_DIR"

echo -e "${GREEN}➡️  Copie des fichiers Angular vers Symfony...${NC}"
cp "$ANGULAR_DIR/$BUILD_OUTPUT_DIR/index.html" "$SYMFONY_PUBLIC_DIR/"
cp "$ANGULAR_DIR/src/output.css" "$SYMFONY_PUBLIC_DIR/"

cd "$SYMFONY_PUBLIC_DIR" || exit 1

# Fonction versioning avec SHA1
function version_file() {
  local file="$1"
  local base=$(basename "$file")
  local hash=$(sha1sum "$file" | cut -c1-8)
  local ext="${base##*.}"
  local name="${base%.*}"
  local newname="${name}-${hash}.${ext}"
  mv "$file" "$newname"
  echo "$base|$newname"
}

declare -a versioned_files

# Versionne JS, CSS (y compris output.css)
for file in *.js *.css; do
  if [[ -f "$file" ]]; then
    versioned_files+=("$(version_file "$file")")
  fi
done

# Réécriture dans index.html et génération du manifest.json
echo -e "${GREEN}📦 Génération du manifest.json...${NC}"
echo "{" > manifest.json
for map in "${versioned_files[@]}"; do
  original=$(echo "$map" | cut -d'|' -f1)
  hashed=$(echo "$map" | cut -d'|' -f2)
  sed -i "s|$original|$hashed|g" index.html
  echo "  \"$original\": \"$hashed\"," >> manifest.json
done
# Retire la dernière virgule
sed -i '$ s/,$//' manifest.json
echo "}" >> manifest.json

# Copie les assets Angular (images, fonts, etc.)
cd ../..
cp -r "$ANGULAR_DIR/$BUILD_OUTPUT_DIR/$ASSETS_SUBDIR" "$SYMFONY_PUBLIC_DIR/"

echo -e "${GREEN}🎉 Déploiement terminé avec versioning, manifest et assets copiés !${NC}"
# Fin du script
exit 0