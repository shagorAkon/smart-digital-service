<!DOCTYPE html>
<html>
<head>
    <?php
       // Decode or fallback config
       $config = isset($cv['design_config']) ? $cv['design_config'] : [];
       $layout = $config['layout'] ?? 'single_column';
       $headerStyle = $config['header_style'] ?? 'classic';
       $expStyle = $config['experience_style'] ?? 'minimal';
       $themeColor = $config['theme_color'] ?? '#334155';
       $fontFamily = $config['font_family'] ?? 'Arial, sans-serif';
       
       $experiences = $cv['experiences'] ?? [];
       $educations = $cv['educations'] ?? [];
       $skills = $cv['skills'] ?? [];
       $projects = $cv['projects'] ?? [];
       $languages = $cv['languages'] ?? [];
       $photo = isset($cv['photo_path']) && !empty($cv['photo_path']) ? public_path(str_replace('/storage', 'storage', $cv['photo_path'])) : null;
    ?>
    <style>
        body { font-family: {{ $fontFamily }}; color: #333; margin: 0; padding: 0; font-size: 13px; line-height: 1.5; }
        .theme-color { color: {{ $themeColor }}; }
        .theme-bg { background-color: {{ $themeColor }}; }
        
        /* Grid */
        table.layout { width: 100%; border-collapse: collapse; min-height: 100%; }
        td.sidebar { width: 35%; padding: 40px 25px; vertical-align: top; background-color: #1e293b; color: white; }
        td.sidebar-right { width: 30%; padding: 40px 25px; vertical-align: top; background-color: #f1f5f9; color: #1e293b; border-left: 1px solid #cbd5e1; }
        td.main { padding: 40px; vertical-align: top; background: white; }
        
        /* Header Variants */
        /* modern_split */
        .hdr-modern-split { border-bottom: 2px solid {{ $themeColor }}; padding-bottom: 20px; margin-bottom: 25px; }
        .hdr-modern-split table { width: 100%; }
        .hdr-modern-split .name { font-size: 38px; font-weight: bold; text-transform: uppercase; color: {{ $themeColor }}; margin-bottom: 5px; }
        .hdr-modern-split .title { font-size: 16px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
        .hdr-modern-split .contact { text-align: right; font-size: 11px; color: #475569; }
        
        /* classic */
        .hdr-classic { text-align: center; margin-bottom: 30px; }
        .hdr-classic .name { font-size: 36px; font-weight: bold; text-transform: uppercase; border-bottom: 3px solid {{ $themeColor }}; display: inline-block; padding-bottom: 8px; margin-bottom: 12px; }
        .hdr-classic .contact { font-size: 12px; font-style: italic; color: #475569; }
        
        /* banner_overlap */
        .hdr-banner { background-color: {{ $themeColor }}; color: white; padding: 40px; text-align: left; margin-bottom: 30px; }
        .hdr-banner .name { font-size: 42px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .hdr-banner .title { font-size: 15px; text-transform: uppercase; letter-spacing: 3px; opacity: 0.9; margin-bottom: 15px; }
        
        /* Common Layouts */
        .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; border-left: 4px solid {{ $themeColor }}; padding-left: 8px; color: #0f172a; }
        .sidebar-title { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px solid {{ $themeColor }}; padding-bottom: 5px; display: inline-block; letter-spacing: 2px; margin-top: 25px; }
        
        .p-block { margin-bottom: 20px; }
        .p-title { font-weight: bold; font-size: 14px; color: #0f172a; }
        .p-meta { font-size: 12px; color: #64748b; margin-top: 2px; margin-bottom: 6px; }
        .p-desc { font-size: 13px; color: #475569; text-align: justify; }

        /* Timeline Style */
        .timeline-box { margin-bottom: 20px; position: relative; padding-left: 15px; border-left: 2px solid {{ $themeColor }}; }
        .timeline-box::before { content: ""; position: absolute; left: -6px; top: 3px; width: 10px; height: 10px; background-color: {{ $themeColor }}; border-radius: 50%; }

        /* Block Style */
        .block-box { background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid {{ $themeColor }}; }
        
        /* Minimal Style */
        .minimal-box { margin-bottom: 20px; }
        .minimal-box table { width: 100%; border-collapse: collapse; }
    </style>
</head>
<body>

<?php
// RENDER HEADER
function renderHeader($cv, $style, $photo) {
   if ($style === 'modern_split') {
      return "
      <div class='hdr-modern-split'>
         <table><tr>
            <td>
               <div class='name'>{$cv['full_name']}</div>
               <div class='title'>{$cv['title']}</div>
            </td>
            <td class='contact'>
               {$cv['email']}<br>{$cv['phone']}<br>{$cv['address']}
            </td>
         </tr></table>
      </div>";
   } else if ($style === 'banner_overlap') {
      return "
      <div class='hdr-banner'>
         <div class='name'>{$cv['full_name']}</div>
         <div class='title'>{$cv['title']}</div>
         <div style='font-size:11px; opacity:0.8'>{$cv['email']} &nbsp;|&nbsp; {$cv['phone']} &nbsp;|&nbsp; {$cv['address']}</div>
      </div>";
   } else {
      // Classic
      return "
      <div class='hdr-classic'>
         <div class='name'>{$cv['full_name']}</div>
         <div><span style='color: #64748b; font-weight: bold; text-transform: uppercase;'>{$cv['title']}</span></div>
         <div class='contact' style='margin-top: 10px;'>{$cv['email']} &nbsp;|&nbsp; {$cv['phone']} &nbsp;|&nbsp; {$cv['address']}</div>
      </div>";
   }
}

// RENDER EXPERIENCE
function renderExp($exp, $style) {
    if ($style === 'timeline') {
       return "
       <div class='timeline-box'>
           <div class='p-title'>{$exp['position']}</div>
           <div class='p-meta'>{$exp['company']} &nbsp;|&nbsp; {$exp['start_date']} - ".(!empty($exp['current']) ? 'Present' : $exp['end_date'])."</div>
           <div class='p-desc'>{$exp['description']}</div>
       </div>";
    } else if ($style === 'block') {
       return "
       <div class='block-box'>
           <div class='p-title'>{$exp['position']}</div>
           <div class='p-meta'>{$exp['company']} &nbsp;|&nbsp; {$exp['start_date']} - ".(!empty($exp['current']) ? 'Present' : $exp['end_date'])."</div>
           <div class='p-desc'>{$exp['description']}</div>
       </div>";
    } else {
       // Minimal
       return "
       <div class='minimal-box'>
           <table><tr>
               <td class='p-title'>{$exp['position']} <span style='font-weight:normal; color:#64748b; margin-left:8px'>@ {$exp['company']}</span></td>
               <td style='text-align:right; font-size:11px; font-weight:bold; color:#64748b;'>{$exp['start_date']} - ".(!empty($exp['current']) ? 'Present' : $exp['end_date'])."</td>
           </tr></table>
           <div class='p-desc' style='margin-top:5px'>{$exp['description']}</div>
       </div>";
    }
}

// RENDER SIDEBAR
function renderSidebar($cv, $skills, $educations, $photo) {
    ob_start();
    ?>
    <center>
    <?php if($photo && file_exists($photo)): ?>
        <img src="<?= $photo ?>" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:20px;" />
    <?php endif; ?>
    </center>
    
    <?php if(count($skills)>0): ?>
    <div class="sidebar-title">Skills</div>
    <?php foreach($skills as $s): ?>
       <div style="font-size:12px; margin-bottom:6px; font-weight:bold; text-transform:uppercase;">
           <?= $s['name'] ?> <span style="float:right; opacity:0.6"><?= $s['level'] ?></span>
       </div>
    <?php endforeach; endif; ?>
    
    <?php if(count($educations)>0): ?>
    <div class="sidebar-title">Education</div>
    <?php foreach($educations as $e): ?>
       <div style="margin-bottom:15px;">
           <div style="font-size:13px; font-weight:bold;"><?= $e['degree'] ?></div>
           <div style="font-size:11px; opacity:0.8; margin:2px 0;"><?= $e['institution'] ?></div>
           <div style="font-size:10px; font-weight:bold;" class="theme-color"><?= $e['start_date'] ?> - <?= $e['end_date'] ?></div>
       </div>
    <?php endforeach; endif; ?>
    <?php
    return ob_get_clean();
}

function renderMainContent($cv, $experiences, $projects, $expStyle) {
    ob_start();
    ?>
    <?php if(!empty($cv['summary'])): ?>
        <div class="section-title">Profile</div>
        <div class="p-desc" style="margin-bottom:25px;"><?= $cv['summary'] ?></div>
    <?php endif; ?>

    <?php if(count($experiences) > 0): ?>
        <div class="section-title">Experience</div>
        <?php foreach($experiences as $exp) {
            echo renderExp($exp, $expStyle);
        } ?>
    <?php endif; ?>
    
    <?php if(count($projects) > 0): ?>
        <div class="section-title" style="margin-top:20px;">Projects</div>
        <?php foreach($projects as $p): ?>
           <div class="p-block">
               <div class="p-title"><?= $p['title'] ?></div>
               <?php if(!empty($p['link'])): ?><div style="font-size:10px; color:#3b82f6; margin-bottom:3px;"><?= $p['link'] ?></div><?php endif; ?>
               <div class="p-desc"><?= $p['description'] ?></div>
           </div>
        <?php endforeach; ?>
    <?php endif; ?>
    <?php
    return ob_get_clean();
}
?>

<?php if ($layout === 'two_column_left'): ?>
<table class="layout">
    <tr>
        <td class="sidebar">
            <div style="font-size:28px; font-weight:bold; text-transform:uppercase; margin-bottom:5px; line-height:1"><?= $cv['full_name'] ?></div>
            <div style="font-size:13px; text-transform:uppercase; margin-bottom:20px;" class="theme-color"><?= $cv['title'] ?></div>
            
            <div style="font-size:11px; line-height:1.8; margin-bottom:30px;">
               <?= $cv['email'] ?><br><?= $cv['phone'] ?><br><?= $cv['address'] ?>
            </div>
            
            <?= renderSidebar($cv, $skills, $educations, $photo) ?>
        </td>
        <td class="main">
            <?php if($headerStyle !== 'none') echo renderHeader($cv, $headerStyle, $photo); ?>
            <?= renderMainContent($cv, $experiences, $projects, $expStyle) ?>
        </td>
    </tr>
</table>

<?php elseif ($layout === 'two_column_right'): ?>
<table class="layout">
    <tr>
        <td class="main">
            <?= renderHeader($cv, $headerStyle, $photo) ?>
            <?= renderMainContent($cv, $experiences, $projects, $expStyle) ?>
        </td>
        <td class="sidebar-right">
            <?= renderSidebar($cv, $skills, $educations, $photo) ?>
        </td>
    </tr>
</table>

<?php else: ?>
<!-- Single Column Layout Default -->
<div style="padding: 40px;">
    <?= renderHeader($cv, $headerStyle, $photo) ?>
    
    <?= renderMainContent($cv, $experiences, $projects, $expStyle) ?>
    
    <?php if(count($skills)>0 || count($educations)>0): ?>
    <table style="width:100%; margin-top:30px;">
        <tr>
            <td style="width:50%; vertical-align:top; padding-right:20px;">
                <?php if(count($skills)>0): ?>
                    <div class="section-title">Skills</div>
                    <?php foreach($skills as $s): ?>
                       <div style="font-size:12px; margin-bottom:6px; font-weight:bold; text-transform:uppercase;">
                           <?= $s['name'] ?> <span style="float:right; opacity:0.6"><?= $s['level'] ?></span>
                       </div>
                    <?php endforeach; endif; ?>
            </td>
            <td style="width:50%; vertical-align:top; border-left:1px solid #e2e8f0; padding-left:20px;">
                <?php if(count($educations)>0): ?>
                    <div class="section-title" style="margin-top:0;">Education</div>
                    <?php foreach($educations as $e): ?>
                       <div style="margin-bottom:15px;">
                           <div style="font-size:13px; font-weight:bold;"><?= $e['degree'] ?></div>
                           <div style="font-size:11px; opacity:0.8; margin:2px 0;"><?= $e['institution'] ?></div>
                           <div style="font-size:10px; font-weight:bold;" class="theme-color"><?= $e['start_date'] ?> - <?= $e['end_date'] ?></div>
                       </div>
                    <?php endforeach; endif; ?>
            </td>
        </tr>
    </table>
    <?php endif; ?>
</div>
<?php endif; ?>

</body>
</html>
