<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = ['cv_id', 'institution', 'degree', 'start_date', 'end_date', 'current', 'description', 'order'];

    public function cv()
    {
        return $this->belongsTo(Cv::class);
    }
}
