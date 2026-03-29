<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: {{ $cv['font_family'] ?? 'sans-serif' }}; color: #333; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
        .header { margin-bottom: 25px; border-bottom: 2px solid {{ $cv['primary_color'] ?? '#10b981' }}; padding-bottom: 15px; }
        .name { color: {{ $cv['primary_color'] ?? '#10b981' }}; font-size: 36px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .contact { font-size: 12px; color: #666; }
        .section-title { color: {{ $cv['primary_color'] ?? '#10b981' }}; font-size: 18px; text-transform: uppercase; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 15px; font-weight: bold; }
        .item-row { margin-bottom: 15px; }
        .item-title { font-weight: bold; font-size: 15px; color: #1e293b; }
        .item-meta { font-size: 13px; color: #64748b; font-weight: bold; margin-bottom: 4px; }
        .item-desc { font-size: 13px; color: #475569; white-space: pre-line; }
        .skill-badge { display: inline-block; background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; font-size: 12px; margin-right: 6px; margin-bottom: 6px; }
        .photo { width: 120px; height: 120px; float: right; border-radius: 8px; object-fit: cover; }
        .date-right { float: right; font-weight: normal; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <?php $photo = isset($cv['photo_path']) && !empty($cv['photo_path']) ? public_path(str_replace('/storage', 'storage', $cv['photo_path'])) : null; ?>
        @if($photo && file_exists($photo))
            <img src="{{ $photo }}" class="photo" />
        @endif
        <div class="name">{{ $cv['full_name'] ?? 'Your Name' }}</div>
        <div class="contact">
            {{ $cv['email'] ?? '' }} &nbsp;|&nbsp; {{ $cv['phone'] ?? '' }} &nbsp;|&nbsp; {{ $cv['address'] ?? '' }}
        </div>
    </div>

    @if(!empty($cv['summary']))
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="item-desc">{{ $cv['summary'] }}</div>
    </div>
    @endif

    <?php 
      $items = $cv['items'] ?? [];
      $experiences = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'experience'; });
      $educations = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'education'; });
      $skills = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'skill'; });
    ?>

    @if(count($experiences) > 0)
    <div class="section">
        <div class="section-title">Experience</div>
        @foreach($experiences as $exp)
        <div class="item-row">
            <div class="item-title">
                {{ $exp['data']['jobTitle'] ?? '' }} 
                <span class="date-right">{{ $exp['data']['startDate'] ?? '' }} - {{ $exp['data']['endDate'] ?? '' }}</span>
            </div>
            <div class="item-meta">{{ $exp['data']['company'] ?? '' }}</div>
            <div class="item-desc">{{ $exp['data']['description'] ?? '' }}</div>
        </div>
        @endforeach
    </div>
    @endif

    @if(count($educations) > 0)
    <div class="section">
        <div class="section-title">Education</div>
        @foreach($educations as $edu)
        <div class="item-row">
            <div class="item-title">
                {{ $edu['data']['degree'] ?? '' }} 
                <span class="date-right">{{ $edu['data']['year'] ?? '' }}</span>
            </div>
            <div class="item-meta">{{ $edu['data']['institution'] ?? '' }}</div>
        </div>
        @endforeach
    </div>
    @endif

    @if(count($skills) > 0)
    <div class="section">
        <div class="section-title">Skills</div>
        @foreach($skills as $skill)
            <span class="skill-badge">{{ $skill['data']['name'] ?? '' }}</span>
        @endforeach
    </div>
    @endif
</body>
</html>
