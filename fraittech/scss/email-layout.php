<?php

/**
 * Shared HTML email layout for Fraittech (forms, notifications, confirmations).
 * Uses table wrapper for client compatibility; styles are embedded once per message.
 */

function ft_email_e(?string $s): string
{
	return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Allow only #RGB / #RRGGBB for inline CSS color values. */
function ft_email_hex_color(?string $c): string
{
	$c = trim((string) $c);
	return preg_match('/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/', $c) ? $c : '#4a9bd4';
}

function ft_email_styles(): string
{
	return '
		body { margin:0; padding:0; background:#e8eef4; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
		a { color:#2d7ab8; text-decoration:none; }
		a:hover { text-decoration:underline; }
		img { border:0; line-height:100%; vertical-align:middle; }
		table { border-collapse:collapse; }
		.ft-em-preheader {
			display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;
		}
		.ft-em-body { width:100%; background:#e8eef4; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
		.ft-em-shell { max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;
			box-shadow:0 4px 24px rgba(26,58,82,0.08); border:1px solid #d8e4ed; }
		.ft-em-header {
			background:linear-gradient(135deg, #4a9bd4 0%, #2d7ab8 55%, #1a5a8a 100%);
			padding:28px 32px 24px; text-align:left; color:#ffffff;
		}
		.ft-em-eyebrow {
			margin:0 0 8px; font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; opacity:0.92;
		}
		.ft-em-title { margin:0; font-size:22px; font-weight:700; line-height:1.25; letter-spacing:-0.02em; }
		.ft-em-subtitle { margin:10px 0 0; font-size:14px; line-height:1.45; opacity:0.95; font-weight:400; }
		.ft-em-main { padding:28px 32px 8px; color:#1e293b; font-size:15px; line-height:1.55; }
		.ft-em-lead { margin:0 0 20px; color:#475569; font-size:15px; line-height:1.55; }
		.ft-em-card {
			background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px 20px; margin:0 0 16px;
		}
		.ft-em-card-title {
			margin:0 0 14px; font-size:13px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#2d7ab8;
			border-bottom:2px solid #bfdbfe; padding-bottom:8px;
		}
		.ft-em-card-body { margin:0; }
		.ft-em-row { margin:0 0 12px; }
		.ft-em-row:last-child { margin-bottom:0; }
		.ft-em-label { display:block; font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:4px; }
		.ft-em-value { color:#1e293b; font-size:15px; line-height:1.45; word-break:break-word; }
		.ft-em-divider { height:1px; background:#e2e8f0; margin:18px 0; border:0; }
		.ft-em-highlight {
			background:linear-gradient(90deg, #eff6ff 0%, #f8fafc 100%); border-left:4px solid #4a9bd4; padding:16px 18px; border-radius:0 8px 8px 0; margin:0 0 20px;
		}
		.ft-em-highlight-title { margin:0 0 10px; font-size:14px; font-weight:700; color:#1e40af; }
		.ft-em-list { margin:8px 0 0; padding-left:20px; color:#334155; }
		.ft-em-list li { margin:6px 0; }
		.ft-em-pill {
			display:inline-block; background:#4a9bd4; color:#ffffff !important; padding:4px 10px; margin:2px 4px 2px 0;
			border-radius:999px; font-size:12px; font-weight:600; text-decoration:none !important;
		}
		.ft-em-color-swatch {
			display:inline-block; width:28px; height:28px; border-radius:6px; border:2px solid #cbd5e1; vertical-align:middle; margin-left:8px;
		}
		.ft-em-btn {
			display:inline-block; padding:12px 22px; background:#4a9bd4; color:#ffffff !important; font-weight:600; font-size:14px;
			border-radius:8px; text-decoration:none !important; margin:8px 0;
		}
		.ft-em-foot {
			padding:22px 32px 28px; background:#f1f5f9; border-top:1px solid #e2e8f0; text-align:center; font-size:12px; color:#64748b; line-height:1.5;
		}
		.ft-em-foot-brand { margin:0 0 6px; font-weight:600; color:#475569; font-size:13px; }
		.ft-em-foot-links { margin:0 0 10px; }
		.ft-em-foot-links a { color:#2d7ab8; font-weight:500; }
		.ft-em-foot-note { margin:0 0 8px; max-width:440px; margin-left:auto; margin-right:auto; }
		.ft-em-foot-copy { margin:0; font-size:11px; color:#94a3b8; }
		@media only screen and (max-width:620px) {
			.ft-em-main, .ft-em-header, .ft-em-foot { padding-left:20px !important; padding-right:20px !important; }
		}
	';
}

/**
 * Full HTML document wrapper.
 *
 * @param array $options for_customer (bool), footer_note (string|null) override
 */
function ft_email_document(
	string $preheader,
	string $eyebrow,
	string $title,
	?string $subtitle,
	string $innerHtml,
	array $options = []
): string {
	$forCustomer = !empty($options['for_customer']);
	$footerNote = $options['footer_note'] ?? null;
	if ($footerNote === null) {
		$footerNote = $forCustomer
			? 'This is an automated confirmation. For questions, reply to us at info@fraittech.co.ke or call +254 742 451 220.'
			: 'This message was sent from a form on fraittech.co.ke.';
	}

	$year = date('Y');
	$subBlock = ($subtitle !== null && $subtitle !== '')
		? '<p class="ft-em-subtitle">' . ft_email_e($subtitle) . '</p>'
		: '';

	return '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>' . ft_email_e($title) . '</title>
<style>' . ft_email_styles() . '</style>
</head>
<body>
<span class="ft-em-preheader">' . ft_email_e($preheader) . '</span>
<table role="presentation" class="ft-em-body" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="ft-em-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td class="ft-em-header">
<p class="ft-em-eyebrow">' . ft_email_e($eyebrow) . '</p>
<h1 class="ft-em-title">' . ft_email_e($title) . '</h1>
' . $subBlock . '
</td></tr>
<tr><td class="ft-em-main">
' . $innerHtml . '
</td></tr>
<tr><td class="ft-em-foot">
<p class="ft-em-foot-brand">Fraittech Limited · Nanyuki, Kenya</p>
<p class="ft-em-foot-links"><a href="tel:+254742451220">+254 742 451 220</a> · <a href="mailto:info@fraittech.co.ke">info@fraittech.co.ke</a> · <a href="https://fraittech.co.ke">fraittech.co.ke</a></p>
<p class="ft-em-foot-note">' . ft_email_e($footerNote) . '</p>
<p class="ft-em-foot-copy">© ' . $year . ' Fraittech Limited. All rights reserved.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>';
}

function ft_em_card(string $heading, string $bodyHtml): string
{
	return '<div class="ft-em-card"><h2 class="ft-em-card-title">' . ft_email_e($heading) . '</h2><div class="ft-em-card-body">' . $bodyHtml . '</div></div>';
}

/**
 * @param string $value Plain text (escaped) or HTML fragment when $valueIsHtml is true
 */
function ft_em_row(string $label, string $value, bool $valueIsHtml = false): string
{
	$inner = $valueIsHtml ? $value : ft_email_e($value);
	return '<div class="ft-em-row"><span class="ft-em-label">' . ft_email_e($label) . '</span><div class="ft-em-value">' . $inner . '</div></div>';
}

function ft_em_highlight(string $title, string $bodyHtml): string
{
	return '<div class="ft-em-highlight"><p class="ft-em-highlight-title">' . ft_email_e($title) . '</p>' . $bodyHtml . '</div>';
}

function ft_em_pills_html(array $labels): string
{
	if (empty($labels)) {
		return '<p class="ft-em-value" style="margin:0;">—</p>';
	}
	$out = '';
	foreach ($labels as $t) {
		$out .= '<span class="ft-em-pill">' . ft_email_e((string) $t) . '</span>';
	}
	return '<p class="ft-em-value" style="margin:0;">' . $out . '</p>';
}
