<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

use App\Models\RoomType;
use App\Models\Room;

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
        $clientRole = Role::firstOrCreate(['name' => 'client']);

        // Create a super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole($superAdminRole);

        // Create a staff admin user
        $staffAdmin = User::firstOrCreate(
            ['email' => 'staffadmin@example.com'],
            [
                'first_name' => 'Staff',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $staffAdmin->assignRole($staffAdminRole);

        // Create a test user without roles
        $client = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $client->assignRole($clientRole);

        $this->call(RoomSeeder::class);
    }
}

