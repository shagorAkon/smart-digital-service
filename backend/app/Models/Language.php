<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = ['cv_id', 'name', 'proficiency', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
