<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: {{ $cv['font_family'] ?? 'sans-serif' }}; color: #444; margin: 0; padding: 0; font-size: 13px; line-height: 1.6; }
        .bg-accent { background-color: {{ $cv['primary_color'] ?? '#3b82f6' }}; }
        .text-accent { color: {{ $cv['primary_color'] ?? '#3b82f6' }}; }
        
        .header-top { height: 15px; }
        .header-box { padding: 40px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; margin-bottom: 30px; }
        
        .name { font-size: 42px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; margin-bottom: 10px; line-height: 1; }
        .contact { font-size: 13px; color: #64748b; font-weight: 500; }
        
        .section-title { font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; display: inline-block; border-bottom: 4px solid {{ $cv['primary_color'] ?? '#3b82f6' }}; padding-bottom: 2px; }
        
        .content { padding: 0 40px; }
        
        .item-row { margin-bottom: 25px; page-break-inside: avoid; }
        .item-row table { width: 100%; border-collapse: collapse; }
        .item-left { width: 25%; vertical-align: top; font-weight: bold; color: {{ $cv['primary_color'] ?? '#3b82f6' }}; font-size: 12px; text-transform: uppercase; padding-right: 15px; }
        .item-right { width: 75%; vertical-align: top; border-left: 1px solid #cbd5e1; padding-left: 20px; }
        
        .item-title { font-weight: bold; font-size: 16px; color: #0f172a; margin-bottom: 5px; }
        .item-meta { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px; }
        .item-desc { font-size: 13px; color: #475569; white-space: pre-line; }
        
        .photo-container { float: right; width: 100px; height: 100px; overflow: hidden; border-radius: 12px; margin-left: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .photo { width: 100%; height: 100%; object-fit: cover; }
    </style>
</head>
<body>
    <?php 
      $experiences = $cv['experiences'] ?? [];
      $educations = $cv['educations'] ?? [];
      $skills = $cv['skills'] ?? [];
      $projects = $cv['projects'] ?? [];
      $certifications = $cv['certifications'] ?? [];
      $languages = $cv['languages'] ?? [];
      $social_links = $cv['social_links'] ?? [];
      $photo = isset($cv['photo_path']) && !empty($cv['photo_path']) ? public_path(str_replace('/storage', 'storage', $cv['photo_path'])) : null;
    ?>

    <div class="header-top bg-accent"></div>
    <div class="header-box">
        @if($photo && file_exists($photo))
            <div class="photo-container">
                <img src="{{ $photo }}" class="photo" />
            </div>
        @endif
        <div class="name text-accent">{{ $cv['full_name'] ?? 'YOUR NAME' }}</div>
        <div class="contact">
            {{ $cv['email'] ?? '' }} <span style="color: #cbd5e1; margin: 0 5px;">|</span> {{ $cv['phone'] ?? '' }} <span style="color: #cbd5e1; margin: 0 5px;">|</span> {{ $cv['address'] ?? '' }}
        </div>
        
        @if(!empty($cv['summary']))
            <div style="margin-top: 25px; font-size: 14px; color: #334155; font-weight: 500; font-style: italic; border-left: 3px solid {{ $cv['primary_color'] ?? '#3b82f6' }}; padding-left: 15px;">
                {{ $cv['summary'] }}
            </div>
        @endif
    </div>

    <div class="content">
        @if(count($experiences) > 0)
        <div class="section-title">Experience</div>
        @foreach($experiences as $exp)
        <div class="item-row">
            <table>
                <tr>
                    <td class="item-left">
                        {{ $exp['start_date'] ?? $exp['startDate'] ?? '' }}<br/>to<br/>{{ strtolower(trim($exp['current'] ?? '')) === '1' || strtolower(trim($exp['current'] ?? '')) === 'true' ? 'Present' : ($exp['end_date'] ?? $exp['endDate'] ?? '') }}
                    </td>
                    <td class="item-right">
                        <div class="item-title">{{ $exp['position'] ?? $exp['jobTitle'] ?? '' }}</div>
                        <div class="item-meta">{{ $exp['company'] ?? '' }}</div>
                        <div class="item-desc">{{ $exp['description'] ?? '' }}</div>
                    </td>
                </tr>
            </table>
        </div>
        @endforeach
        @endif

        @if(count($educations) > 0)
        <div style="margin-top: 20px;"></div>
        <div class="section-title">Education</div>
        @foreach($educations as $edu)
        <div class="item-row">
            <table>
                <tr>
                    <td class="item-left">
                        {{ $edu['start_date'] ?? $edu['startDate'] ?? '' }} - {{ $edu['end_date'] ?? $edu['endDate'] ?? $edu['year'] ?? '' }}
                    </td>
                    <td class="item-right">
                        <div class="item-title">{{ $edu['degree'] ?? '' }}</div>
                        <div class="item-meta">{{ $edu['institution'] ?? '' }}</div>
                        @if(!empty($edu['description']))
                            <div class="item-desc" style="margin-top:5px;">{{ $edu['description'] }}</div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
        @endforeach
        @endif

        @if(count($skills) > 0)
        <div style="margin-top: 20px;"></div>
        <div class="section-title">Expertise</div>
        <div style="margin-bottom: 25px;">
            @foreach($skills as $skill)
                <span style="display: inline-block; border: 1px solid {{ $cv['primary_color'] ?? '#3b82f6' }}; color: {{ $cv['primary_color'] ?? '#3b82f6' }}; padding: 5px 12px; border-radius: 4px; font-size: 13px; font-weight: bold; margin-right: 8px; margin-bottom: 8px;">
                    {{ $skill['name'] ?? '' }} {{ isset($skill['level']) && !empty($skill['level']) ? '('.$skill['level'].')' : '' }}
                </span>
            @endforeach
        </div>
        @endif
        
        @if(count($projects) > 0)
        <div style="margin-top: 20px;"></div>
        <div class="section-title">Projects</div>
        @foreach($projects as $proj)
        <div class="item-row">
            <table>
                <tr>
                    <td class="item-left" style="width:10%">★</td>
                    <td class="item-right" style="width:90%">
                        <div class="item-title">{{ $proj['title'] ?? '' }}</div>
                        @if(!empty($proj['link']))
                            <div class="item-meta"><a href="{{ $proj['link'] }}">{{ $proj['link'] }}</a></div>
                        @endif
                        <div class="item-desc">{{ $proj['description'] ?? '' }}</div>
                    </td>
                </tr>
            </table>
        </div>
        @endforeach
        @endif
    </div>
</body>
</html>
