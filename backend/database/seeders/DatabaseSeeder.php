<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if admin already exists
        if (!User::where('email', 'admin@smartdigital.com')->exists()) {
            User::create([
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@smartdigital.com',
                'password' => Hash::make('password123'),
                'dob' => '1990-01-01',
                'education' => 'Master of Business Administration',
                'address' => json_encode(['division' => 'Dhaka', 'district' => 'Dhaka', 'thana' => 'Gulshan']),
                'service_interest' => 'Others',
                'status' => 'approved',
                'role' => 'admin',
            ]);
        }
    }
}
