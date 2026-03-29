<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_id')->constrained('cvs')->onDelete('cascade');
            $table->string('type');
            $table->json('data');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_items');
    }
};
