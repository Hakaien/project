#!/bin/bash

# =============================================================================
# Script de déploiement optimisé pour Angular + Symfony
# Version: 2.1.0 - Corrigé pour structure avec dossier backend
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

# Chemins du projet (adaptés à votre structure)
readonly PROJECT_ROOT="$(pwd)"
readonly ANGULAR_DIR="angular-frontend"
readonly SYMFONY_BACKEND_DIR="symfony-backend"
readonly SYMFONY_PUBLIC_DIR="symfony-backend/public"

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
        log_info "Dépendances déjà installées"
    fi

    # Nettoyer le cache et les builds précédents
    log_info "Nettoyage du cache Angular..."
    rm -rf node_modules/.cache dist

    # Build Angular en mode production
    log_info "Compilation Angular en mode production..."
    if ! npm run build; then
        log_error "Échec du build Angular"
        exit 1
    fi

    # Vérifier que le build a réussi
    local build_output_dir="$ANGULAR_DIR/dist/browser"

    if [ ! -d "$build_output_dir" ]; then
        log_error "Dossier de build introuvable : $build_output_dir"
        exit 1
    fi

    # Vérifier qu'il contient des fichiers
    if [ ! "$(ls -A "$build_output_dir")" ]; then
        log_error "Le dossier de build est vide : $build_output_dir"
        exit 1
    fi

    log_success "Build Angular réussi"
    cd "$PROJECT_ROOT"
}

# =============================================================================
# PHASE 2 : DÉPLOIEMENT VERS SYMFONY
# =============================================================================

deploy_to_symfony() {
    log_info "Phase 2 : Déploiement vers Symfony..."

    cd "$PROJECT_ROOT"

    # Vérifier que le dossier backend existe
    if [ ! -d "$SYMFONY_BACKEND_DIR" ]; then
        log_error "Dossier backend introuvable : $SYMFONY_BACKEND_DIR"
        exit 1
    fi

    # Créer le dossier public s'il n'existe pas
    mkdir -p "$SYMFONY_PUBLIC_DIR"

    # Nettoyer le dossier public Symfony (garder .htaccess et index.php si présents)
    log_info "Nettoyage de $SYMFONY_PUBLIC_DIR..."
    find "$SYMFONY_PUBLIC_DIR" -type f \! \( -name '.htaccess' -o -name 'index.php' \) -delete
    find "$SYMFONY_PUBLIC_DIR" -type d -empty -delete

    # Copier tous les fichiers du build Angular
    local angular_build_path="$PROJECT_ROOT/$ANGULAR_DIR/dist/browser"

    if [ ! -d "$angular_build_path" ]; then
        log_error "Dossier de build Angular introuvable : $angular_build_path"
        exit 1
    fi

    log_info "Copie des fichiers Angular vers Symfony..."
    
    # Copier le contenu du dossier dist vers public
    cp -r "$angular_build_path"/* "$SYMFONY_PUBLIC_DIR/"

    # Vérifier que index.html a été copié
    if [ ! -f "$SYMFONY_PUBLIC_DIR/index.html" ]; then
        log_error "index.html n'a pas été copié correctement"
        exit 1
    fi

    log_success "Déploiement vers Symfony réussi"
}

# =============================================================================
# PHASE 3 : CONFIGURATION WEB OPTIMISÉE
# =============================================================================

configure_web_optimization() {
    log_info "Phase 3 : Configuration web optimisée..."

    cd "$PROJECT_ROOT/$SYMFONY_PUBLIC_DIR"

    # Créer/mettre à jour .htaccess pour optimisation (si Apache)
    if [ ! -f ".htaccess" ]; then
        log_info "Création du fichier .htaccess d'optimisation..."
        cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirection des routes API vers Symfony (si nécessaire)
    # RewriteCond %{REQUEST_URI} ^/api/
    # RewriteRule ^(.*)$ index.php [QSA,L]
    
    # Security headers
    <IfModule mod_headers.c>
        Header always set X-Content-Type-Options nosniff
        Header always set X-Frame-Options SAMEORIGIN
        Header always set X-XSS-Protection "1; mode=block"
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
    </IfModule>
    
    # Cache static assets (performance)
    <IfModule mod_expires.c>
        ExpiresActive on
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
        ExpiresByType image/webp "access plus 1 year"
        ExpiresByType font/woff2 "access plus 1 year"
        ExpiresByType font/woff "access plus 1 year"
    </IfModule>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
</IfModule>
EOF
        log_success "Fichier .htaccess créé"
    else
        log_info "Fichier .htaccess existant conservé"
    fi

    log_info "Configuration web optimisée terminée"
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
    local index_size
    if command -v stat >/dev/null 2>&1; then
        if stat -c%s "index.html" >/dev/null 2>&1; then
            index_size=$(stat -c%s "index.html")
        elif stat -f%z "index.html" >/dev/null 2>&1; then
            index_size=$(stat -f%z "index.html")
        else
            index_size="inconnu"
        fi
    else
        index_size="inconnu"
    fi
    log_info "Taille d'index.html : $index_size bytes"

    # Compter les assets
    local asset_count=0
    local js_count=0
    local css_count=0

    if [ -d "." ]; then
        asset_count=$(find . -type f -name "*.js" -o -name "*.css" -o -name "*.png" -o -name "*.jpg" -o -name "*.svg" | wc -l)
        js_count=$(find . -type f -name "*.js" | wc -l)
        css_count=$(find . -type f -name "*.css" | wc -l)
    fi

    log_info "Nombre total d'assets : $asset_count"
    log_info "Fichiers JS : $js_count"
    log_info "Fichiers CSS : $css_count"

    # Vérifier la structure des fichiers Angular
    if [ -f "main*.js" ]; then
        log_success "Fichier main.js trouvé (build Angular valide)"
    else
        log_warning "Fichier main.js non trouvé, vérifiez le build"
    fi

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
    configure_web_optimization
    final_checks

    # Résumé final
    log_success "🎉 Déploiement terminé avec succès !"
    log_info "Logs disponibles dans : $LOG_FILE"
    log_info "Dossier public Symfony : $SYMFONY_PUBLIC_DIR"

    # Afficher les statistiques
    cd "$PROJECT_ROOT/$SYMFONY_PUBLIC_DIR"
    log_info "📊 Statistiques du déploiement :"
    local file_count=$(ls -1 | wc -l)
    log_info "  - Fichiers dans le dossier public : $file_count"
    
    if command -v du >/dev/null 2>&1; then
        local total_size=$(du -sh . 2>/dev/null | cut -f1 || echo "inconnu")
        log_info "  - Taille totale : $total_size"
    fi
}

# =============================================================================
# EXÉCUTION
# =============================================================================

# Vérifier que le script est exécuté depuis le bon répertoire
if [ ! -d "$ANGULAR_DIR" ] || [ ! -d "$SYMFONY_BACKEND_DIR" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet"
    log_error "Répertoires attendus : $ANGULAR_DIR et $SYMFONY_BACKEND_DIR"
    log_info "Structure actuelle du projet :"
    ls -la
    exit 1
fi

# Exécuter la fonction principale
main "$@"