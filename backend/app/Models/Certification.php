<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = ['cv_id', 'name', 'issuer', 'date', 'url', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
