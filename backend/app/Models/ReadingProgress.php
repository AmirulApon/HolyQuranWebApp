<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadingProgress extends Model
{
    use HasFactory;

    protected $table = 'reading_progresses';

    protected $fillable = [
        'user_id',
        'surah_id',
        'last_read_ayah_number',
        'is_completed'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
