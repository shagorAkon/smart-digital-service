<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Fetch all users except super admins, optionally filter by status
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'admin');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // Update user status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,blocked'
        ]);

        $user = User::findOrFail($id);
        
        // Ensure we don't accidentally block another admin
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot modify admin status'], 403);
        }

        $user->status = $request->status;
        $user->save();

        return response()->json([
            'message' => "User status updated to {$request->status} successfully",
            'user' => $user
        ]);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
