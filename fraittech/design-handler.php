<?php
/**
 * Design Brief Form Handler
 * Processes both the Design Builder and Design Brief submissions
 * 
 * Features:
 * - Handles Design Builder submissions (existing functionality)
 * - Handles Design Brief form submissions (new functionality)
 * - Validates input data
 * - Handles file uploads securely
 * - Sends detailed emails with attachments
 * - Returns JSON responses for AJAX handling
 */

// Capture stray output from included files (leading whitespace/BOM before <?php, notices)
// so the AJAX client always receives valid JSON.
ob_start();

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set timeout limits to prevent timeout errors
set_time_limit(30); // Maximum execution time: 30 seconds
ini_set('default_socket_timeout', 10); // Socket timeout: 10 seconds

// Load configuration and PHPMailer (always relative to this script — not the process CWD)
$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/smtp-helper.php';
require_once __DIR__ . '/email-layout.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;

// Set response headers for JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response
$response = [
    'success' => false,
    'message' => 'An error occurred. Please try again later.'
];

/**
 * Main execution
 */
try {
    // Check if request method is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method. Please use POST.');
    }

    // Log incoming request for debugging
    error_log('Design Handler - POST fields: ' . implode(', ', array_keys($_POST)));
    error_log('Design Handler - FILES: ' . implode(', ', array_keys($_FILES)));

    // Determine which form was submitted
    if (isset($_POST['brandName'])) {
        // New Design Brief Form submission
        $response = handleDesignBriefSubmission();
    } elseif (isset($_POST['designData'])) {
        // Existing Design Builder submission
        $response = handleDesignBuilderSubmission();
    } else {
        throw new Exception('Invalid form submission. Missing required fields.');
    }

} catch (Throwable $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
    error_log('Design Handler Exception: ' . $e->getMessage());
}

while (ob_get_level() > 0) {
    ob_end_clean();
}

// Send JSON response (never echo notices/HTML before this point)
$jsonFlags = JSON_UNESCAPED_UNICODE;
if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
    $jsonFlags |= JSON_INVALID_UTF8_SUBSTITUTE;
}
$json = json_encode($response, $jsonFlags);
if ($json === false) {
    $json = '{"success":false,"message":"Server encoding error."}';
}
echo $json;
exit;

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Validate design data structure and required fields
 * @param array $data Design data array
 * @throws Exception if validation fails
 */
function validateDesignData($data) {
    // Check if sections array exists and has items
    if (!isset($data['sections']) || !is_array($data['sections']) || count($data['sections']) === 0) {
        throw new Exception('Please select at least one website section.');
    }

    // Check if colors are provided
    if (!isset($data['colors']['primary']) || !isset($data['colors']['secondary'])) {
        throw new Exception('Color information is missing.');
    }

    // Validate hex color format
    if (!preg_match('/^#[0-9A-F]{6}$/i', $data['colors']['primary']) ||
        !preg_match('/^#[0-9A-F]{6}$/i', $data['colors']['secondary'])) {
        throw new Exception('Invalid color format.');
    }

    // Check if font is provided
    if (!isset($data['font']) || empty($data['font'])) {
        throw new Exception('Font selection is missing.');
    }

    // Validate contact email if contact section is selected
    if (in_array('contact', $data['sections'])) {
        if (!isset($data['content']['contact']['email']) ||
            !filter_var($data['content']['contact']['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Valid contact email is required.');
        }
    }
}

// ========================================
// FILE HANDLING FUNCTIONS
// ========================================

/**
 * Detect MIME type for an uploaded temp file without requiring ext-fileinfo (often missing on minimal local PHP on Windows).
 * Falls back to mime_content_type() or a conservative extension map limited to $allowList.
 *
 * @param string[] $allowList e.g. ['image/jpeg', 'application/pdf']
 */
function ft_upload_detect_mime(string $tmpPath, string $originalName, array $allowList): ?string
{
    $mime = null;
    if (is_file($tmpPath) && function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mime = finfo_file($finfo, $tmpPath);
            finfo_close($finfo);
        }
    }
    if ((!is_string($mime) || $mime === '' || $mime === 'application/octet-stream') && function_exists('mime_content_type')) {
        $detected = @mime_content_type($tmpPath);
        if (is_string($detected) && $detected !== '') {
            $mime = $detected;
        }
    }
    if (is_string($mime) && $mime !== '' && in_array($mime, $allowList, true)) {
        return $mime;
    }
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $map = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'gif' => 'image/gif', 'webp' => 'image/webp', 'svg' => 'image/svg+xml',
        'pdf' => 'application/pdf', 'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    $guess = $map[$ext] ?? null;
    if ($guess && in_array($guess, $allowList, true)) {
        return $guess;
    }
    return null;
}

/**
 * Handle PDF file upload
 * @param array $file $_FILES array element
 * @return string Path to uploaded file
 * @throws Exception if upload fails
 */
function handlePDFUpload($file) {
    // Validate file type
    $allowedTypes = ['application/pdf'];
    $mimeType = ft_upload_detect_mime($file['tmp_name'], $file['name'], $allowedTypes);
    if ($mimeType === null) {
        throw new Exception('Invalid file type. Only PDF files are allowed.');
    }

    // Validate file size (max 10MB)
    $maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if ($file['size'] > $maxSize) {
        throw new Exception('File size exceeds maximum limit of 10MB.');
    }

    // Create temporary file path
    $tempDir = sys_get_temp_dir();
    $fileName = 'design_' . uniqid() . '_' . time() . '.pdf';
    $filePath = $tempDir . DIRECTORY_SEPARATOR . $fileName;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception('Failed to save PDF file.');
    }

    return $filePath;
}

/**
 * Handle logo data URL and save as temporary file
 * @param string $dataURL Base64 encoded image data URL
 * @return string Path to saved logo file
 * @throws Exception if save fails
 */
function handleLogoData($dataURL) {
    // Extract base64 data
    if (!preg_match('/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/i', $dataURL, $matches)) {
        throw new Exception('Invalid logo data format.');
    }

    $imageType = $matches[1];
    $imageData = base64_decode($matches[2]);

    if ($imageData === false) {
        throw new Exception('Failed to decode logo data.');
    }

    // Create temporary file
    $tempDir = sys_get_temp_dir();
    $fileName = 'logo_' . uniqid() . '.' . $imageType;
    $filePath = $tempDir . DIRECTORY_SEPARATOR . $fileName;

    // Save logo file
    if (file_put_contents($filePath, $imageData) === false) {
        throw new Exception('Failed to save logo file.');
    }

    return $filePath;
}

// ========================================
// EMAIL FUNCTIONS
// ========================================

/**
 * Send design submission email with PHPMailer
 * @param array $designData Design configuration data
 * @param string|null $pdfPath Path to PDF file
 * @param string|null $logoPath Path to logo file
 * @param array $config Email configuration
 * @return bool True if email sent successfully
 */
function sendDesignEmail($designData, $pdfPath, $logoPath, $config) {
    try {
        // Initialize PHPMailer
        $mail = new PHPMailer(true);

        // Set timeouts for SMTP connection
        $mail->Timeout = 10; // PHPMailer timeout
        $mail->SMTPDebug = 0; // Disable debug output

        // SMTP configuration
        $mail->isSMTP();
        ft_configure_phpmailer_smtp($mail, $config);
        $mail->CharSet = 'UTF-8';

        // Email recipients
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($config['from_email'], $config['from_name']); // Send to company

        // Add reply-to if contact email is provided
        if (isset($designData['content']['contact']['email'])) {
            $mail->addReplyTo($designData['content']['contact']['email']);
        }

        // Email subject
        $mail->Subject = 'New Website Design Submission - Fraittech Design Builder';

        // Attach PDF if available
        if ($pdfPath && file_exists($pdfPath)) {
            $mail->addAttachment($pdfPath, 'website-design.pdf');
        }

        // Attach logo if available
        if ($logoPath && file_exists($logoPath)) {
            $mail->addAttachment($logoPath, 'logo' . pathinfo($logoPath, PATHINFO_EXTENSION));
        }

        // Build HTML email body
        $mail->isHTML(true);
        $mail->Body = buildEmailBody($designData);
        $mail->AltBody = buildTextEmailBody($designData);

        // Send email
        return $mail->send();

    } catch (Exception $e) {
        error_log('PHPMailer Error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Build HTML email body
 * @param array $designData Design configuration data
 * @return string HTML email body
 */
function buildEmailBody($designData) {
    $sectionsText = implode(', ', array_map('ucfirst', $designData['sections']));
    $timestamp = date('F j, Y, g:i a', strtotime($designData['timestamp']));
    $primaryHex = ft_email_hex_color($designData['colors']['primary'] ?? '#4a9bd4');
    $secondaryHex = ft_email_hex_color($designData['colors']['secondary'] ?? '#70b4e9');
    $primaryRaw = $designData['colors']['primary'] ?? '';
    $secondaryRaw = $designData['colors']['secondary'] ?? '';
    $font = $designData['font'] ?? '';

    $inner = '<p class="ft-em-lead">A new website design was submitted from the <strong>Design Builder</strong>. A PDF preview is attached when provided.</p>'
        . '<p class="ft-em-lead" style="margin-top:0;"><strong>Submitted</strong> · ' . ft_email_e($timestamp) . '</p>'
        . ft_em_card('Selected sections', '<p class="ft-em-value" style="margin:0;">' . ft_email_e($sectionsText) . '</p>')
        . ft_em_card('Colour scheme', ''
            . '<p class="ft-em-value" style="margin:0 0 12px;">Primary <span class="ft-em-color-swatch" style="background-color:' . $primaryHex . ';"></span> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">' . ft_email_e($primaryRaw) . '</code></p>'
            . '<p class="ft-em-value" style="margin:0;">Secondary <span class="ft-em-color-swatch" style="background-color:' . $secondaryHex . ';"></span> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">' . ft_email_e($secondaryRaw) . '</code></p>'
        )
        . ft_em_card('Typography', '<p class="ft-em-value" style="margin:0;font-family:' . ft_email_e($font) . ',system-ui,sans-serif;">Font · <strong>' . ft_email_e($font) . '</strong></p>');

    foreach ($designData['sections'] as $section) {
        if (isset($designData['content'][$section])) {
            $inner .= buildSectionContent($section, $designData['content'][$section]);
        }
    }

    $attachLines = '• Website design PDF (if generated)<br>';
    if (isset($designData['content']['contact'])) {
        $attachLines .= '• Logo image (if provided)<br>';
    }
    $inner .= ft_em_card('Attachments', '<p class="ft-em-value" style="margin:0;">' . $attachLines . '</p>');

    return ft_email_document(
        'New design builder submission',
        'Internal notification',
        'New website design submission',
        'Design Builder',
        $inner,
        ['for_customer' => false, 'footer_note' => 'Automated message from the Fraittech Design Builder.']
    );
}

/**
 * Build section content HTML
 * @param string $section Section name
 * @param array $content Section content data
 * @return string HTML for section content
 */
function buildSectionContent($section, $content) {
    $sectionTitle = ucfirst($section) . ' section';
    $body = '';
    foreach ($content as $key => $value) {
        $body .= ft_em_row(ucfirst(str_replace('_', ' ', (string) $key)), (string) $value);
    }
    return ft_em_card($sectionTitle, $body);
}

/**
 * Build plain text email body (fallback)
 * @param array $designData Design configuration data
 * @return string Plain text email body
 */
function buildTextEmailBody($designData) {
    $text = "NEW WEBSITE DESIGN SUBMISSION\n";
    $text .= "================================\n\n";
    $text .= "Submission Time: " . date('F j, Y, g:i a', strtotime($designData['timestamp'])) . "\n\n";
    $text .= "SELECTED SECTIONS:\n";
    $text .= implode(', ', array_map('ucfirst', $designData['sections'])) . "\n\n";
    $text .= "COLOR SCHEME:\n";
    $text .= "Primary Color: {$designData['colors']['primary']}\n";
    $text .= "Secondary Color: {$designData['colors']['secondary']}\n\n";
    $text .= "FONT: {$designData['font']}\n\n";

    foreach ($designData['sections'] as $section) {
        if (isset($designData['content'][$section])) {
            $text .= strtoupper($section) . " SECTION:\n";
            foreach ($designData['content'][$section] as $key => $value) {
                $text .= ucfirst($key) . ": {$value}\n";
            }
            $text .= "\n";
        }
    }

    $text .= "Please check the attached PDF for the visual design preview.\n";
    return $text;
}

/**
 * ============================================================================
 * DESIGN BRIEF FORM HANDLER FUNCTIONS (NEW)
 * ============================================================================
 */

/**
 * Handle Design Brief form submission
 */
function handleDesignBriefSubmission() {
    try {
        // Validate and sanitize input data
        $data = validateBriefInputData();
        
        // Handle file uploads
        $uploadedFiles = handleBriefFileUploads();
        
        // Send email to site owner with full details
        sendBriefOwnerEmail($data, $uploadedFiles);
        
        // Send confirmation email to client
        sendBriefClientEmail($data, $uploadedFiles);
        
        // Return success response
        return [
            'success' => true,
            'message' => 'Design brief submitted successfully! We will contact you within 24 hours.'
        ];
        
    } catch (Exception $e) {
        // Log error
        error_log('Design Brief Error: ' . $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
        
        // Return error response with actual error message for debugging
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}

/**
 * Validate and sanitize Design Brief input data
 */
function validateBriefInputData() {
    $requiredFields = ['brandName', 'clientEmail', 'clientPhone', 'websiteGoals', 'targetAudience'];
    
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Required field missing: $field");
        }
    }
    
    // Validate email
    $email = filter_var($_POST['clientEmail'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new Exception('Invalid email address');
    }
    
    // Sanitize and collect data
    $data = [
        'brandName' => htmlspecialchars(trim($_POST['brandName'])),
        'clientEmail' => $email,
        'clientPhone' => htmlspecialchars(trim($_POST['clientPhone'])),
        'socialFacebook' => filter_var($_POST['socialFacebook'] ?? '', FILTER_SANITIZE_URL),
        'socialTwitter' => filter_var($_POST['socialTwitter'] ?? '', FILTER_SANITIZE_URL),
        'socialInstagram' => filter_var($_POST['socialInstagram'] ?? '', FILTER_SANITIZE_URL),
        'primaryColor' => htmlspecialchars($_POST['primaryColor'] ?? '#2C3E50'),
        'secondaryColor' => htmlspecialchars($_POST['secondaryColor'] ?? '#3498DB'),
        'accentColor' => htmlspecialchars($_POST['accentColor'] ?? '#E74C3C'),
        'headingFont' => htmlspecialchars($_POST['headingFont'] ?? 'Poppins'),
        'bodyFont' => htmlspecialchars($_POST['bodyFont'] ?? 'Open Sans'),
        'websiteGoals' => htmlspecialchars(trim($_POST['websiteGoals'])),
        'targetAudience' => htmlspecialchars(trim($_POST['targetAudience'])),
        'competitors' => htmlspecialchars(trim($_POST['competitors'] ?? '')),
        'sections' => $_POST['sections'] ?? [],
        'additionalNotes' => htmlspecialchars(trim($_POST['additionalNotes'] ?? '')),
        'submissionDate' => date('Y-m-d H:i:s')
    ];
    
    return $data;
}

/**
 * Handle Design Brief file uploads securely
 */
function handleBriefFileUploads() {
    $uploadedFiles = [
        'logo' => null,
        'media' => [],
        'assets' => []
    ];
    
    // Create uploads directory if it doesn't exist
    $uploadDir = 'uploads/design-briefs/' . date('Y-m-d') . '/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create uploads directory. Check server permissions.');
        }
    }
    
    // Allowed file types
    $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    $allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $allowedTypes = array_merge($allowedImageTypes, $allowedDocTypes);
    
    // Maximum file sizes
    $maxImageSize = 5 * 1024 * 1024; // 5MB
    $maxDocSize = 10 * 1024 * 1024; // 10MB
    
    // Handle logo upload - check both 'logo' and direct file name
    $logoFile = null;
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $logoFile = $_FILES['logo'];
    }
    
    if ($logoFile) {
        $file = $logoFile;
        
        // Log file info for debugging
        error_log('Logo file: ' . $file['name'] . ' Type: ' . $file['type'] . ' Size: ' . $file['size']);
        
        $mimeType = ft_upload_detect_mime($file['tmp_name'], $file['name'], $allowedImageTypes);
        error_log('Detected MIME type: ' . ($mimeType ?? '(none)'));
        
        if ($mimeType && $file['size'] <= $maxImageSize) {
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'logo_' . uniqid() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $uploadedFiles['logo'] = [
                    'name' => $file['name'],
                    'path' => $filepath,
                    'type' => $mimeType,
                    'size' => $file['size']
                ];
                error_log('Logo uploaded successfully to: ' . $filepath);
            } else {
                error_log('Failed to move logo file to: ' . $filepath);
            }
        } else {
            error_log('Logo validation failed - MIME: ' . $mimeType . ', Size: ' . $file['size'] . ' (max: ' . $maxImageSize . ')');
        }
    } else {
        error_log('No logo file received in upload');
    }
    
    // Handle media uploads (multiple files)
    foreach ($_FILES as $key => $file) {
        if (strpos($key, 'media_') === 0 && isset($file['error']) && $file['error'] === UPLOAD_ERR_OK) {
            $mimeType = ft_upload_detect_mime($file['tmp_name'], $file['name'], $allowedImageTypes);
            if ($mimeType && $file['size'] <= $maxImageSize) {
                $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'media_' . uniqid() . '.' . $extension;
                $filepath = $uploadDir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $uploadedFiles['media'][] = [
                        'name' => $file['name'],
                        'path' => $filepath,
                        'type' => $mimeType,
                        'size' => $file['size']
                    ];
                }
            }
        }
    }
    
    // Handle brand assets uploads
    foreach ($_FILES as $key => $file) {
        if (strpos($key, 'assets_') === 0 && isset($file['error']) && $file['error'] === UPLOAD_ERR_OK) {
            $mimeType = ft_upload_detect_mime($file['tmp_name'], $file['name'], $allowedTypes);
            $maxSize = ($mimeType && in_array($mimeType, $allowedImageTypes)) ? $maxImageSize : $maxDocSize;
            
            if ($mimeType && in_array($mimeType, $allowedTypes) && $file['size'] <= $maxSize) {
                $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'asset_' . uniqid() . '.' . $extension;
                $filepath = $uploadDir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $uploadedFiles['assets'][] = [
                        'name' => $file['name'],
                        'path' => $filepath,
                        'type' => $mimeType,
                        'size' => $file['size']
                    ];
                }
            }
        }
    }
    
    return $uploadedFiles;
}

/**
 * Send detailed email to site owner about Design Brief
 */
function sendBriefOwnerEmail($data, $uploadedFiles) {
    global $config;
    $mail = new PHPMailer(true);
    
    try {
        // Set timeouts for SMTP connection
        $mail->Timeout = 10; // PHPMailer timeout
        $mail->SMTPDebug = 0; // Disable debug output

        // SMTP Configuration
        $mail->isSMTP();
        ft_configure_phpmailer_smtp($mail, $config, true);
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom($config['from_email'], 'Fraittech Design Briefs');
        $mail->addAddress('info@fraittech.co.ke', 'Fraittech');
        $mail->addReplyTo($data['clientEmail'], $data['brandName']);
        
        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Design Brief Submission - ' . $data['brandName'];
        $mail->Body = generateBriefOwnerEmailHTML($data, $uploadedFiles);
        $mail->AltBody = generateBriefOwnerEmailPlainText($data);
        
        // Attach uploaded files
        if ($uploadedFiles['logo']) {
            $mail->addAttachment($uploadedFiles['logo']['path'], $uploadedFiles['logo']['name']);
        }
        
        foreach ($uploadedFiles['media'] as $file) {
            $mail->addAttachment($file['path'], $file['name']);
        }
        
        foreach ($uploadedFiles['assets'] as $file) {
            $mail->addAttachment($file['path'], $file['name']);
        }
        
        // Send email
        $mail->send();
        error_log('Design brief owner email sent successfully');
        
    } catch (Exception $e) {
        error_log('Failed to send owner email: ' . $e->getMessage());
        throw new Exception('Failed to send email notification. Error: ' . $mail->ErrorInfo);
    }
}

/**
 * Send confirmation email to client
 */
function sendBriefClientEmail($data, $uploadedFiles) {
    global $config;
    $mail = new PHPMailer(true);
    
    try {
        // Set timeouts for SMTP connection
        $mail->Timeout = 10; // PHPMailer timeout
        $mail->SMTPDebug = 0; // Disable debug output

        // SMTP Configuration
        $mail->isSMTP();
        ft_configure_phpmailer_smtp($mail, $config, true);
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom($config['from_email'], 'Fraittech');
        $mail->addAddress($data['clientEmail'], $data['brandName']);
        $mail->addReplyTo('info@fraittech.co.ke', 'Fraittech');
        
        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Design brief received — ' . $data['brandName'];
        $mail->Body = generateBriefClientEmailHTML($data);
        $mail->AltBody = generateBriefClientEmailPlainText($data);
        
        // Send email
        $mail->send();
        error_log('Design brief client confirmation email sent successfully');
        
    } catch (Exception $e) {
        // Log error but don't fail the entire submission
        error_log('Failed to send client confirmation email: ' . $e->getMessage());
    }
}

/**
 * Generate HTML email for site owner (Design Brief)
 */
function generateBriefOwnerEmailHTML($data, $uploadedFiles) {
    $p = ft_email_hex_color($data['primaryColor'] ?? '#2C3E50');
    $s = ft_email_hex_color($data['secondaryColor'] ?? '#3498DB');
    $a = ft_email_hex_color($data['accentColor'] ?? '#E74C3C');

    $socialBody = '';
    if (!empty($data['socialFacebook'])) {
        $socialBody .= ft_em_row('Facebook', $data['socialFacebook']);
    }
    if (!empty($data['socialTwitter'])) {
        $socialBody .= ft_em_row('Twitter / X', $data['socialTwitter']);
    }
    if (!empty($data['socialInstagram'])) {
        $socialBody .= ft_em_row('Instagram', $data['socialInstagram']);
    }

    $filesBody = '';
    if ($uploadedFiles['logo']) {
        $filesBody .= '<p class="ft-em-value" style="margin:0 0 8px;"><strong>Logo</strong> · ' . ft_email_e($uploadedFiles['logo']['name'])
            . ' <span style="color:#64748b;">(' . formatBytes($uploadedFiles['logo']['size']) . ')</span></p>';
    }
    if (!empty($uploadedFiles['media'])) {
        $filesBody .= '<p class="ft-em-value" style="margin:0 0 8px;"><strong>Media</strong> · ' . count($uploadedFiles['media']) . ' file(s) attached</p>';
    }
    if (!empty($uploadedFiles['assets'])) {
        $filesBody .= '<p class="ft-em-value" style="margin:0;"><strong>Brand assets</strong> · ' . count($uploadedFiles['assets']) . ' file(s) attached</p>';
    }
    if ($filesBody === '') {
        $filesBody = '<p class="ft-em-value" style="margin:0;">No files uploaded.</p>';
    }

    $sectionsBlock = ft_em_pills_html($data['sections'] ?? []);

    $inner = '<p class="ft-em-lead">A new <strong>design brief</strong> was submitted. Files are attached to this message. Reply to the client using the email below.</p>'
        . ft_em_card('Brand', ''
            . ft_em_row('Brand name', $data['brandName'])
            . ft_em_row('Submitted', $data['submissionDate'])
        )
        . ft_em_card('Contact', ''
            . '<p class="ft-em-value" style="margin:0 0 10px;">Email · <a href="mailto:' . ft_email_e($data['clientEmail']) . '">' . ft_email_e($data['clientEmail']) . '</a></p>'
            . '<p class="ft-em-value" style="margin:0 0 10px;">Phone · ' . ft_email_e($data['clientPhone']) . '</p>'
            . ($socialBody !== '' ? '<div class="ft-em-divider"></div>' . $socialBody : '')
        )
        . ft_em_card('Colour palette', ''
            . '<p class="ft-em-value" style="margin:0 0 12px;">Primary <span class="ft-em-color-swatch" style="width:36px;height:36px;background-color:' . $p . ';"></span> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">' . ft_email_e($data['primaryColor']) . '</code></p>'
            . '<p class="ft-em-value" style="margin:0 0 12px;">Secondary <span class="ft-em-color-swatch" style="width:36px;height:36px;background-color:' . $s . ';"></span> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">' . ft_email_e($data['secondaryColor']) . '</code></p>'
            . '<p class="ft-em-value" style="margin:0;">Accent <span class="ft-em-color-swatch" style="width:36px;height:36px;background-color:' . $a . ';"></span> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;">' . ft_email_e($data['accentColor']) . '</code></p>'
        )
        . ft_em_card('Typography', ''
            . ft_em_row('Heading font', $data['headingFont'])
            . ft_em_row('Body font', $data['bodyFont'])
        )
        . ft_em_card('Uploaded files', $filesBody)
        . ft_em_card('Website goals', '<div class="ft-em-value">' . nl2br(ft_email_e($data['websiteGoals'])) . '</div>')
        . ft_em_card('Target audience', '<div class="ft-em-value">' . nl2br(ft_email_e($data['targetAudience'])) . '</div>');

    if (!empty($data['competitors'])) {
        $inner .= ft_em_card('Competitors / inspiration', '<div class="ft-em-value">' . nl2br(ft_email_e($data['competitors'])) . '</div>');
    }

    $inner .= ft_em_card('Preferred sections', $sectionsBlock);

    if (!empty($data['additionalNotes'])) {
        $inner .= ft_em_card('Additional notes', '<div class="ft-em-value">' . nl2br(ft_email_e($data['additionalNotes'])) . '</div>');
    }

    return ft_email_document(
        'Design brief: ' . $data['brandName'],
        'Internal notification',
        'New design brief submission',
        $data['brandName'],
        $inner,
        ['for_customer' => false, 'footer_note' => 'Automated message from the website design brief form.']
    );
}

/**
 * Generate plain text email for site owner (Design Brief)
 */
function generateBriefOwnerEmailPlainText($data) {
    $sections = !empty($data['sections']) ? implode(', ', $data['sections']) : 'None selected';
    
    return "NEW DESIGN BRIEF SUBMISSION\n" .
           "============================\n\n" .
           "BRAND INFORMATION\n" .
           "Brand Name: {$data['brandName']}\n" .
           "Submission Date: {$data['submissionDate']}\n\n" .
           "CONTACT DETAILS\n" .
           "Email: {$data['clientEmail']}\n" .
           "Phone: {$data['clientPhone']}\n\n" .
           "COLOR PALETTE\n" .
           "Primary: {$data['primaryColor']}\n" .
           "Secondary: {$data['secondaryColor']}\n" .
           "Accent: {$data['accentColor']}\n\n" .
           "TYPOGRAPHY\n" .
           "Heading Font: {$data['headingFont']}\n" .
           "Body Font: {$data['bodyFont']}\n\n" .
           "WEBSITE GOALS\n" .
           "{$data['websiteGoals']}\n\n" .
           "TARGET AUDIENCE\n" .
           "{$data['targetAudience']}\n\n" .
           "PREFERRED SECTIONS\n" .
           "$sections\n";
}

/**
 * Generate HTML confirmation email for client (Design Brief)
 */
function generateBriefClientEmailHTML($data) {
    $inner = '<p class="ft-em-lead">Hi <strong>' . ft_email_e($data['brandName']) . '</strong>,</p>'
        . '<p class="ft-em-lead" style="margin-top:0;">Thank you for submitting your website design brief. We have received your information and any uploads, and we will review everything shortly.</p>'
        . ft_em_highlight('What happens next', ''
            . '<ol class="ft-em-list" style="margin:0;padding-left:20px;">'
            . '<li>We review your brief (usually the same business day).</li>'
            . '<li>We contact you within <strong>24 hours</strong> to align on scope and questions.</li>'
            . '<li>You receive a proposal and timeline within a few days.</li>'
            . '<li>After approval, we begin design and development.</li>'
            . '</ol>'
        )
        . ft_em_card('Contact Fraittech', ''
            . '<p class="ft-em-value" style="margin:0 0 8px;"><strong>Email</strong> · <a href="mailto:info@fraittech.co.ke">info@fraittech.co.ke</a></p>'
            . '<p class="ft-em-value" style="margin:0 0 8px;"><strong>Phone</strong> · <a href="tel:+254742451220">+254 742 451 220</a></p>'
            . '<p class="ft-em-value" style="margin:0;"><strong>Website</strong> · <a href="https://fraittech.co.ke">fraittech.co.ke</a></p>'
        )
        . '<p style="text-align:center;margin:24px 0 0;"><a class="ft-em-btn" href="https://wa.me/254742451220">WhatsApp us</a></p>';

    return ft_email_document(
        'We received your design brief.',
        'Thank you',
        'Design brief received',
        null,
        $inner,
        [
            'for_customer' => true,
            'footer_note' => 'Automated confirmation. Questions? Email info@fraittech.co.ke — we monitor that inbox closely.',
        ]
    );
}

/**
 * Generate plain text confirmation email for client (Design Brief)
 */
function generateBriefClientEmailPlainText($data) {
    return "DESIGN BRIEF RECEIVED\n" .
           "=====================\n\n" .
           "Hi {$data['brandName']},\n\n" .
           "Thank you for submitting your website design brief! We've successfully received all your information and will begin reviewing it immediately.\n\n" .
           "WHAT HAPPENS NEXT?\n" .
           "1. Review (1-2 hours): Our team will carefully review your design brief\n" .
           "2. Consultation (24 hours): We'll reach out to discuss your project in detail\n" .
           "3. Proposal (2-3 days): You'll receive a detailed proposal and timeline\n" .
           "4. Design Phase: Once approved, we start creating your amazing website!\n\n" .
           "CONTACT INFORMATION\n" .
           "Email: info@fraittech.co.ke\n" .
           "Phone: +254 742 451 220\n" .
           "Website: fraittech.co.ke\n\n" .
           "Best regards,\n" .
           "Fraittech Team\n";
}

/**
 * Format bytes to human readable format
 */
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

/**
 * ============================================================================
 * DESIGN BUILDER HANDLER FUNCTIONS (EXISTING)
 * ============================================================================
 */

/**
 * Handle Design Builder submission (existing functionality)
 */
function handleDesignBuilderSubmission() {
    // Get and validate design data
    if (!isset($_POST['designData']) || empty($_POST['designData'])) {
        throw new Exception('Design data is missing.');
    }

    $designDataJson = $_POST['designData'];
    $designData = json_decode($designDataJson, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid design data format.');
    }

    // Validate required fields
    validateDesignData($designData);

    // Handle PDF file upload
    $pdfFilePath = null;
    if (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] === UPLOAD_ERR_OK) {
        $pdfFilePath = handlePDFUpload($_FILES['pdfFile']);
    }

    // Handle logo upload (optional)
    $logoPath = null;
    if (isset($_POST['logo']) && !empty($_POST['logo'])) {
        $logoPath = handleLogoData($_POST['logo']);
    }

    // Send email notification
    $emailSent = sendDesignEmail($designData, $pdfFilePath, $logoPath, $GLOBALS['config']);

    if ($emailSent) {
        $result = [
            'success' => true,
            'message' => 'Your design has been submitted successfully! We will contact you soon.'
        ];
    } else {
        throw new Exception('Failed to send email notification.');
    }

    // Clean up temporary files
    if ($pdfFilePath && file_exists($pdfFilePath)) {
        unlink($pdfFilePath);
    }
    if ($logoPath && file_exists($logoPath)) {
        unlink($logoPath);
    }

    return $result;
}