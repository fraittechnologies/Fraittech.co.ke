<?php
// pay.php — IntaSend payment integration using PHP and cURL
// Add POST ajax=1 (or GET ajax=1) for JSON: { success, checkout_url?, message? }

require_once __DIR__ . '/intasend-credentials.php';
$secret_key = $SECRET_KEY;

$isAjax = (!empty($_POST['ajax']) || !empty($_GET['ajax']));

$amount = isset($_POST['amount']) ? $_POST['amount'] : (isset($_GET['amount']) ? $_GET['amount'] : '');
$email = isset($_POST['email']) ? $_POST['email'] : (isset($_GET['email']) ? $_GET['email'] : '');
$customer_name = isset($_POST['customer_name']) ? trim((string) $_POST['customer_name']) : '';
$customer_phone = isset($_POST['customer_phone']) ? trim((string) $_POST['customer_phone']) : '';
$order_summary = isset($_POST['order_summary']) ? trim((string) $_POST['order_summary']) : '';

function pay_json_response($success, $payload = [], $http = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($http);
    echo json_encode(array_merge(['success' => $success], $payload));
    exit;
}

if (!$amount || !is_numeric($amount)) {
    if ($isAjax) {
        pay_json_response(false, ['message' => 'Invalid amount.'], 400);
    }
    die('Invalid amount.');
}

$order_id = uniqid('order_');

$data = [
    'amount' => $amount,
    'currency' => 'KES',
    'redirect_url' => 'payment-success.php',
    'email' => $email,
    'metadata' => array_merge(
        ['order_id' => $order_id],
        $customer_name !== '' ? ['customer_name' => substr($customer_name, 0, 120)] : [],
        $customer_phone !== '' ? ['customer_phone' => substr($customer_phone, 0, 40)] : [],
        $order_summary !== '' ? ['order_summary' => substr($order_summary, 0, 500)] : []
    ),
];

$ch = curl_init('https://api.intasend.com/api/v1/charges/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $secret_key,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$checkout_url = null;
if ($http_code == 200 && $response) {
    $result = json_decode($response, true);
    if (isset($result['checkout_url'])) {
        $checkout_url = $result['checkout_url'];
    }
}

if ($checkout_url) {
    if ($isAjax) {
        pay_json_response(true, ['checkout_url' => $checkout_url]);
    }
} else {
    if ($isAjax) {
        pay_json_response(false, ['message' => 'Unable to create payment session. Please try again.'], 502);
    }
    die('Error: Unable to create payment session.');
}

?>
<!-- Minimal HTML for non-AJAX payment redirect -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pay with IntaSend</title>
    <style>
        .pay-btn {
            background: #FF751F;
            color: #fff;
            padding: 12px 32px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .pay-btn:hover {
            background: #e06613;
        }
    </style>
</head>
<body>
    <h2>Proceed to Payment</h2>
    <a href="<?php echo htmlspecialchars($checkout_url); ?>" class="pay-btn" target="_blank" rel="noopener noreferrer">Click to Pay</a>
    <footer style="margin-top: 2.5rem; font-size: 0.85rem; color: #666;">
        <p style="margin: 0;">&copy; <?php echo date('Y'); ?> Fraittech.co.ke. All rights reserved.</p>
    </footer>
</body>
</html>
