<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Cv;
use Illuminate\Support\Facades\DB;

class CVController extends Controller
{
    public function index(Request $request)
    {
        $cvs = $request->user()->cvs()->orderBy('updated_at', 'desc')->get();
        return response()->json($cvs);
    }

    public function show(Request $request, $id)
    {
        $cv = $request->user()->cvs()->with('items')->findOrFail($id);
        return response()->json($cv);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'photo_path' => 'nullable|string',
            'template' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'font_family' => 'nullable|string',
            'layout' => 'nullable|string',
            'items' => 'nullable|array'
        ]);

        DB::beginTransaction();
        try {
            $cv = $request->user()->cvs()->create(collect($validated)->except('items')->toArray());

            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $index => $item) {
                    $cv->items()->create([
                        'type' => $item['type'],
                        'data' => $item['data'],
                        'order' => $item['order'] ?? $index
                    ]);
                }
            }
            DB::commit();
            
            return response()->json($cv->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create CV'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $cv = $request->user()->cvs()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'photo_path' => 'nullable|string',
            'template' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'font_family' => 'nullable|string',
            'layout' => 'nullable|string',
            'items' => 'nullable|array'
        ]);

        DB::beginTransaction();
        try {
            $cv->update(collect($validated)->except('items')->toArray());

            if (isset($validated['items'])) {
                $cv->items()->delete(); // clear old
                foreach ($validated['items'] as $index => $item) {
                    $cv->items()->create([
                        'type' => $item['type'],
                        'data' => $item['data'],
                        'order' => $item['order'] ?? $index
                    ]);
                }
            }
            DB::commit();

            return response()->json($cv->load('items'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update CV'], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $cv = $request->user()->cvs()->findOrFail($id);
        $cv->delete();
        return response()->json(['message' => 'CV deleted successfully']);
    }

    public function duplicate(Request $request, $id)
    {
        $cv = $request->user()->cvs()->with('items')->findOrFail($id);
        
        DB::beginTransaction();
        try {
            $newCv = $cv->replicate();
            $newCv->title = $newCv->title . ' (Copy)';
            $newCv->save();

            foreach ($cv->items as $item) {
                $newItem = $item->replicate();
                $newItem->cv_id = $newCv->id;
                $newItem->save();
            }
            DB::commit();

            return response()->json($newCv->load('items'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to duplicate CV'], 500);
        }
    }

    public function generate(Request $request)
    {
        // Accept the full payload to generate on the fly
        $data = $request->all();
        
        $templateName = $data['template'] ?? 'minimal';
        $viewName = "cv.templates.{$templateName}";
        
        if (!view()->exists($viewName)) {
            $viewName = 'cv-template';
        }

        $pdf = Pdf::loadView($viewName, ['cv' => $data]);
        return $pdf->stream('generated-cv.pdf');
    }
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('cv-photos', 'public');
            return response()->json(['photo_path' => '/storage/' . $path]);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
