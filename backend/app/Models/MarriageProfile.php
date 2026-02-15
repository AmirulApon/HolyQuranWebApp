<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MarriageProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'gender',
        'date_of_birth',
        'marital_status',
        'profession',
        'country',
        'is_public',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
