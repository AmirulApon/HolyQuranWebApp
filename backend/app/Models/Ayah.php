<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ayah extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function surah()
    {
        return $this->belongsTo(Surah::class);
    }

    public function words()
    {
        return $this->hasMany(Word::class)->orderBy('position');
    }
}
