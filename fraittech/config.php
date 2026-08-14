<?php
// config.php
//
// SMTP password: set FRAITTECH_SMTP_PASSWORD in a `.env` file (see .env.example).
// For local testing with Papercut, use the commented block at the bottom instead of this return.

require_once __DIR__ . '/env-load.php';

$smtpPass = getenv('FRAITTECH_SMTP_PASSWORD');
$smtpPass = ($smtpPass !== false && $smtpPass !== '') ? $smtpPass : '';

return [
	'environment' => 'production',
	'smtp_auth' => true,
	'smtp_host' => 'mail.fraittech.co.ke',
	'smtp_user' => 'info@fraittech.co.ke',
	'smtp_pass' => $smtpPass,
	'smtp_port' => 465,
	'smtp_secure' => 'ssl',
	'from_email' => 'info@fraittech.co.ke',
	'from_name' => 'Fraittech Limited',
	'smtp' => [
		'host' => 'mail.fraittech.co.ke',
		'username' => 'info@fraittech.co.ke',
		'password' => $smtpPass,
		'port' => 465,
		'secure' => 'ssl',
	],
	'debug' => false,
];

/*
 * --- LOCAL (Papercut / offline) — replace the return array above when testing ---
 *
require_once __DIR__ . '/env-load.php';
$smtpPass = getenv('FRAITTECH_SMTP_PASSWORD');
$smtpPass = ($smtpPass !== false && $smtpPass !== '') ? $smtpPass : '';

return [
	'environment' => 'local',
	'smtp_auth' => false,
	'smtp_host' => '127.0.0.1',
	'smtp_user' => '',
	'smtp_pass' => '',
	'smtp_port' => 25,
	'smtp_secure' => 'none',
	'from_email' => 'noreply@example.com',
	'from_name' => 'Fraittech Limited (local)',
	'smtp' => [
		'host' => '127.0.0.1',
		'username' => '',
		'password' => '',
		'port' => 25,
		'secure' => 'none',
	],
	'debug' => false,
];
*/
