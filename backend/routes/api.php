<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/cv/generate', [\App\Http\Controllers\CVController::class, 'generate']);

    // Admin Routes
    Route::middleware('is_admin')->group(function () {
        Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'index']);
        Route::put('/admin/users/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateStatus']);
        Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);
    });
});
