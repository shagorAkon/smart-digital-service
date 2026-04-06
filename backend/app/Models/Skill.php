<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['cv_id', 'name', 'level', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
