<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Root extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function words()
    {
        return $this->hasMany(Word::class);
    }
}
