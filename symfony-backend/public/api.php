<?php
// api.php dans public_html

// Définir le chemin vers Symfony
$symfonyDir = __DIR__ . '/../symfony';
$symfonyPublicDir = $symfonyDir . '/public';

// Charger l'autoloader de Composer
require_once $symfonyDir . '/vendor/autoload.php';

// Charger les variables d'environnement Symfony
use Symfony\Component\Dotenv\Dotenv;
$dotenv = new Dotenv();
$envFile = $symfonyDir . '/.env';
if (file_exists($envFile)) {
    $dotenv->load($envFile);
}

// Configurer l'environnement
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] ?? 'prod';
$_SERVER['APP_DEBUG'] = $_SERVER['APP_ENV'] === 'dev';

// Ajuster les chemins et les URI pour Symfony
$requestUri = $_SERVER['REQUEST_URI'];
$_SERVER['SCRIPT_FILENAME'] = $symfonyPublicDir . '/index.php';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['DOCUMENT_ROOT'] = $symfonyPublicDir;


// Créer le kernel et exécuter l'application
use App\Kernel;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();

try {
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
} catch (\Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}