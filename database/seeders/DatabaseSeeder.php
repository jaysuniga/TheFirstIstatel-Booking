<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles if not exist
        $superAdminRole = Role::firstOrCreate(['name' => 'super admin']);
        $staffAdminRole = Role::firstOrCreate(['name' => 'staff admin']);

        // Create a super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole($superAdminRole);

        // Create a staff admin user
        $staffAdmin = User::firstOrCreate(
            ['email' => 'staffadmin@example.com'],
            [
                'name' => 'Staff Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $staffAdmin->assignRole($staffAdminRole);

        // Create a test user without roles
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
