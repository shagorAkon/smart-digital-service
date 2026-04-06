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
        Schema::table('cv_templates', function (Blueprint $table) {
            $table->string('category')->default('Modern');
            $table->json('design_config')->nullable();
        });

        Schema::table('cvs', function (Blueprint $table) {
            $table->foreignId('template_id')->nullable()->constrained('cv_templates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cv_templates', function (Blueprint $table) {
            $table->dropColumn(['category', 'design_config']);
        });

        Schema::table('cvs', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropColumn('template_id');
        });
    }
};

