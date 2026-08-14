<?php
require_once __DIR__ . '/intasend-credentials.php';

header('Content-Type: application/json');

// Require Composer autoload for IntaSend SDK
require_once __DIR__ . '/vendor/autoload.php';

use IntaSend\IntaSendPHP\Collection;

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['amount']) && isset($data['phone'])) {
    $amount = $data['amount'];
    $phone = $data['phone'];
    $email = $data['email'] ?? 'info@fraittech.co.ke';
    $name = $data['name'] ?? '';
    
    // Validate phone number (should be in format 2547XXXXXXXX)
    if (!preg_match('/^254\d{9}$/', $phone)) {
        echo json_encode(['success' => false, 'message' => 'Invalid phone number format. Use format: 2547XXXXXXXX']);
        exit;
    }

    // IntaSend credentials for SDK
    $credentials = [
        'publishable_key' => $PUBLIC_KEY,
        'token' => $SECRET_KEY,
        'test' => false // Set to true for sandbox/testing
    ];

    $collection = new Collection();
    $collection->init($credentials);

    try {
        $response = $collection->create(
            $amount,
            $phone,
            'KES',
            'MPESA_STK_PUSH',
            uniqid('PAY_'),
            $name,
            $email
        );
        echo json_encode([
            'success' => true,
            'message' => 'STK push sent successfully. Check your phone for the payment prompt.',
            'data' => $response
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to process payment. ' . $e->getMessage(),
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

echo json_encode([
    'success' => false,
    'message' => 'Invalid request. Please provide amount and phone number.'
]);
exit;
