<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\CVTemplate;

class CVTemplateConfigSeeder extends Seeder
{
    public function run()
    {
        // Wipe existing templates because schema dramatically changed
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cv_templates')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $templates = [];
        
        $categories = ['Modern', 'Professional', 'Creative', 'Simple', 'Executive'];
        $layouts = ['single_column', 'two_column_left', 'two_column_right'];
        $headers = ['classic', 'banner_overlap', 'modern_split', 'floating', 'side_header'];
        $experiences = ['timeline', 'block', 'minimal', 'bulleted'];
        
        $faker = \Faker\Factory::create();
        
        // Generate 25 distinct templates using combinations
        $count = 1;
        foreach($categories as $category) {
            for($i=1; $i<=5; $i++) {
                
                // Select generic config values based on loops to ensure variations
                $layout = $layouts[($count) % count($layouts)];
                $header = $headers[($count + 1) % count($headers)];
                $experience = $experiences[($count + 2) % count($experiences)];
                $color = $faker->hexColor();
                
                // Fine-tune aesthetics by category
                if($category === 'Executive' || $category === 'Professional') {
                    $font = 'Merriweather, serif';
                    $color = '#'.str_pad(dechex(rand(0x101010, 0x404040)), 6, '0', STR_PAD_LEFT); // Darker solemn colors
                } else if ($category === 'Creative') {
                    $font = 'Poppins, sans-serif';
                } else {
                    $font = 'Inter, sans-serif';
                }
                
                $config = [
                    'layout' => $layout,
                    'header_style' => $header,
                    'experience_style' => $experience,
                    'theme_color' => $color,
                    'font_family' => $font,
                    'spacing' => 'compact',
                    'show_icons' => ($i % 2 === 0)
                ];

                $templates[] = [
                    'name' => $category . ' Template ' . $i,
                    'slug' => strtolower($category) . '_template_' . $i,
                    'category' => $category,
                    'is_active' => true,
                    'design_config' => json_encode($config),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
                
                $count++;
            }
        }
        
        CVTemplate::insert($templates);
    }
}
