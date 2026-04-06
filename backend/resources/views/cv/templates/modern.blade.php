<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: {{ $cv['font_family'] ?? 'sans-serif' }}; color: #333; margin: 0; padding: 0; font-size: 13px; line-height: 1.5; }
        .bg-primary { background-color: {{ $cv['primary_color'] ?? '#10b981' }}; color: white; }
        .text-primary { color: {{ $cv['primary_color'] ?? '#10b981' }}; }
        
        table.layout { width: 100%; border-collapse: collapse; min-height: 100%; }
        td.sidebar { width: 35%; padding: 40px 25px; vertical-align: top; }
        td.main { width: 65%; padding: 40px 30px; vertical-align: top; background: white; }
        
        .name { font-size: 32px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; line-height: 1.1; }
        .contact-item { font-size: 12px; margin-bottom: 10px; opacity: 0.9; }
        
        .sidebar-title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px; }
        .main-title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px solid {{ $cv['primary_color'] ?? '#10b981' }}; padding-bottom: 5px; }
        
        .item-row { margin-bottom: 20px; }
        .item-title { font-weight: bold; font-size: 15px; color: #1e293b; }
        .item-meta { font-size: 12px; color: #64748b; font-weight: bold; margin-bottom: 5px; }
        .item-desc { font-size: 13px; color: #475569; white-space: pre-line; }
        
        .photo { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); margin-bottom: 25px; }
        .date { font-weight: normal; font-size: 12px; color: #94a3b8; margin-left: auto; }
        
        ul.skill-list { list-style-type: none; padding: 0; margin: 0; }
        ul.skill-list li { margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
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

    @if(isset($cv['layout']) && $cv['layout'] === '2-column')
    <table class="layout">
        <tr>
            <td class="sidebar bg-primary">
                @if($photo && file_exists($photo))
                    <center><img src="{{ $photo }}" class="photo" /></center>
                @endif
                <div class="name">{{ $cv['full_name'] ?? 'Your Name' }}</div>
                
                @if(!empty($cv['email']))<div class="contact-item">✉ {{ $cv['email'] }}</div>@endif
                @if(!empty($cv['phone']))<div class="contact-item">☎ {{ $cv['phone'] }}</div>@endif
                @if(!empty($cv['address']))<div class="contact-item">📍 {{ $cv['address'] }}</div>@endif

                @if(count($skills) > 0)
                <div class="sidebar-title">Skills</div>
                <ul class="skill-list">
                    @foreach($skills as $skill)
                        <li>{{ $skill['name'] ?? '' }} {{ isset($skill['level']) && !empty($skill['level']) ? '('.$skill['level'].')' : '' }}</li>
                    @endforeach
                </ul>
                @endif
                
                @if(count($languages) > 0)
                <div class="sidebar-title">Languages</div>
                <ul class="skill-list">
                    @foreach($languages as $lang)
                        <li>{{ $lang['name'] ?? '' }} - {{ $lang['proficiency'] ?? '' }}</li>
                    @endforeach
                </ul>
                @endif
            </td>
            <td class="main">
                @if(!empty($cv['summary']))
                    <div class="main-title text-primary">Profile</div>
                    <div class="item-desc" style="margin-bottom: 30px;">{{ $cv['summary'] }}</div>
                @endif

                @if(count($experiences) > 0)
                    <div class="main-title text-primary">Experience</div>
                    @foreach($experiences as $exp)
                    <div class="item-row">
                        <div class="item-title">{{ $exp['position'] ?? $exp['jobTitle'] ?? '' }}</div>
                        <div class="item-meta">{{ $exp['company'] ?? '' }} &nbsp;&nbsp;|&nbsp;&nbsp; {{ $exp['start_date'] ?? $exp['startDate'] ?? '' }} - {{ strtolower(trim($exp['current'] ?? '')) === '1' || strtolower(trim($exp['current'] ?? '')) === 'true' ? 'Present' : ($exp['end_date'] ?? $exp['endDate'] ?? '') }}</div>
                        <div class="item-desc">{{ $exp['description'] ?? '' }}</div>
                    </div>
                    @endforeach
                @endif

                @if(count($educations) > 0)
                    <div class="main-title text-primary">Education</div>
                    @foreach($educations as $edu)
                    <div class="item-row">
                        <div class="item-title">{{ $edu['degree'] ?? '' }}</div>
                        <div class="item-meta">{{ $edu['institution'] ?? '' }} &nbsp;&nbsp;|&nbsp;&nbsp; {{ $edu['start_date'] ?? $edu['startDate'] ?? '' }} {{ isset($edu['end_date']) || isset($edu['endDate']) || isset($edu['year']) ? '- ' . ($edu['end_date'] ?? $edu['endDate'] ?? $edu['year'] ?? '') : '' }}</div>
                        @if(!empty($edu['description']))
                            <div class="item-desc" style="margin-top:5px;">{{ $edu['description'] }}</div>
                        @endif
                    </div>
                    @endforeach
                @endif
                
                @if(count($projects) > 0)
                    <div class="main-title text-primary">Projects</div>
                    @foreach($projects as $proj)
                    <div class="item-row">
                        <div class="item-title">{{ $proj['title'] ?? '' }}</div>
                        @if(!empty($proj['link']))
                            <div class="item-meta"><a href="{{ $proj['link'] }}">{{ $proj['link'] }}</a></div>
                        @endif
                        <div class="item-desc">{{ $proj['description'] ?? '' }}</div>
                    </div>
                    @endforeach
                @endif
            </td>
        </tr>
    </table>
    @else
    <!-- Fallback to Minimal 1 column structure but with Modern styles -->
    <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
            @if($photo && file_exists($photo))
                <img src="{{ $photo }}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 3px solid {{ $cv['primary_color'] ?? '#10b981' }};" />
            @endif
            <div class="name text-primary" style="margin-bottom: 5px;">{{ $cv['full_name'] ?? 'Your Name' }}</div>
            <div style="font-size: 13px; color: #666;">
                {{ $cv['email'] ?? '' }} | {{ $cv['phone'] ?? '' }} | {{ $cv['address'] ?? '' }}
            </div>
        </div>

        @if(!empty($cv['summary']))
            <div class="main-title text-primary" style="text-align: center; font-size: 16px;">Professional Summary</div>
            <div class="item-desc" style="text-align: center; margin-bottom: 30px;">{{ $cv['summary'] }}</div>
        @endif

        @if(count($experiences) > 0)
            <div class="main-title text-primary" style="font-size: 16px;">Experience</div>
            @foreach($experiences as $exp)
            <div class="item-row">
                <div class="item-title">{{ $exp['position'] ?? $exp['jobTitle'] ?? '' }} <span style="float:right; font-weight:normal; font-size:12px;">{{ $exp['start_date'] ?? $exp['startDate'] ?? '' }} - {{ strtolower(trim($exp['current'] ?? '')) === '1' || strtolower(trim($exp['current'] ?? '')) === 'true' ? 'Present' : ($exp['end_date'] ?? $exp['endDate'] ?? '') }}</span></div>
                <div class="item-meta">{{ $exp['company'] ?? '' }}</div>
                <div class="item-desc">{{ $exp['description'] ?? '' }}</div>
            </div>
            @endforeach
        @endif

        @if(count($educations) > 0)
            <div class="main-title text-primary" style="font-size: 16px;">Education</div>
            @foreach($educations as $edu)
            <div class="item-row">
                <div class="item-title">{{ $edu['degree'] ?? '' }} <span style="float:right; font-weight:normal; font-size:12px;">{{ $edu['start_date'] ?? $edu['startDate'] ?? '' }} {{ isset($edu['end_date']) || isset($edu['endDate']) || isset($edu['year']) ? '- ' . ($edu['end_date'] ?? $edu['endDate'] ?? $edu['year'] ?? '') : '' }}</span></div>
                <div class="item-meta">{{ $edu['institution'] ?? '' }}</div>
                @if(!empty($edu['description']))
                    <div class="item-desc" style="margin-top:5px;">{{ $edu['description'] }}</div>
                @endif
            </div>
            @endforeach
        @endif
        
        @if(count($skills) > 0)
            <div class="main-title text-primary" style="font-size: 16px;">Skills</div>
            <div>
            @foreach($skills as $skill)
                <span style="display: inline-block; background-color: {{ $cv['primary_color'] ?? '#10b981' }}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; margin-right: 6px; margin-bottom: 6px;">{{ $skill['name'] ?? '' }} {{ isset($skill['level']) && !empty($skill['level']) ? '('.$skill['level'].')' : '' }}</span>
            @endforeach
            </div>
        @endif
    </div>
    @endif
</body>
</html>
