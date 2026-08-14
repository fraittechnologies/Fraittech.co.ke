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
    // Bot traps
    $honeypot = isset($_POST['company_website']) ? trim((string) $_POST['company_website']) : '';
    if ($honeypot !== '') {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
        echo json_encode($response);
        exit;
    }

    $started = isset($_POST['form_started']) ? (int) $_POST['form_started'] : 0;
    if ($started > 0) {
        $elapsedMs = (int) round(microtime(true) * 1000) - $started;
        if ($elapsedMs >= 0 && $elapsedMs < 2500) {
            $response['message'] = 'Please take a moment to complete the form, then try again.';
            echo json_encode($response);
            exit;
        }
    }

    $challengeA = isset($_POST['challenge_a']) ? (int) $_POST['challenge_a'] : null;
    $challengeB = isset($_POST['challenge_b']) ? (int) $_POST['challenge_b'] : null;
    $challengeAnswer = isset($_POST['challenge_answer']) ? (int) $_POST['challenge_answer'] : null;
    if (
        $challengeA === null ||
        $challengeB === null ||
        $challengeAnswer === null ||
        $challengeA < 1 ||
        $challengeA > 20 ||
        $challengeB < 1 ||
        $challengeB > 20 ||
        $challengeAnswer !== ($challengeA + $challengeB)
    ) {
        $response['message'] = 'Please solve the quick check correctly before sending.';
        echo json_encode($response);
        exit;
    }

    // Get form data
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
    $subject = isset($_POST['subject']) ? trim(htmlspecialchars($_POST['subject'])) : '';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';
    $phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';

    // Validate form data
    if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
        $response['message'] = 'Please fill in all required fields with valid information.';
        echo json_encode($response);
        exit;
    }

    $phoneDigits = preg_replace('/\D+/', '', $phone);
    if ($phoneDigits === '') {
        $response['message'] = 'Please enter your phone number.';
        echo json_encode($response);
        exit;
    }
    if (strpos($phoneDigits, '254') === 0) {
        $phoneNorm = substr($phoneDigits, 0, 12);
    } elseif (isset($phoneDigits[0]) && $phoneDigits[0] === '0' && strlen($phoneDigits) >= 10) {
        $phoneNorm = '254' . substr($phoneDigits, 1, 9);
    } elseif (isset($phoneDigits[0]) && ($phoneDigits[0] === '7' || $phoneDigits[0] === '1') && strlen($phoneDigits) === 9) {
        $phoneNorm = '254' . $phoneDigits;
    } else {
        $phoneNorm = $phoneDigits;
    }
    if (!preg_match('/^254[71]\d{8}$/', $phoneNorm)) {
        $response['message'] = 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.';
        echo json_encode($response);
        exit;
    }

    if (strlen($name) < 2 || strlen($subject) < 3 || strlen($message) < 10) {
        $response['message'] = 'Please complete the required fields with enough detail.';
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
                . ft_em_row('Phone', $phone)
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
