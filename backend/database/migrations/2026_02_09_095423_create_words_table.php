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
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ayah_id')->constrained()->cascadeOnDelete();
            $table->integer('position');
            $table->string('text_uthmani');
            $table->string('text_indopak')->nullable();
            $table->string('translation_en')->nullable();
            $table->string('translation_bn')->nullable();
            $table->foreignId('root_id')->nullable()->constrained('roots')->nullOnDelete();
            $table->string('grammar_type')->nullable();
            $table->timestamps();

            $table->index(['ayah_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};
