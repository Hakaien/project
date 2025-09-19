#!/bin/bash

# =============================================================================
# Script de déploiement optimisé pour Angular + Symfony
# Version: 2.0.0
# Auteur: Optimisé selon les bonnes pratiques
# =============================================================================

set -euo pipefail  # Arrêt sur erreur, variables non définies, erreurs dans les pipes

# =============================================================================
# CONFIGURATION
# =============================================================================

# Couleurs pour les logs
readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Chemins du projet
readonly PROJECT_ROOT="$(pwd)"
readonly ANGULAR_DIR="angular-frontend"
readonly SYMFONY_PUBLIC_DIR="symfony-backend/public"
readonly ASSETS_SUBDIR="assets"

# Configuration du logging
readonly LOG_FILE="${PROJECT_ROOT}/deploy.log"
readonly TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

# Fonction de logging avec timestamp
log() {
    local level="$1"
    local message="$2"
    local color="$3"
    
    echo -e "${color}[${TIMESTAMP}] [${level}] ${message}${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "$1" "$BLUE"
}

log_success() {
    log "SUCCESS" "$1" "$GREEN"
}

log_warning() {
    log "WARNING" "$1" "$YELLOW"
}

log_error() {
    log "ERROR" "$1" "$RED"
}

# Fonction de nettoyage en cas d'erreur
cleanup() {
    log_error "Erreur détectée. Nettoyage en cours..."
    # Ici on pourrait ajouter des actions de nettoyage si nécessaire
    exit 1
}

# Gestionnaire de signaux pour le nettoyage
trap cleanup ERR INT TERM

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier Angular CLI
    if ! command -v npx &> /dev/null; then
        log_error "npx n'est pas disponible"
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# =============================================================================
# PHASE 1 : BUILD ANGULAR (PRODUCTION)
# =============================================================================

build_angular() {
    log_info "Phase 1 : Build Angular (production)..."
    
    cd "$ANGULAR_DIR" || {
        log_error "Impossible d'accéder au dossier $ANGULAR_DIR"
        exit 1
    }
    
    # Vérifier les dépendances
    if [ ! -d "node_modules" ]; then
        log_info "Installation des dépendances Node.js..."
        if ! npm install; then
            log_error "Échec de l'installation des dépendances"
            exit 1
        fi
    else
        log_info "Dépendances déjà installées, skip npm install"
    fi
    
    # Nettoyer le cache et les builds précédents
    log_info "Nettoyage du cache Angular..."
    rm -rf node_modules/.cache dist
    
    # Build Angular en mode production
    log_info "Compilation Angular en mode production..."
    if ! npx ng build --configuration production --verbose; then
        log_error "Échec du build Angular"
        exit 1
    fi
    
    # Vérifier que le build a réussi
    local default_project
    default_project=$(node -p "Object.keys(require('./angular.json').projects)[0]")
    local build_output_dir="dist/$default_project/browser"
    
    if [ ! -d "$build_output_dir" ]; then
        log_error "Dossier de build introuvable : $build_output_dir"
        exit 1
    fi
    
    log_success "Build Angular réussi"
    echo "$build_output_dir" > /tmp/build_output_dir  # Sauvegarder le chemin
}

# =============================================================================
# PHASE 2 : DÉPLOIEMENT VERS SYMFONY
# =============================================================================

deploy_to_symfony() {
    local build_output_dir
    build_output_dir=$(cat /tmp/build_output_dir)
    
    log_info "Phase 2 : Déploiement vers Symfony..."
    
    cd "$PROJECT_ROOT"
    
    # Nettoyer le dossier public Symfony
    log_info "Nettoyage de $SYMFONY_PUBLIC_DIR..."
    rm -rf "$SYMFONY_PUBLIC_DIR"/*
    mkdir -p "$SYMFONY_PUBLIC_DIR"
    
    # Copier tous les fichiers du build Angular
    local angular_build_path="$PROJECT_ROOT/$ANGULAR_DIR/$build_output_dir"
    
    if [ ! -d "$angular_build_path" ]; then
        log_error "Dossier de build Angular introuvable : $angular_build_path"
        exit 1
    fi
    
    log_info "Copie des fichiers Angular vers Symfony..."
    cp -r "$angular_build_path"/* "$SYMFONY_PUBLIC_DIR/"
    
    log_success "Déploiement vers Symfony réussi"
}

# =============================================================================
# PHASE 3 : VERSIONING ET OPTIMISATION
# =============================================================================

version_assets() {
    log_info "Phase 3 : Versioning des assets..."
    
    cd "$SYMFONY_PUBLIC_DIR" || exit 1
    
    # Fonction pour versionner un fichier
    version_file() {
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
    
    # Versionner tous les fichiers JS et CSS (sauf ceux déjà versionnés par Angular)
    for file in *.js *.css; do
        if [[ -f "$file" && ! "$file" =~ -[a-f0-9]{8}\.(js|css)$ ]]; then
            versioned_files+=("$(version_file "$file")")
        fi
    done
    
    local file_count=${#versioned_files[@]}
    log_info "$file_count fichier(s) versionné(s)"
    
    # Générer le manifest.json et mettre à jour index.html
    if [ ${#versioned_files[@]} -gt 0 ]; then
        log_info "Génération du manifest.json..."
        echo "{" > manifest.json
        for map in "${versioned_files[@]}"; do
            local original=$(echo "$map" | cut -d'|' -f1)
            local hashed=$(echo "$map" | cut -d'|' -f2)
            sed -i "s|$original|$hashed|g" index.html
            echo "  \"$original\": \"$hashed\"," >> manifest.json
        done
        sed -i '$ s/,$//' manifest.json
        echo "}" >> manifest.json
        log_success "Manifest.json généré"
    else
        log_info "Aucun fichier à versionner (Angular gère déjà le versioning)"
    fi
}

# =============================================================================
# PHASE 4 : VÉRIFICATIONS FINALES
# =============================================================================

final_checks() {
    log_info "Phase 4 : Vérifications finales..."
    
    cd "$PROJECT_ROOT/$SYMFONY_PUBLIC_DIR"
    
    # Vérifier que index.html existe
    if [ ! -f "index.html" ]; then
        log_error "index.html manquant dans le dossier public"
        exit 1
    fi
    
    # Vérifier la taille des fichiers
    local index_size=$(stat -c%s "index.html" 2>/dev/null || stat -f%z "index.html" 2>/dev/null || echo "0")
    log_info "Taille d'index.html : $index_size bytes"
    
    # Compter les assets
    local asset_count=0
    if [ -d "assets" ]; then
        asset_count=$(find assets -type f | wc -l)
    fi
    log_info "Nombre d'assets copiés : $asset_count"
    
    log_success "Vérifications finales terminées"
}

# =============================================================================
# FONCTION PRINCIPALE
# =============================================================================

main() {
    log_info "🚀 Début du déploiement Angular + Symfony"
    log_info "Projet : $PROJECT_ROOT"
    
    # Initialiser le fichier de log
    echo "=== DÉPLOIEMENT DU $(date) ===" > "$LOG_FILE"
    
    # Vérifier les prérequis
    check_prerequisites
    
    # Exécuter les phases
    build_angular
    deploy_to_symfony
    version_assets
    final_checks
    
    # Résumé final
    log_success "🎉 Déploiement terminé avec succès !"
    log_info "Logs disponibles dans : $LOG_FILE"
    log_info "Dossier public Symfony : $SYMFONY_PUBLIC_DIR"
    
    # Afficher les statistiques
    cd "$PROJECT_ROOT/$SYMFONY_PUBLIC_DIR"
    log_info "📊 Statistiques du déploiement :"
    log_info "  - Fichiers dans le dossier public : $(ls -1 | wc -l)"
    log_info "  - Taille totale : $(du -sh . | cut -f1)"
}

# =============================================================================
# EXÉCUTION
# =============================================================================

# Vérifier que le script est exécuté depuis le bon répertoire
if [ ! -d "$ANGULAR_DIR" ] || [ ! -d "$SYMFONY_PUBLIC_DIR" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet"
    log_error "Répertoires attendus : $ANGULAR_DIR et $SYMFONY_PUBLIC_DIR"
    exit 1
fi

# Exécuter la fonction principale
main "$@"