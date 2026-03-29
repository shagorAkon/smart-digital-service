<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/cvs', [\App\Http\Controllers\CVController::class, 'index']);
    Route::post('/cvs', [\App\Http\Controllers\CVController::class, 'store']);
    Route::post('/cvs/upload-photo', [\App\Http\Controllers\CVController::class, 'uploadPhoto']);
    Route::get('/cvs/{id}', [\App\Http\Controllers\CVController::class, 'show']);
    Route::put('/cvs/{id}', [\App\Http\Controllers\CVController::class, 'update']);
    Route::delete('/cvs/{id}', [\App\Http\Controllers\CVController::class, 'destroy']);
    Route::post('/cvs/{id}/duplicate', [\App\Http\Controllers\CVController::class, 'duplicate']);
    Route::post('/cv/generate', [\App\Http\Controllers\CVController::class, 'generate']);
    Route::get('/cv-templates', [\App\Http\Controllers\CVTemplateController::class, 'index']);

    // Admin Routes
    Route::middleware('is_admin')->group(function () {
        Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'index']);
        Route::put('/admin/users/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateStatus']);
        Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);
        
        Route::get('/admin/cv-templates', [\App\Http\Controllers\CVTemplateController::class, 'adminIndex']);
        Route::post('/admin/cv-templates', [\App\Http\Controllers\CVTemplateController::class, 'store']);
        Route::put('/admin/cv-templates/{id}/toggle', [\App\Http\Controllers\CVTemplateController::class, 'toggleActive']);
        Route::delete('/admin/cv-templates/{id}', [\App\Http\Controllers\CVTemplateController::class, 'destroy']);
    });
});
