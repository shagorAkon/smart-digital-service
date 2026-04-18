<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\CVTemplate;

class CVTemplateConfigSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cv_templates')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $templates = [
            // ── MODERN BASE (6 variations) ──
            ['name' => 'Modern Blue',        'slug' => 'modern_blue',        'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#2563eb', 'font_family' => 'Inter, sans-serif'],
            ['name' => 'Modern Emerald',     'slug' => 'modern_emerald',     'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#059669', 'font_family' => 'Inter, sans-serif'],
            ['name' => 'Modern Violet',      'slug' => 'modern_violet',      'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#7c3aed', 'font_family' => 'Plus Jakarta Sans, sans-serif'],
            ['name' => 'Modern Rose',        'slug' => 'modern_rose',        'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#e11d48', 'font_family' => 'DM Sans, sans-serif'],
            ['name' => 'Modern Amber',       'slug' => 'modern_amber',       'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#d97706', 'font_family' => 'Outfit, sans-serif'],
            ['name' => 'Modern Teal',        'slug' => 'modern_teal',        'category' => 'Modern',       'component' => 'modern',    'primary_color' => '#0d9488', 'font_family' => 'Nunito Sans, sans-serif'],

            // ── CREATIVE BASE (6 variations) ──
            ['name' => 'Creative Pink',      'slug' => 'creative_pink',      'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#db2777', 'font_family' => 'Poppins, sans-serif'],
            ['name' => 'Creative Indigo',    'slug' => 'creative_indigo',    'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#4f46e5', 'font_family' => 'Quicksand, sans-serif'],
            ['name' => 'Creative Orange',    'slug' => 'creative_orange',    'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#ea580c', 'font_family' => 'Rubik, sans-serif'],
            ['name' => 'Creative Cyan',      'slug' => 'creative_cyan',      'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#0891b2', 'font_family' => 'Montserrat, sans-serif'],
            ['name' => 'Creative Lime',      'slug' => 'creative_lime',      'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#65a30d', 'font_family' => 'Manrope, sans-serif'],
            ['name' => 'Creative Fuchsia',   'slug' => 'creative_fuchsia',   'category' => 'Creative',     'component' => 'creative',  'primary_color' => '#c026d3', 'font_family' => 'Comfortaa, sans-serif'],

            // ── MINIMAL BASE (6 variations) ──
            ['name' => 'Minimal Classic',    'slug' => 'minimal_classic',    'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#333333', 'font_family' => 'Arial, sans-serif'],
            ['name' => 'Minimal Slate',      'slug' => 'minimal_slate',      'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#475569', 'font_family' => 'Lato, sans-serif'],
            ['name' => 'Minimal Navy',       'slug' => 'minimal_navy',       'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#1e3a5f', 'font_family' => 'Source Sans Pro, sans-serif'],
            ['name' => 'Minimal Stone',      'slug' => 'minimal_stone',      'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#78716c', 'font_family' => 'Raleway, sans-serif'],
            ['name' => 'Minimal Forest',     'slug' => 'minimal_forest',     'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#166534', 'font_family' => 'Karla, sans-serif'],
            ['name' => 'Minimal Charcoal',   'slug' => 'minimal_charcoal',   'category' => 'Minimal',      'component' => 'minimal',   'primary_color' => '#1c1917', 'font_family' => 'Roboto, sans-serif'],

            // ── CORPORATE BASE (6 variations) ──
            ['name' => 'Corporate Dark',     'slug' => 'corporate_dark',     'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#1e293b', 'font_family' => 'Georgia, serif'],
            ['name' => 'Corporate Navy',     'slug' => 'corporate_navy',     'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#1e3a8a', 'font_family' => 'Merriweather, serif'],
            ['name' => 'Corporate Burgundy', 'slug' => 'corporate_burgundy', 'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#881337', 'font_family' => 'Playfair Display, serif'],
            ['name' => 'Corporate Graphite', 'slug' => 'corporate_graphite', 'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#374151', 'font_family' => 'Libre Baskerville, serif'],
            ['name' => 'Corporate Forest',   'slug' => 'corporate_forest',   'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#14532d', 'font_family' => 'PT Serif, serif'],
            ['name' => 'Corporate Mahogany', 'slug' => 'corporate_mahogany', 'category' => 'Corporate',    'component' => 'corporate', 'primary_color' => '#7c2d12', 'font_family' => 'Lora, serif'],

            // ── ELEGANT BASE (6 variations) ──
            ['name' => 'Elegant Sky',        'slug' => 'elegant_sky',        'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#0ea5e9', 'font_family' => 'Montserrat, sans-serif'],
            ['name' => 'Elegant Purple',     'slug' => 'elegant_purple',     'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#9333ea', 'font_family' => 'Josefin Sans, sans-serif'],
            ['name' => 'Elegant Coral',      'slug' => 'elegant_coral',      'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#f43f5e', 'font_family' => 'Nunito, sans-serif'],
            ['name' => 'Elegant Gold',       'slug' => 'elegant_gold',       'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#b45309', 'font_family' => 'Cormorant Garamond, serif'],
            ['name' => 'Elegant Ocean',      'slug' => 'elegant_ocean',      'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#0e7490', 'font_family' => 'Cabin, sans-serif'],
            ['name' => 'Elegant Slate',      'slug' => 'elegant_slate',      'category' => 'Elegant',      'component' => 'elegant',   'primary_color' => '#334155', 'font_family' => 'Work Sans, sans-serif'],
        ];

        $rows = [];
        foreach ($templates as $t) {
            $rows[] = [
                'name'          => $t['name'],
                'slug'          => $t['slug'],
                'category'      => $t['category'],
                'is_active'     => true,
                'thumbnail_path'=> null,
                'design_config' => json_encode([
                    'component'     => $t['component'],
                    'primary_color' => $t['primary_color'],
                    'font_family'   => $t['font_family'],
                ]),
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        CVTemplate::insert($rows);
    }
}
