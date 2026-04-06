<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = ['cv_id', 'platform', 'url', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
