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
      $experiences = $cv['experiences'] ?? [];
      $educations = $cv['educations'] ?? [];
      $skills = $cv['skills'] ?? [];
      $projects = $cv['projects'] ?? [];
      $certifications = $cv['certifications'] ?? [];
      $languages = $cv['languages'] ?? [];
    ?>

    @if(count($experiences) > 0)
    <div class="section">
        <div class="section-title">Experience</div>
        @foreach($experiences as $exp)
        <div class="item-row">
            <div class="item-title">
                {{ $exp['position'] ?? $exp['jobTitle'] ?? '' }} 
                <span class="date-right">{{ $exp['start_date'] ?? $exp['startDate'] ?? '' }} - {{ strtolower(trim($exp['current'] ?? '')) === '1' || strtolower(trim($exp['current'] ?? '')) === 'true' ? 'Present' : ($exp['end_date'] ?? $exp['endDate'] ?? '') }}</span>
            </div>
            <div class="item-meta">{{ $exp['company'] ?? '' }}</div>
            <div class="item-desc">{{ $exp['description'] ?? '' }}</div>
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
                {{ $edu['degree'] ?? '' }} 
                <span class="date-right">{{ $edu['start_date'] ?? $edu['startDate'] ?? '' }} {{ isset($edu['end_date']) || isset($edu['endDate']) || isset($edu['year']) ? '- ' . ($edu['end_date'] ?? $edu['endDate'] ?? $edu['year'] ?? '') : '' }}</span>
            </div>
            <div class="item-meta">{{ $edu['institution'] ?? '' }}</div>
            @if(!empty($edu['description']))
                <div class="item-desc">{{ $edu['description'] }}</div>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    @if(count($skills) > 0)
    <div class="section">
        <div class="section-title">Skills</div>
        @foreach($skills as $skill)
            <span class="skill-badge">{{ $skill['name'] ?? '' }} {{ isset($skill['level']) && !empty($skill['level']) ? '('.$skill['level'].')' : '' }}</span>
        @endforeach
    </div>
    @endif

    @if(count($projects) > 0)
    <div class="section">
        <div class="section-title">Projects</div>
        @foreach($projects as $proj)
        <div class="item-row">
            <div class="item-title">
                {{ $proj['title'] ?? '' }} 
                @if(!empty($proj['link']))
                    <span style="font-weight:normal; font-size:12px; margin-left:10px;">({{ $proj['link'] }})</span>
                @endif
            </div>
            <div class="item-desc">{{ $proj['description'] ?? '' }}</div>
        </div>
        @endforeach
    </div>
    @endif

    @if(count($certifications) > 0)
    <div class="section">
        <div class="section-title">Certifications</div>
        @foreach($certifications as $cert)
        <div class="item-row">
            <div class="item-title">
                {{ $cert['name'] ?? '' }} 
                <span class="date-right">{{ $cert['date'] ?? '' }}</span>
            </div>
            <div class="item-meta">{{ $cert['issuer'] ?? '' }}</div>
            @if(!empty($cert['url']))
               <div class="item-desc"><a href="{{ $cert['url'] }}">{{ $cert['url'] }}</a></div>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    @if(count($languages) > 0)
    <div class="section">
        <div class="section-title">Languages</div>
        @foreach($languages as $lang)
            <span class="skill-badge">{{ $lang['name'] ?? '' }} {{ isset($lang['proficiency']) && !empty($lang['proficiency']) ? '— '.$lang['proficiency'] : '' }}</span>
        @endforeach
    </div>
    @endif
</body>
</html>
