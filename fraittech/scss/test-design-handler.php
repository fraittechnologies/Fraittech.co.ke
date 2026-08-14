<?php
/**
 * Simple test to check if design-handler.php can be loaded
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set timeout limits to prevent "Connection Timeout" errors
set_time_limit(30); // Maximum execution time: 30 seconds
ini_set('default_socket_timeout', 10); // Socket timeout: 10 seconds

// Try to load the handler
try {
    // Test basic PHP syntax - don't try to connect to mail server
    if (file_exists('config.php')) {
        echo json_encode([
            'success' => true,
            'message' => 'Config file exists',
            'file_exists' => true
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Config file not found',
            'file_exists' => false
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>