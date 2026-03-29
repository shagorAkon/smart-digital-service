<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // minimal, modern, creative, corporate
            $table->boolean('is_active')->default(true);
            $table->string('thumbnail_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_templates');
    }
};
