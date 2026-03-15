<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting Login Debug...\n";

$email = 'admin@quranapp.com';
$password = 'password';

echo "Attempting to find user with email: $email\n";

$user = User::where('email', $email)->first();

if (!$user) {
    echo "ERROR: User not found!\n";
    exit(1);
}

echo "User found: " . $user->name . " (ID: " . $user->id . ")\n";
echo "Stored Password: " . $user->password . "\n";
echo "Input Password: " . $password . "\n";

if ($user->password === $password) {
    echo "SUCCESS: Passwords match (Identical).\n";
} else {
    echo "FAILURE: Passwords do NOT match.\n";
    echo "Strcmp result: " . strcmp($user->password, $password) . "\n";
    echo "Length Stored: " . strlen($user->password) . "\n";
    echo "Length Input: " . strlen($password) . "\n";
    
    // Check for hidden characters
    echo "Stored Hex: " . bin2hex($user->password) . "\n";
    echo "Input Hex: " . bin2hex($password) . "\n";
}

if (Hash::check($password, $user->password)) {
    echo "NOTE: Hash::check returned true (It was hashed?)\n";
} else {
    echo "NOTE: Hash::check returned false.\n";
}
