<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['cv_id', 'title', 'link', 'description', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
