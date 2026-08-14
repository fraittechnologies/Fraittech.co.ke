<?php
// newsletter-handler.php
// Handles newsletter subscription form submissions

// Load SMTP config
$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/smtp-helper.php';
require_once __DIR__ . '/email-layout.php';

// Check if form is submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    // Prepare email
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
    require __DIR__ . '/PHPMailer/src/Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    try {
        // SMTP settings
        $mail->isSMTP();
        ft_configure_phpmailer_smtp($mail, $config);

        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($config['from_email']); // Send to site admin
        $mail->addReplyTo($email);

        $mail->isHTML(true);
        $mail->Subject = 'New newsletter subscription';
        $inner = '<p class="ft-em-lead">A visitor subscribed to updates on the website.</p>'
            . ft_em_card('Subscriber', ft_em_row('Email', $email));
        $mail->Body = ft_email_document(
            'New subscriber: ' . $email,
            'Internal notification',
            'New newsletter signup',
            null,
            $inner,
            ['for_customer' => false]
        );

        if ($mail->send()) {
            try {
                $sub = new PHPMailer\PHPMailer\PHPMailer(true);
                $sub->isSMTP();
                ft_configure_phpmailer_smtp($sub, $config);
                $sub->CharSet = 'UTF-8';
                $sub->setFrom($config['from_email'], $config['from_name']);
                $sub->addAddress($email);
                $sub->addReplyTo('info@fraittech.co.ke', 'Fraittech');
                $sub->isHTML(true);
                $sub->Subject = "You're subscribed — Fraittech updates";
                $subInner = '<p class="ft-em-lead">Thanks for joining our mailing list.</p>'
                    . '<p class="ft-em-lead" style="margin-top:0;">We will share news and useful tips from <strong>Fraittech</strong> occasionally. You can unsubscribe anytime using the link in future emails (when we add one), or by writing to <a href="mailto:info@fraittech.co.ke">info@fraittech.co.ke</a>.</p>'
                    . ft_em_card('Your email', ft_em_row('Subscribed as', $email));
                $sub->Body = ft_email_document(
                    "You're on the list.",
                    'Thank you',
                    'Subscription confirmed',
                    null,
                    $subInner,
                    ['for_customer' => true, 'footer_note' => 'Automated confirmation of your newsletter signup.']
                );
                $sub->send();
            } catch (Exception $e) {
                if (!empty($config['debug'])) {
                    error_log('Newsletter subscriber confirmation failed: ' . $e->getMessage());
                }
            }
            echo json_encode(['status' => 'success', 'message' => 'Thank you for subscribing!']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to send email.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
    }
    exit;
}

// If not POST, show error
header('Content-Type: application/json; charset=utf-8');
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
exit;
