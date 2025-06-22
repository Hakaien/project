#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Chemin absolu du projet
PROJECT_ROOT="$(pwd)"

# Répertoires
ANGULAR_DIR="angular-frontend"
SYMFONY_PUBLIC_DIR="symfony-backend/public"
ASSETS_SUBDIR="assets"

echo -e "${GREEN}➡️  Phase 1 : Compilation Tailwind CSS...${NC}"
cd "$ANGULAR_DIR" || { echo -e "${RED}❌ Échec : dossier $ANGULAR_DIR introuvable.${NC}"; exit 1; }

# Dépendances Node.js
if [ -d "node_modules" ]; then
  echo -e "${BLUE}ℹ️  Dépendances déjà installées, skip npm install.${NC}"
else
  echo -e "${GREEN}➡️  Installation des dépendances Node.js...${NC}"
  npm install || { echo -e "${RED}❌ npm install a échoué.${NC}"; exit 1; }
fi

# Compilation Tailwind CSS
TAILWIND_INPUT="src/input.css"
TAILWIND_OUTPUT="src/output.css"

if [ ! -f "$TAILWIND_INPUT" ]; then
  echo -e "${RED}❌ Fichier Tailwind d’entrée introuvable : $TAILWIND_INPUT${NC}"
  exit 1
fi

if ! npx @tailwindcss/cli -i "$TAILWIND_INPUT" -o "$TAILWIND_OUTPUT" --minify; then
  echo -e "${RED}❌ Échec de la compilation Tailwind CSS.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Compilation Tailwind réussie.${NC}"

echo -e "${GREEN}➡️  Phase 2 : Build Angular (production)...${NC}"

# Nom du projet Angular
DEFAULT_PROJECT=$(node -p "Object.keys(require('./angular.json').projects)[0]")

# Build Angular
if ! npx ng build --configuration production; then
  echo -e "${RED}❌ Échec du build Angular.${NC}"
  exit 1
fi

BUILD_OUTPUT_DIR="dist/$DEFAULT_PROJECT/browser"
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
  echo -e "${RED}❌ Dossier de build introuvable : $BUILD_OUTPUT_DIR${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build Angular réussi.${NC}"

cd "$PROJECT_ROOT"

echo -e "${GREEN}➡️  Phase 3 : Déploiement vers Symfony...${NC}"
echo -e "${BLUE}🧹 Nettoyage de $SYMFONY_PUBLIC_DIR...${NC}"
rm -rf "$SYMFONY_PUBLIC_DIR"/*
mkdir -p "$SYMFONY_PUBLIC_DIR"

INDEX_SRC="$PROJECT_ROOT/$ANGULAR_DIR/$BUILD_OUTPUT_DIR/index.html"
OUTPUT_CSS_SRC="$PROJECT_ROOT/$ANGULAR_DIR/src/output.css"
echo "|$INDEX_SRC|"
ls -l "$INDEX_SRC"
if [ -e "$INDEX_SRC" ]; then echo "Le fichier existe"; else echo "Le fichier N'EXISTE PAS"; fi
if [ ! -f "$INDEX_SRC" ]; then
  echo -e "${RED}❌ index.html manquant après build : $INDEX_SRC${NC}"
  exit 1
fi
cp "$INDEX_SRC" "$SYMFONY_PUBLIC_DIR/"

if [ -f "$OUTPUT_CSS_SRC" ]; then
  cp "$OUTPUT_CSS_SRC" "$SYMFONY_PUBLIC_DIR/"
else
  echo -e "${RED}❌ output.css non trouvé à $OUTPUT_CSS_SRC${NC}"
  exit 1
fi

cd "$SYMFONY_PUBLIC_DIR" || exit 1

# Versioning JS/CSS
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

echo -e "${GREEN}➡️  Phase 4 : Versioning des fichiers JS/CSS...${NC}"
for file in *.js *.css; do
  if [[ -f "$file" ]]; then
    versioned_files+=("$(version_file "$file")")
  fi
done

file_count=${#versioned_files[@]}
echo -e "${BLUE}ℹ️  $file_count fichier(s) versionné(s).${NC}"

# Génération du manifest.json + mise à jour de index.html
echo -e "${GREEN}📦 Génération de manifest.json...${NC}"
echo "{" > manifest.json
for map in "${versioned_files[@]}"; do
  original=$(echo "$map" | cut -d'|' -f1)
  hashed=$(echo "$map" | cut -d'|' -f2)
  sed -i "s|$original|$hashed|g" index.html
  echo "  \"$original\": \"$hashed\"," >> manifest.json
done
sed -i '$ s/,$//' manifest.json
echo "}" >> manifest.json

# Copie des assets Angular (images, fonts, etc.)
cd "$PROJECT_ROOT"
ASSETS_PATH="$PROJECT_ROOT/$ANGULAR_DIR/$BUILD_OUTPUT_DIR/$ASSETS_SUBDIR"
echo $ASSETS_PATH
if [ -d "$ASSETS_PATH" ]; then
  cp -r "$ASSETS_PATH" "$SYMFONY_PUBLIC_DIR/"
  echo -e "${GREEN}✅ Assets copiés.${NC}"
else
  echo -e "${RED}❌ Dossier assets introuvable : $ASSETS_PATH${NC}"
fi

# Nettoyage Tailwind CSS temporaire
rm -f "$OUTPUT_CSS_SRC"

echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
exit 0
# Fin du script
