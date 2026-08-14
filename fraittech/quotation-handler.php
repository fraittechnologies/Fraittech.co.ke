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
    $serviceType = isset($_POST['serviceType']) ? trim(htmlspecialchars($_POST['serviceType'])) : '';
    $estimatedPrice = isset($_POST['estimatedPrice']) ? trim(htmlspecialchars($_POST['estimatedPrice'])) : '';
    $clientName = isset($_POST['clientName']) ? trim(htmlspecialchars($_POST['clientName'])) : '';
    $clientEmail = isset($_POST['clientEmail']) ? trim(htmlspecialchars($_POST['clientEmail'])) : '';
    $clientPhone = isset($_POST['clientPhone']) ? trim(htmlspecialchars($_POST['clientPhone'])) : '';
    $clientCompany = isset($_POST['clientCompany']) ? trim(htmlspecialchars($_POST['clientCompany'])) : '';
    $projectDescription = isset($_POST['projectDescription']) ? trim(htmlspecialchars($_POST['projectDescription'])) : '';
    $budgetRange = isset($_POST['budgetRange']) ? trim(htmlspecialchars($_POST['budgetRange'])) : '';
    $timeline = isset($_POST['timeline']) ? trim(htmlspecialchars($_POST['timeline'])) : '';

    // Validate required fields
    if (empty($clientName) || empty($clientEmail) || empty($clientPhone) || empty($projectDescription) || empty($serviceType)) {
        $response['message'] = 'Please fill in all required fields with valid information.';
        echo json_encode($response);
        exit;
    }

    if (strlen($clientName) < 2) {
        $response['message'] = 'Please enter your full name.';
        echo json_encode($response);
        exit;
    }

    if (strlen($projectDescription) < 20) {
        $response['message'] = 'Please add a little more detail about what you need.';
        echo json_encode($response);
        exit;
    }

    // Validate email format
    if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please provide a valid email address.';
        echo json_encode($response);
        exit;
    }

    $phoneDigits = preg_replace('/\D+/', '', $clientPhone);
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

    $quoteFile = null;
    if (isset($_FILES['projectFile']) && is_array($_FILES['projectFile']) && (int) $_FILES['projectFile']['error'] !== UPLOAD_ERR_NO_FILE) {
        $file = $_FILES['projectFile'];
        $err = (int) $file['error'];
        if ($err !== UPLOAD_ERR_OK) {
            $response['message'] = $err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE
                ? 'The attached file is too large. Keep it under 8 MB.'
                : 'The attached file could not be uploaded. Try another file.';
            echo json_encode($response);
            exit;
        }
        $maxBytes = 8 * 1024 * 1024;
        if ((int) $file['size'] > $maxBytes || (int) $file['size'] < 1) {
            $response['message'] = 'Keep the attached file under 8 MB.';
            echo json_encode($response);
            exit;
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExt = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'zip', 'txt'];
        $mime = '';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo) {
                $mime = (string) finfo_file($finfo, $file['tmp_name']);
                finfo_close($finfo);
            }
        }
        if (!in_array($ext, $allowedExt, true)) {
            $response['message'] = 'Attach a PDF, Word, image, ZIP, or text file.';
            echo json_encode($response);
            exit;
        }
        $blockedMime = [
            'text/html',
            'text/javascript',
            'application/javascript',
            'application/x-httpd-php',
            'application/x-php',
        ];
        if ($mime !== '' && in_array($mime, $blockedMime, true)) {
            $response['message'] = 'That file type is not allowed.';
            echo json_encode($response);
            exit;
        }
        $safeName = preg_replace('/[^\w.\- ()]+/', '_', basename($file['name']));
        if ($safeName === '' || $safeName === '_' || $safeName === '.') {
            $safeName = 'attachment.' . $ext;
        }
        $quoteFile = [
            'tmp' => $file['tmp_name'],
            'name' => $safeName,
        ];
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
        $mail->addReplyTo($clientEmail, $clientName); // Reply to customer email

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Quotation Request from ' . $clientName;
        
        // Convert budget and timeline codes to readable format
        $budgetLabels = [
            'below_10k' => 'Below KES 10,000',
            '10k_30k' => 'KES 10,000 - 30,000',
            '30k_50k' => 'KES 30,000 - 50,000',
            '50k_100k' => 'KES 50,000 - 100,000',
            'above_100k' => 'Above KES 100,000'
        ];

        $timelineLabels = [
            'urgent' => 'Urgent (1-2 weeks)',
            'normal' => 'Normal (1-2 months)',
            'flexible' => 'Flexible (3+ months)'
        ];

        $budgetReadable = $budgetRange === ''
            ? 'Not specified'
            : (isset($budgetLabels[$budgetRange]) ? $budgetLabels[$budgetRange] : $budgetRange);
        $timelineReadable = $timeline === ''
            ? 'Not specified'
            : (isset($timelineLabels[$timeline]) ? $timelineLabels[$timeline] : $timeline);
        $estimatedReadable = $estimatedPrice === '' ? 'Not specified (see list / cart pricing)' : $estimatedPrice;

        $staffInner = '<p class="ft-em-lead">New quotation request from the website. Use <strong>Reply</strong> to reach the client.</p>'
            . ft_em_card('Client', ''
                . ft_em_row('Name', $clientName)
                . ft_em_row('Email', $clientEmail)
                . ft_em_row('Phone', !empty($clientPhone) ? $clientPhone : 'Not provided')
                . ft_em_row('Company', !empty($clientCompany) ? $clientCompany : 'Not provided')
            )
            . ft_em_card('Project', ''
                . ft_em_row('Service type', $serviceType)
                . ft_em_row('Estimated price', $estimatedReadable)
                . ft_em_row('Budget range', $budgetReadable)
                . ft_em_row('Timeline', $timelineReadable)
                . '<div class="ft-em-divider"></div>'
                . '<span class="ft-em-label">Project description</span><div class="ft-em-value">' . nl2br(ft_email_e($projectDescription)) . '</div>'
                . ($quoteFile ? ft_em_row('Attachment', $quoteFile['name']) : '')
            );

        $emailBody = ft_email_document(
            'Quote request: ' . $serviceType . ' — ' . $clientName,
            'Internal notification',
            'New quotation request',
            $clientName,
            $staffInner,
            ['for_customer' => false]
        );
        
        $mail->Body = $emailBody;
        $mail->AltBody = "Client: $clientName\nEmail: $clientEmail\nPhone: $clientPhone\nCompany: $clientCompany\nService: $serviceType\nDescription: $projectDescription\nBudget: $budgetReadable\nTimeline: $timelineReadable";

        if ($quoteFile) {
            $mail->addAttachment($quoteFile['tmp'], $quoteFile['name']);
        }

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
                $confirmMail->addAddress($clientEmail, $clientName);

                $confirmMail->isHTML(true);
                $confirmMail->Subject = 'Quotation request received — ' . $config['from_name'];
                $summaryRows = ft_em_row('Service', $serviceType)
                    . ft_em_row('Budget range', $budgetReadable)
                    . ft_em_row('Timeline', $timelineReadable)
                    . ft_em_row('Submitted', date('F j, Y \a\t g:i A'));
                if (!empty($clientCompany)) {
                    $summaryRows .= ft_em_row('Company', $clientCompany);
                }
                if ($quoteFile) {
                    $summaryRows .= ft_em_row('Attachment', $quoteFile['name']);
                }
                $confirmInner = '<p class="ft-em-lead">Hello <strong>' . ft_email_e($clientName) . '</strong>,</p>'
                    . '<p class="ft-em-lead" style="margin-top:0;">Thank you for your quotation request. We have received your details and will review them shortly.</p>'
                    . ft_em_highlight('Your request summary', $summaryRows)
                    . '<p class="ft-em-lead" style="margin-bottom:12px;"><strong>Next steps</strong></p>'
                    . '<ol class="ft-em-list"><li>We review your requirements and scope.</li><li>We align on timeline and options.</li><li>We send a tailored quotation.</li><li>Expect an email within <strong>24–48 hours</strong>.</li></ol>'
                    . ft_em_card('Need us sooner?', '<p class="ft-em-lead" style="margin:0;">Call <a href="tel:+254742451220">+254 742 451 220</a> or email <a href="mailto:info@fraittech.co.ke">info@fraittech.co.ke</a>.</p>')
                    . '<p class="ft-em-lead" style="margin-top:24px;margin-bottom:0;">Best regards,<br><strong>' . ft_email_e($config['from_name']) . '</strong><br><span style="color:#64748b;font-size:14px;">Digital solutions &amp; development</span></p>';

                $confirmMail->Body = ft_email_document(
                    'Your quotation request is with our team.',
                    'Thank you',
                    "We've received your quotation request",
                    null,
                    $confirmInner,
                    [
                        'for_customer' => true,
                        'footer_note' => 'Automated confirmation — keep this email for your records. Our team will follow up at the address you provided.',
                    ]
                );

                $confirmMail->send();
            } catch (Exception $e) {
                // Confirmation email failed, but main email was sent
                if (!empty($config['debug'])) {
                    error_log('Confirmation email failed: ' . $confirmMail->ErrorInfo);
                }
            }
        }
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = 'Sorry! There was an error sending your message. Please try again later.';
        if (!empty($config['debug'])) {
            $response['error_details'] = $mail->ErrorInfo;
        }
        error_log('Quotation form error: ' . $e->getMessage());
    }
} else {
    $response['message'] = 'Invalid request method.';
}

// Return JSON response
echo json_encode($response);
?>
