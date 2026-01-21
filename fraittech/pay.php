<?php
// pay.php
// IntaSend payment integration using PHP and cURL

// Use IntaSend API keys from payment-handler.php
require_once __DIR__ . '/payment-handler.php';
$secret_key = $SECRET_KEY;
$public_key = $PUBLIC_KEY;

// Get payment amount and email from POST or GET
$amount = isset($_POST['amount']) ? $_POST['amount'] : (isset($_GET['amount']) ? $_GET['amount'] : '');
$email = isset($_POST['email']) ? $_POST['email'] : (isset($_GET['email']) ? $_GET['email'] : '');

// Basic validation
if (!$amount || !is_numeric($amount)) {
    die("Invalid amount.");
}

// Generate a unique order ID for metadata
$order_id = uniqid("order_");

// Prepare data for IntaSend API
$data = [
    "amount" => $amount,
    "currency" => "KES",
    "redirect_url" => "payment-success.php",
    "email" => $email,
    "metadata" => [
        "order_id" => $order_id
    ]
];

// Initialize cURL
$ch = curl_init("https://api.intasend.com/api/v1/charges/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $secret_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// Execute API call
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle API response
if ($http_code == 200 && $response) {
    $result = json_decode($response, true);
    if (isset($result['checkout_url'])) {
        $checkout_url = $result['checkout_url'];
    } else {
        die("Error: Invalid response from IntaSend.");
    }
} else {
    die("Error: Unable to create payment session.");
}
?>

<!-- Minimal HTML for payment button -->
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
    <a href="<?php echo htmlspecialchars($checkout_url); ?>" class="pay-btn" target="_blank">Click to Pay</a>
</body>
</html>
