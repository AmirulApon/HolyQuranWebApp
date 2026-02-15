<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leader extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'district',
        'phone',
        'email',
        'image_url',
        'bio',
        'is_active',
    ];
}
