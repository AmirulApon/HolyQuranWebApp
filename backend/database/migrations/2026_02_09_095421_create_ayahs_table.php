<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ayahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surah_id')->constrained()->cascadeOnDelete();
            $table->integer('number');
            $table->integer('number_in_quran');
            $table->integer('juz');
            $table->integer('page');
            $table->text('text_uthmani');
            $table->text('text_indopak')->nullable();
            $table->boolean('sajda')->default(false);
            $table->timestamps();
            
            $table->index(['surah_id', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ayahs');
    }
};
