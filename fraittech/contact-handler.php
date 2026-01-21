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
        $mail->addReplyTo($email, $name); // Reply to customer email

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission: ' . $subject;
        
        // Create HTML email body
        $emailBody = "
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
                    .content { padding: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>New Contact Form Submission</h2>
                    </div>
                    <div class='content'>
                        <div class='field'>
                            <div class='label'>Name:</div>
                            <div class='value'>" . $name . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Email:</div>
                            <div class='value'>" . $email . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Subject:</div>
                            <div class='value'>" . $subject . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Message:</div>
                            <div class='value'>" . nl2br($message) . "</div>
                        </div>
                    </div>
                </div>
            </body>
           
        </html>";
        
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
                $confirmMail->Host = $config['smtp_host'];
                $confirmMail->SMTPAuth = true;
                $confirmMail->Username = $config['smtp_user'];
                $confirmMail->Password = $config['smtp_pass'];
                $confirmMail->SMTPSecure = $config['smtp_secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
                $confirmMail->Port = $config['smtp_port'];
                $confirmMail->CharSet = 'UTF-8';

                $confirmMail->setFrom($config['from_email'], $config['from_name']);
                $confirmMail->addAddress($email, $name);

                $confirmMail->isHTML(true);
                $confirmMail->Subject = '✓ Message Received - ' . $config['from_name'];
                $confirmMail->Body = "
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
                            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }
                            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 4px; margin-bottom: 20px; }
                            .header h2 { margin: 0; }
                            .content { color: #333; line-height: 1.6; }
                            .details-box { background-color: #f9f9f9; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                            .detail-item { margin: 8px 0; }
                            .detail-label { font-weight: bold; color: #555; }
                            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h2>✓ We've Received Your Message!</h2>
                            </div>
                            <div class='content'>
                                <p>Hello <strong>" . htmlspecialchars($name) . ",</strong></p>
                                
                                <p>Thank you for contacting Frait Technologies! We have successfully received your message and will review it shortly.</p>
                                
                                <div class='details-box'>
                                    <p><strong>Your Message Details:</strong></p>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Subject:</span> " . htmlspecialchars($subject) . "
                                    </div>
                                    <div class='detail-item'>
                                        <span class='detail-label'>Received:</span> " . date('F j, Y \a\t g:i A') . "
                                    </div>
                                </div>
                                
                                <p>Our team is committed to providing excellent service. We typically respond to inquiries within 24-48 hours during business days.</p>
                                
                                <p><strong>What Happens Next?</strong></p>
                                <ul>
                                    <li>We will carefully review your message</li>
                                    <li>Our team will reach out to you at <strong>" . htmlspecialchars($email) . "</strong></li>
                                    <li>If you have any urgent matters, feel free to call us at +254 742 451 220</li>
                                </ul>
                                
                                <p>Best regards,<br>
                                <strong>" . $config['from_name'] . "</strong><br>
                                <small>info@fraittechnologies.co.ke | Nanyuki, Kenya</small>
                                </p>
                            </div>
                            <div class='footer'>
                                <p>This is an automated confirmation email. Please do not reply to this email. Your original message has been forwarded to our team.</p>
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
