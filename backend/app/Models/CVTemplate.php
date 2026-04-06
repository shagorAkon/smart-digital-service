<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CVTemplate extends Model
{
    use HasFactory;

    protected $table = 'cv_templates';
    protected $guarded = ['id'];

    public function cvs()
    {
        return $this->hasMany(Cv::class, 'template_id', 'id');
    }

    protected $casts = [
        'design_config' => 'array',
        'is_active' => 'boolean'
    ];
}
