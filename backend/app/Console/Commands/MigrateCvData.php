<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\CvItem;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Skill;
use App\Models\Project;
use App\Models\Language;
use App\Models\SocialLink;
use App\Models\Certification;

#[Signature('app:migrate-cv-data')]
#[Description('Migrates old JSON cv_items to structured tables')]
class MigrateCvData extends Command
{
    public function handle()
    {
        $this->info('Starting CV data migration...');
        $items = CvItem::all();
        $count = 0;

        foreach ($items as $item) {
            $data = is_string($item->data) ? json_decode($item->data, true) : $item->data;
            if (!$data) continue;

            $type = strtolower($item->type);
            $cvId = $item->cv_id;
            $order = $item->order ?? 0;

            try {
                if ($type === 'experience' || $type === 'work') {
                    Experience::create([
                        'cv_id' => $cvId,
                        'company' => $data['company'] ?? 'Unknown Company',
                        'position' => $data['position'] ?? $data['title'] ?? 'Unknown Position',
                        'start_date' => $data['start_date'] ?? null,
                        'end_date' => $data['end_date'] ?? null,
                        'current' => $data['current'] ?? false,
                        'description' => $data['description'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'education') {
                    Education::create([
                        'cv_id' => $cvId,
                        'institution' => $data['institution'] ?? $data['school'] ?? 'Unknown Institution',
                        'degree' => $data['degree'] ?? $data['title'] ?? 'Unknown Degree',
                        'start_date' => $data['start_date'] ?? null,
                        'end_date' => $data['end_date'] ?? null,
                        'current' => $data['current'] ?? false,
                        'description' => $data['description'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'skill' || $type === 'skills') {
                    Skill::create([
                        'cv_id' => $cvId,
                        'name' => $data['name'] ?? $data['title'] ?? 'Unknown Skill',
                        'level' => $data['level'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'project' || $type === 'projects') {
                    Project::create([
                        'cv_id' => $cvId,
                        'title' => $data['title'] ?? $data['name'] ?? 'Unknown Project',
                        'link' => $data['link'] ?? $data['url'] ?? null,
                        'description' => $data['description'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'language' || $type === 'languages') {
                    Language::create([
                        'cv_id' => $cvId,
                        'name' => $data['name'] ?? $data['language'] ?? 'Unknown Language',
                        'proficiency' => $data['proficiency'] ?? $data['level'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'certification' || $type === 'certifications') {
                    Certification::create([
                        'cv_id' => $cvId,
                        'name' => $data['name'] ?? $data['title'] ?? 'Unknown Certification',
                        'issuer' => $data['issuer'] ?? null,
                        'date' => $data['date'] ?? null,
                        'url' => $data['url'] ?? $data['link'] ?? null,
                        'order' => $order
                    ]);
                } elseif ($type === 'social_link' || $type === 'social') {
                    SocialLink::create([
                        'cv_id' => $cvId,
                        'platform' => $data['platform'] ?? $data['name'] ?? 'Unknown',
                        'url' => $data['url'] ?? $data['link'] ?? '#',
                        'order' => $order
                    ]);
                }
                $count++;
            } catch (\Exception $e) {
                $this->error("Failed to migrate item ID {$item->id}: " . $e->getMessage());
            }
        }

        $this->info("Successfully migrated {$count} CV items.");
    }
}
