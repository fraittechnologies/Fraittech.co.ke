<?php

/**
 * Load KEY=value pairs from a .env file into getenv() / $_ENV (no Composer).
 * Skips blank lines and lines starting with #.
 */
function ft_load_dotenv(string $path): void
{
	if (!is_readable($path)) {
		return;
	}
	$raw = file($path, FILE_IGNORE_NEW_LINES);
	if ($raw === false) {
		return;
	}
	foreach ($raw as $line) {
		$line = trim($line);
		if ($line === '' || (isset($line[0]) && $line[0] === '#')) {
			continue;
		}
		$eq = strpos($line, '=');
		if ($eq === false) {
			continue;
		}
		$name = trim(substr($line, 0, $eq));
		$value = trim(substr($line, $eq + 1));
		if ($name === '') {
			continue;
		}
		if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
			$q = $value[0];
			$len = strlen($value);
			if ($len >= 2 && substr($value, -1) === $q) {
				$value = substr($value, 1, -1);
			}
		}
		putenv($name . '=' . $value);
		$_ENV[$name] = $value;
	}
}

ft_load_dotenv(__DIR__ . DIRECTORY_SEPARATOR . '.env');
