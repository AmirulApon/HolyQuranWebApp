<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Word extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ayah()
    {
        return $this->belongsTo(Ayah::class);
    }

    public function root()
    {
        return $this->belongsTo(Root::class);
    }
}
