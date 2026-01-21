<?php
// payment-success.php
$status = isset($_GET['status']) ? $_GET['status'] : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Status</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 80px; }
        .success { color: #00C853; font-size: 1.5em; }
        .failed { color: #FF1744; font-size: 1.5em; }
    </style>
</head>
<body>
    <?php if ($status === 'successful'): ?>
        <div class="success">Payment Successful! Thank you.</div>
    <?php else: ?>
        <div class="failed">Payment Failed. Please try again.</div>
    <?php endif; ?>
</body>
</html>
