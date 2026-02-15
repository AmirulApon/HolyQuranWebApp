<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Surah extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ayahs()
    {
        return $this->hasMany(Ayah::class);
    }
}
