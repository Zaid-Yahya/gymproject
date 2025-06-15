<!DOCTYPE html>
<html>
<head>
    <title>Your Gym Account Credentials</title>
</head>
<body>
    <h2>Welcome to Our Gym!</h2>
    
    <p>Hello {{ $user->name }},</p>
    
    <p>Your account has been created successfully. Here are your login credentials:</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <p><strong>Email:</strong> {{ $user->email }}</p>
        <p><strong>Password:</strong> {{ $password }}</p>
    </div>
    
    <p>For security reasons, we recommend changing your password after your first login.</p>
    
    <p>You can login to your account at: <a href="{{ route('login') }}">{{ route('login') }}</a></p>
    
    <p>Best regards,<br>Gym Management Team</p>
</body>
</html> 