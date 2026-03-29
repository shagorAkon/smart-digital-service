<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CVTemplate;

class CVTemplateController extends Controller
{
    // Public - Get active templates
    public function index()
    {
        return response()->json(CVTemplate::where('is_active', true)->get());
    }

    // Admin - Get all templates including inactive
    public function adminIndex()
    {
        return response()->json(CVTemplate::all());
    }

    // Admin - Add new template record
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:cv_templates,slug',
            'is_active' => 'boolean'
        ]);

        $template = CVTemplate::create($validated);
        return response()->json($template, 201);
    }

    // Admin - Toggle active status
    public function toggleActive($id)
    {
        $template = CVTemplate::findOrFail($id);
        $template->is_active = !$template->is_active;
        $template->save();
        
        return response()->json($template);
    }

    // Admin - Record Deletion
    public function destroy($id)
    {
        $template = CVTemplate::findOrFail($id);
        $template->delete();
        return response()->json(['message' => 'Template deleted']);
    }
}
