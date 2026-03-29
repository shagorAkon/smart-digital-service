<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: {{ $cv['font_family'] ?? 'serif' }}; color: #000; margin: 0; padding: 40px; font-size: 13px; line-height: 1.4; }
        
        .header { text-align: center; margin-bottom: 25px; border-bottom: 1px solid #000; padding-bottom: 20px; }
        .name { font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .contact { font-size: 12px; }
        
        .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px; letter-spacing: 1px; color: {{ $cv['primary_color'] ?? '#000' }}; }
        
        .item-row { margin-bottom: 15px; }
        .item-header { border-bottom: 1px dotted #ccc; margin-bottom: 5px; padding-bottom: 2px; }
        .item-title { font-weight: bold; font-size: 14px; }
        .item-company { font-style: italic; font-size: 13px; }
        .item-date { float: right; font-size: 12px; }
        .item-desc { font-size: 12px; text-align: justify; white-space: pre-line; margin-top: 5px; }
        
        .photo { width: 80px; height: 80px; float: right; margin-left: 15px; border: 1px solid #000; padding: 2px; }
        
        ul.skill-list { list-style-type: square; padding-left: 20px; margin: 5px 0; column-count: 3; }
        ul.skill-list li { font-size: 12px; margin-bottom: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <?php $photo = isset($cv['photo_path']) && !empty($cv['photo_path']) ? public_path(str_replace('/storage', 'storage', $cv['photo_path'])) : null; ?>
        @if($photo && file_exists($photo))
            <img src="{{ $photo }}" class="photo" />
        @endif
        
        <div class="name" style="color: {{ $cv['primary_color'] ?? '#000' }}">{{ $cv['full_name'] ?? 'Your Name' }}</div>
        <div class="contact">
            {{ $cv['address'] ?? '' }} <br/>
            {{ $cv['phone'] ?? '' }} | {{ $cv['email'] ?? '' }}
        </div>
    </div>

    @if(!empty($cv['summary']))
        <div class="item-desc" style="text-align: center; font-style: italic; margin-bottom: 20px;">{{ $cv['summary'] }}</div>
    @endif

    <?php 
      $items = $cv['items'] ?? [];
      $experiences = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'experience'; });
      $educations = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'education'; });
      $skills = array_filter($items, function($i){ return isset($i['type']) && $i['type'] === 'skill'; });
    ?>

    @if(count($experiences) > 0)
    <div class="section">
        <div class="section-title">Professional Experience</div>
        @foreach($experiences as $exp)
        <div class="item-row">
            <div class="item-header">
                <span class="item-title">{{ $exp['data']['jobTitle'] ?? '' }}</span> - <span class="item-company">{{ $exp['data']['company'] ?? '' }}</span>
                <span class="item-date">{{ $exp['data']['startDate'] ?? '' }} - {{ $exp['data']['endDate'] ?? '' }}</span>
            </div>
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
            <div class="item-header">
                <span class="item-title">{{ $edu['data']['degree'] ?? '' }}</span>
                <span class="item-date">{{ $edu['data']['year'] ?? '' }}</span>
            </div>
            <div class="item-company">{{ $edu['data']['institution'] ?? '' }}</div>
        </div>
        @endforeach
    </div>
    @endif

    @if(count($skills) > 0)
    <div class="section">
        <div class="section-title">Core Competencies</div>
        <ul class="skill-list">
            @foreach($skills as $skill)
                <li>{{ $skill['data']['name'] ?? '' }}</li>
            @endforeach
        </ul>
    </div>
    @endif
</body>
</html>
