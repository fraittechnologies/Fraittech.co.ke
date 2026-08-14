<?php
/**
 * Public IntaSend config for browser (publishable key only).
 * Safe to expose; keep secret key in intasend-credentials.php only.
 */
require_once __DIR__ . '/intasend-credentials.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo json_encode([
    'publishableKey' => $PUBLIC_KEY,
    'live' => true,
], JSON_UNESCAPED_UNICODE);
