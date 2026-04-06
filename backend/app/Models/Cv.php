<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cv extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CvItem::class)->orderBy('order');
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class)->orderBy('order');
    }

    public function educations()
    {
        return $this->hasMany(Education::class)->orderBy('order');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class)->orderBy('order');
    }

    public function projects()
    {
        return $this->hasMany(Project::class)->orderBy('order');
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class)->orderBy('order');
    }

    public function languages()
    {
        return $this->hasMany(Language::class)->orderBy('order');
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class)->orderBy('order');
    }
}
