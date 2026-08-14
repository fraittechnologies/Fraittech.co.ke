<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include PHPMailer and config
// Load config array
$config = require 'config.php';
require_once __DIR__ . '/smtp-helper.php';
require_once __DIR__ . '/email-layout.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set response headers
header('Content-Type: application/json');

// Initialize response
$response = [
    'success' => false,
    'message' => 'Sorry! There was an error sending your message. Please try again later.'
];

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
    $subject = isset($_POST['subject']) ? trim(htmlspecialchars($_POST['subject'])) : '';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

    // Validate form data
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $response['message'] = 'Please fill in all required fields with valid information.';
        echo json_encode($response);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please provide a valid email address.';
        echo json_encode($response);
        exit;
    }

    try {
        // Initialize PHPMailer
        $mail = new PHPMailer(true);

        // SMTP configuration
        $mail->isSMTP();
        ft_configure_phpmailer_smtp($mail, $config);
        $mail->CharSet = 'UTF-8';

        // Set email parameters
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($config['from_email'], $config['from_name']); // Send to company email
        $mail->addReplyTo($email, $name); // Reply to customer email

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission: ' . $subject;
        
        $staffInner = '<p class="ft-em-lead">Someone submitted the contact form on the website. Reply directly to the sender using the address below.</p>'
            . ft_em_card('Contact', ''
                . ft_em_row('Name', $name)
                . ft_em_row('Email', $email)
                . ft_em_row('Subject', $subject)
            )
            . ft_em_card('Message', '<div class="ft-em-value">' . nl2br(ft_email_e($message)) . '</div>');

        $emailBody = ft_email_document(
            'New contact: ' . $subject,
            'Internal notification',
            'New contact form message',
            $subject,
            $staffInner,
            ['for_customer' => false]
        );
        
        $mail->Body = $emailBody;
        $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message";

        // Send email
        if ($mail->send()) {
            $response['success'] = true;
            $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';

            // Optional: Send confirmation email to customer
            try {
                $confirmMail = new PHPMailer(true);
                $confirmMail->isSMTP();
                ft_configure_phpmailer_smtp($confirmMail, $config);
                $confirmMail->CharSet = 'UTF-8';

                $confirmMail->setFrom($config['from_email'], $config['from_name']);
                $confirmMail->addAddress($email, $name);

                $confirmMail->isHTML(true);
                $confirmMail->Subject = 'We received your message — ' . $config['from_name'];
                $confirmInner = '<p class="ft-em-lead">Hello <strong>' . ft_email_e($name) . '</strong>,</p>'
                    . '<p class="ft-em-lead" style="margin-top:0;">Thank you for contacting <strong>Fraittech</strong>. We have received your message and will review it shortly.</p>'
                    . ft_em_highlight('Your submission', ''
                        . ft_em_row('Subject', $subject)
                        . ft_em_row('Received', date('F j, Y \a\t g:i A'))
                    )
                    . '<p class="ft-em-lead" style="margin-bottom:12px;"><strong>What happens next</strong></p>'
                    . '<ul class="ft-em-list"><li>Our team reviews your message.</li><li>We reply within <strong>24–48 business hours</strong> at <strong>' . ft_email_e($email) . '</strong>.</li><li>For urgent matters, call <a href="tel:+254742451220">+254 742 451 220</a>.</li></ul>'
                    . '<p class="ft-em-lead" style="margin-top:24px;margin-bottom:0;">Best regards,<br><strong>' . ft_email_e($config['from_name']) . '</strong></p>';

                $confirmMail->Body = ft_email_document(
                    'We received your message and will reply soon.',
                    'Thank you',
                    "We've received your message",
                    null,
                    $confirmInner,
                    [
                        'for_customer' => true,
                        'footer_note' => 'Automated confirmation — your message was delivered to our team. Prefer not to use this inbox? Write to info@fraittech.co.ke.',
                    ]
                );

                $confirmMail->send();
            } catch (Exception $e) {
                // Confirmation email failed, but main email was sent
                if (!empty($config['debug'])) {
                    error_log('Confirmation email failed: ' . $confirmMail->ErrorInfo);
                }
            }
            // Always return JSON response after main email is sent
            echo json_encode($response);
            exit;
        }
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = 'Sorry! There was an error sending your message. Please try again later.';
        if (!empty($config['debug'])) {
            $response['error_details'] = $mail->ErrorInfo;
        }
        error_log('Contact form error: ' . $e->getMessage());
    }
} else {
    $response['message'] = 'Invalid request method.';
}

// Return JSON response
echo json_encode($response);
?>
