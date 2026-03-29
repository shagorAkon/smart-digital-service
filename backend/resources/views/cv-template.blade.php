<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $fullName ?? 'CV' }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 30px; }
        .header { text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; text-transform: uppercase; font-size: 36px; color: #111; letter-spacing: 2px; }
        .header p { margin: 8px 0 0; color: #666; font-size: 14px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold; color: #222; letter-spacing: 1px; }
        .content { font-size: 14px; white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $fullName ?? 'YOUR NAME' }}</h1>
        <p>
            @if(!empty($email)) {{ $email }} @endif
            @if(!empty($phone)) &bull; {{ $phone }} @endif
            @if(!empty($address)) &bull; {{ $address }} @endif
        </p>
    </div>

    @if(!empty($summary))
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="content">{{ $summary }}</div>
    </div>
    @endif

    @if(!empty($experience))
    <div class="section">
        <div class="section-title">Experience</div>
        <div class="content">{{ $experience }}</div>
    </div>
    @endif

    @if(!empty($education))
    <div class="section">
        <div class="section-title">Education</div>
        <div class="content">{{ $education }}</div>
    </div>
    @endif

    @if(!empty($skills))
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="content">{{ $skills }}</div>
    </div>
    @endif
</body>
</html>
