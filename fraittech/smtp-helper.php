<?php

/**
 * Apply SMTP settings from config.php to PHPMailer.
 * Supports Papercut / local catchers: smtp_auth false, smtp_secure "none", port 25.
 */
function ft_configure_phpmailer_smtp(\PHPMailer\PHPMailer\PHPMailer $mail, array $config, bool $useNestedSmtpKeys = false): void
{
	if ($useNestedSmtpKeys && !empty($config['smtp']) && is_array($config['smtp'])) {
		$host = (string) ($config['smtp']['host'] ?? $config['smtp_host']);
		$user = (string) ($config['smtp']['username'] ?? $config['smtp_user']);
		$pass = (string) ($config['smtp']['password'] ?? $config['smtp_pass']);
		$port = (int) ($config['smtp']['port'] ?? $config['smtp_port']);
		$secure = $config['smtp']['secure'] ?? ($config['smtp_secure'] ?? 'ssl');
	} else {
		$host = (string) $config['smtp_host'];
		$user = (string) $config['smtp_user'];
		$pass = (string) $config['smtp_pass'];
		$port = (int) $config['smtp_port'];
		$secure = $config['smtp_secure'] ?? 'ssl';
	}

	$mail->Host = $host;
	$auth = $config['smtp_auth'] ?? true;
	$mail->SMTPAuth = (bool) $auth;
	if ($auth) {
		$mail->Username = $user;
		$mail->Password = $pass;
	}

	$sec = is_string($secure) ? strtolower((string) $secure) : $secure;
	if ($sec === 'ssl') {
		$mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
		$mail->SMTPAutoTLS = true;
	} elseif ($sec === 'tls') {
		$mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
		$mail->SMTPAutoTLS = true;
	} else {
		$mail->SMTPSecure = false;
		// PHPMailer upgrades to STARTTLS when the server offers it unless host is exactly
		// "localhost". Using 127.0.0.1 + Papercut often breaks on that handshake.
		$mail->SMTPAutoTLS = false;
	}
	$mail->Port = $port;
}
