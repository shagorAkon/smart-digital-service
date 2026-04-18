<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CVTemplate extends Model
{
    use HasFactory;

    protected $table = 'cv_templates';
    protected $guarded = ['id'];

    protected $appends = ['thumbnail'];

    public function getThumbnailAttribute()
    {
        if (!$this->thumbnail_path) {
            return null;
        }
        
        // Ensure it returns a full URL if it's a relative path
        if (str_starts_with($this->thumbnail_path, 'http')) {
            return $this->thumbnail_path;
        }

        return asset($this->thumbnail_path);
    }

    public function cvs()
    {
        return $this->hasMany(Cv::class, 'template_id', 'id');
    }

    protected $casts = [
        'design_config' => 'array',
        'is_active' => 'boolean'
    ];
}
