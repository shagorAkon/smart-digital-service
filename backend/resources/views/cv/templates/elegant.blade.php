<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: {{ $cv['font_family'] ?? 'sans-serif' }}; color: #333; margin: 0; padding: 0; font-size: 13px; line-height: 1.5; background: #f8fafc; }
        
        .bg-primary { background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        .text-primary { color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        
        /* Layout Grid */
        table.layout { width: 100%; border-collapse: collapse; min-height: 100%; }
        td.sidebar { width: 35%; padding: 40px 25px; vertical-align: top; background-color: #1e293b; color: #f1f5f9; position: relative; }
        td.main { width: 65%; padding: 50px 40px; vertical-align: top; background: #fff; position: relative; }

        /* Sidebar Elements */
        .photo-wrapper { text-align: center; margin-bottom: 30px; }
        .photo { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        
        .side-title { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px solid {{ $cv['primary_color'] ?? '#0ea5e9' }}; padding-bottom: 5px; display: inline-block; letter-spacing: 2px; }
        
        .contact-item { font-size: 12px; margin-bottom: 12px; font-weight: bold; }
        .contact-icon { display: inline-block; width: 20px; height: 20px; background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; color: white; border-radius: 50%; text-align: center; cursor: none; margin-right: 8px; font-size: 10px; line-height: 20px; vertical-align: middle; }
        
        .skill-item { margin-bottom: 10px; }
        .skill-name { font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
        .skill-bar { width: 100%; height: 6px; background-color: #334155; border-radius: 3px; }
        .skill-fill { height: 100%; background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; border-radius: 3px; }

        /* Main Elements */
        .name { font-size: 38px; font-weight: 900; text-transform: uppercase; margin-bottom: 5px; line-height: 1; letter-spacing: -1px; color: #0f172a; }
        .title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; margin-bottom: 30px; }
        
        .main-title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: #0f172a; letter-spacing: 1px; }
        .icon-box { display: inline-block; width: 28px; height: 28px; background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; border-radius: 6px; color: white; text-align: center; line-height: 28px; margin-right: 10px; font-size: 14px; vertical-align: middle; }
        
        .item-row { margin-bottom: 20px; position: relative; padding-left: 15px; border-left: 2px solid {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        .item-row::before { content: ""; position: absolute; left: -6px; top: 3px; width: 10px; height: 10px; background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; border-radius: 50%; }
        
        .item-title { font-weight: 900; font-size: 14px; color: #0f172a; text-transform: uppercase; }
        .item-meta { font-size: 12px; font-weight: bold; margin-bottom: 5px; }
        .company-text { color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        .date-text { color: #64748b; margin-left: 10px; }
        .item-desc { font-size: 12px; color: #475569; white-space: pre-line; text-align: justify; line-height: 1.6; }
        
        .edu-box { padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid {{ $cv['primary_color'] ?? '#0ea5e9' }}; }
        .edu-title { font-weight: 900; font-size: 13px; text-transform: uppercase; color: #0f172a; }
        .edu-inst { font-size: 12px; font-weight: bold; color: #64748b; margin: 4px 0; }
        .edu-date { font-size: 10px; font-weight: bold; background-color: {{ $cv['primary_color'] ?? '#0ea5e9' }}; color: white; display: inline-block; padding: 2px 6px; border-radius: 4px; }
        
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

    <table class="layout">
        <tr>
            <!-- SIDEBAR -->
            <td class="sidebar">
                <center>
                @if($photo && file_exists($photo))
                    <div class="photo-wrapper">
                        <img src="{{ $photo }}" class="photo" />
                    </div>
                @endif
                </center>
                
                <div class="side-title">Contact</div>
                @if(!empty($cv['phone']))
                   <div class="contact-item"><span class="contact-icon">☎</span>{{ $cv['phone'] }}</div>
                @endif
                @if(!empty($cv['email']))
                   <div class="contact-item"><span class="contact-icon">✉</span>{{ $cv['email'] }}</div>
                @endif
                @if(!empty($cv['address']))
                   <div class="contact-item"><span class="contact-icon">⚲</span>{{ $cv['address'] }}</div>
                @endif
                
                <br>
                @if(count($skills) > 0)
                <div class="side-title">Skills</div>
                @foreach($skills as $skill)
                   <div class="skill-item">
                       <div class="skill-name">{{ $skill['name'] ?? '' }} <span style="float:right; color: {{ $cv['primary_color'] ?? '#0ea5e9' }}">{{ $skill['level'] ?? '' }}</span></div>
                       <div class="skill-bar">
                           <!-- Fake visual width based on string length to simulate DOM behavior -->
                           <div class="skill-fill" style="width: {{ min(100, max(40, strlen($skill['name'] ?? '') * 8)) }}%;"></div>
                       </div>
                   </div>
                @endforeach
                @endif
                
                <br>
                @if(count($languages) > 0)
                <div class="side-title">Languages</div>
                @foreach($languages as $lang)
                   <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">
                       {{ $lang['name'] ?? '' }} 
                       <span style="font-size: 10px; font-weight: normal; color: #94a3b8; font-style: italic; float: right;">{{ $lang['proficiency'] ?? '' }}</span>
                   </div>
                @endforeach
                @endif
            </td>
            
            <!-- MAIN -->
            <td class="main">
                <div class="name">{{ $cv['full_name'] ?? 'YOUR NAME' }}</div>
                <div class="title">{{ $cv['title'] ?? 'Professional Title' }}</div>
                
                @if(!empty($cv['summary']))
                    <div class="main-title"><span class="icon-box">✓</span> Profile</div>
                    <div class="item-desc" style="margin-bottom: 20px;">{{ $cv['summary'] }}</div>
                @endif

                @if(count($experiences) > 0)
                    <div class="main-title"><span class="icon-box">💼</span> Experience</div>
                    @foreach($experiences as $exp)
                    <div class="item-row">
                        <div class="item-title">{{ $exp['position'] ?? $exp['jobTitle'] ?? '' }}</div>
                        <div class="item-meta">
                            <span class="company-text">{{ $exp['company'] ?? '' }}</span>
                            <span class="date-text">| {{ $exp['start_date'] ?? $exp['startDate'] ?? '' }} - {{ strtolower(trim($exp['current'] ?? '')) === '1' || strtolower(trim($exp['current'] ?? '')) === 'true' ? 'Present' : ($exp['end_date'] ?? $exp['endDate'] ?? '') }}</span>
                        </div>
                        <div class="item-desc">{{ $exp['description'] ?? '' }}</div>
                    </div>
                    @endforeach
                @endif

                @if(count($educations) > 0)
                    <div class="main-title"><span class="icon-box">🎓</span> Education</div>
                    @foreach($educations as $edu)
                    <div class="edu-box">
                        <div class="edu-title">{{ $edu['degree'] ?? '' }}</div>
                        <div class="edu-inst">{{ $edu['institution'] ?? '' }}</div>
                        <div class="edu-date">{{ $edu['start_date'] ?? $edu['startDate'] ?? '' }} {{ isset($edu['end_date']) || isset($edu['endDate']) || isset($edu['year']) ? '- ' . ($edu['end_date'] ?? $edu['endDate'] ?? $edu['year'] ?? '') : '' }}</div>
                    </div>
                    @endforeach
                @endif
                
                @if(count($projects) > 0)
                    <div class="main-title"><span class="icon-box">★</span> Projects</div>
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
</body>
</html>
