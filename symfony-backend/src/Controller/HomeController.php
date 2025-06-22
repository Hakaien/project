<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_angular', requirements: [
        'reactRouting' => '^(?!api|_wdt|_profiler|.*\.(js|css|ico|png|jpg|jpeg|svg|webp|json|txt|map)$).*'
    ], defaults: ['reactRouting' => ''])]
    public function angularApp(): BinaryFileResponse
    {
        $file = $this->getParameter('kernel.project_dir') . '/public/index.html';

        $response = new BinaryFileResponse($file);
        $response->headers->set('Content-Type', 'text/html; charset=UTF-8');
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE, 'index.html');

        return $response;
    }
}
