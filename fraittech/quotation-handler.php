<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include PHPMailer and config
// Load config array
$config = require 'config.php';
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
    if (empty($clientName) || empty($clientEmail) || empty($projectDescription) || empty($budgetRange) || empty($timeline)) {
        $response['message'] = 'Please fill in all required fields with valid information.';
        echo json_encode($response);
        exit;
    }

    // Validate email format
    if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please provide a valid email address.';
        echo json_encode($response);
        exit;
    }

    try {
        // Initialize PHPMailer
        $mail = new PHPMailer(true);

        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_pass'];
        $mail->SMTPSecure = $config['smtp_secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'];
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

        $budgetReadable = isset($budgetLabels[$budgetRange]) ? $budgetLabels[$budgetRange] : $budgetRange;
        $timelineReadable = isset($timelineLabels[$timeline]) ? $timelineLabels[$timeline] : $timeline;

        // Create HTML email body
        $emailBody = "
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
                    .content { padding: 20px; }
                    .field { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .field:last-child { border-bottom: none; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>New Quotation Request</h2>
                    </div>
                    <div class='content'>
                        <h3>Client Information</h3>
                        <div class='field'>
                            <div class='label'>Name:</div>
                            <div class='value'>" . $clientName . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Email:</div>
                            <div class='value'>" . $clientEmail . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Phone:</div>
                            <div class='value'>" . (!empty($clientPhone) ? $clientPhone : 'Not provided') . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Company:</div>
                            <div class='value'>" . (!empty($clientCompany) ? $clientCompany : 'Not provided') . "</div>
                        </div>

                        <h3>Project Details</h3>
                        <div class='field'>
                            <div class='label'>Service Type:</div>
                            <div class='value'>" . (!empty($serviceType) ? $serviceType : 'Not specified') . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Estimated Price:</div>
                            <div class='value'>" . (!empty($estimatedPrice) ? $estimatedPrice : 'To be determined') . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Project Description:</div>
                            <div class='value'>" . nl2br($projectDescription) . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Budget Range:</div>
                            <div class='value'>" . $budgetReadable . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Timeline:</div>
                            <div class='value'>" . $timelineReadable . "</div>
                        </div>
                    </div>
                </div>
            </body>
        </html>";
        
        $mail->Body = $emailBody;
        $mail->AltBody = "Client: $clientName\nEmail: $clientEmail\nPhone: $clientPhone\nCompany: $clientCompany\nService: $serviceType\nDescription: $projectDescription\nBudget: $budgetReadable\nTimeline: $timelineReadable";

        // Send email
        if ($mail->send()) {
            $response['success'] = true;
            $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';

            // Optional: Send confirmation email to customer
            try {
                $confirmMail = new PHPMailer(true);
                $confirmMail->isSMTP();
                $confirmMail->Host = $config['smtp_host'];
                $confirmMail->SMTPAuth = true;
                $confirmMail->Username = $config['smtp_user'];
                $confirmMail->Password = $config['smtp_pass'];
                $confirmMail->SMTPSecure = $config['smtp_secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
                $confirmMail->Port = $config['smtp_port'];
                $confirmMail->CharSet = 'UTF-8';

                $confirmMail->setFrom($config['from_email'], $config['from_name']);
                $confirmMail->addAddress($clientEmail, $clientName);

                $confirmMail->isHTML(true);
                $confirmMail->Subject = '✓ Quotation Request Received - ' . $config['from_name'];
                $confirmMail->Body = "
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }
                            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 4px; margin-bottom: 20px; }
                            .header h2 { margin: 0; }
                            .content { color: #333; line-height: 1.6; }
                            .details-box { background-color: #f0f8ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
                            .detail-item { margin: 10px 0; }
                            .detail-label { font-weight: bold; color: #0056b3; display: inline-block; width: 120px; }
                            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
                            .contact-info { background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h2>✓ Quotation Request Received!</h2>
                            </div>
                            <div class='content'>
                                <p>Hello <strong>" . htmlspecialchars($clientName) . ",</strong></p>
                                
                                <p>Thank you for reaching out to Frait Technologies! We have successfully received your quotation request and appreciate your interest in our services.</p>
                                
                                <div class='details-box'>
                                    <p><strong>Your Request Summary:</strong></p>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Service:</span> " . htmlspecialchars(!empty($serviceType) ? $serviceType : 'As discussed') . "
                                    </div>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Budget Range:</span> " . $budgetReadable . "
                                    </div>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Timeline:</span> " . $timelineReadable . "
                                    </div>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Submitted:</span> " . date('F j, Y \a\t g:i A') . "
                                    </div>
                                    " . (!empty($clientCompany) ? "<div class='detail-item'><span class='detail-label'>Company:</span> " . htmlspecialchars($clientCompany) . "</div>" : "") . "
                                </div>
                                
                                <p><strong>Next Steps:</strong></p>
                                <ol>
                                    <li>Our team will thoroughly review your project requirements</li>
                                    <li>We'll analyze your budget range and timeline</li>
                                    <li>We'll prepare a detailed, customized quotation</li>
                                    <li>You'll receive our quotation via email within <strong>24-48 hours</strong></li>
                                </ol>
                                
                                <div class='contact-info'>
                                    <p><strong>Need to reach us sooner?</strong></p>
                                    <p>Feel free to contact us directly:<br>
                                    📞 Phone: +254 742 451 220<br>
                                    📧 Email: info@fraittechnologies.co.ke<br>
                                    📍 Location: Nanyuki, Kenya
                                    </p>
                                </div>
                                
                                <p>We're excited to work with you on this project!</p>
                                
                                <p>Best regards,<br>
                                <strong>" . $config['from_name'] . "</strong><br>
                                <small>Digital Solutions & Development</small>
                                </p>
                            </div>
                            <div class='footer'>
                                <p>This is an automated confirmation email. Our team has received your request and will be in touch shortly. Please keep this email for your reference.</p>
                            </div>
                        </div>
                    </body>
                </html>";

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
