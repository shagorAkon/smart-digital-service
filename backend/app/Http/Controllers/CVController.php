<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Cv;
use Illuminate\Support\Facades\DB;

class CVController extends Controller
{
    protected $relations = [
        'experiences', 'educations', 'skills', 'projects', 
        'certifications', 'languages', 'interests'
    ];

    public function index(Request $request)
    {
        $cvs = $request->user()->cvs()->orderBy('updated_at', 'desc')->get();
        return response()->json($cvs);
    }

    public function show(Request $request, $id)
    {
        $cv = $request->user()->cvs()->with([
            'experiences', 'educations', 'skills', 'projects', 
            'certifications', 'languages', 'socialLinks', 'interests'
        ])->findOrFail($id);
        
        // Load legacy items if they exist so the frontend doesn't break
        $cv->load('items');
        
        return response()->json($cv);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCv($request);

        DB::beginTransaction();
        try {
            $cv = $request->user()->cvs()->create(collect($validated)->except(array_merge($this->relations, ['social_links', 'items']))->toArray());

            $this->syncRelations($cv, $request);

            DB::commit();
            return response()->json($this->getLoadedCv($cv), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create CV: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $cv = $request->user()->cvs()->findOrFail($id);
        $validated = $this->validateCv($request);

        DB::beginTransaction();
        try {
            $cv->update(collect($validated)->except(array_merge($this->relations, ['social_links', 'items']))->toArray());

            $this->syncRelations($cv, $request);

            DB::commit();
            return response()->json($this->getLoadedCv($cv));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update CV: ' . $e->getMessage()], 500);
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
        $cv = $this->getLoadedCv($request->user()->cvs()->findOrFail($id));
        
        DB::beginTransaction();
        try {
            $newCv = $cv->replicate();
            $newCv->title = $newCv->title . ' (Copy)';
            $newCv->save();

            // Duplicate relations
            foreach (array_merge($this->relations, ['socialLinks', 'items']) as $relation) {
                if ($cv->relationLoaded($relation)) {
                    foreach ($cv->{$relation} as $item) {
                        $newItem = $item->replicate();
                        $newItem->cv_id = $newCv->id;
                        $newItem->save();
                    }
                }
            }

            DB::commit();
            return response()->json($this->getLoadedCv($newCv));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to duplicate CV'], 500);
        }
    }

    public function generate(Request $request)
    {
        $cvData = $request->all();
        
        // Find which template to render using template_id
        if (isset($cvData['template_id'])) {
            $templateModel = \App\Models\CVTemplate::find($cvData['template_id']);
            $slug = $templateModel ? 'master_engine' : 'modern';
        } else {
            $slug = isset($cvData['template']) ? $cvData['template'] : 'modern';
        }
        
        // Add parsed config to cvData so Blade can read it
        if (isset($templateModel) && $templateModel) {
            $cvData['design_config'] = is_string($templateModel->design_config) ? json_decode($templateModel->design_config, true) : $templateModel->design_config;
        }

        // Fallback to modern if blade doesn't exist
        $viewName = "cv.templates.{$slug}";
        if (!view()->exists($viewName)) {
            $viewName = "cv.templates.modern";
        }

        $pdf = Pdf::loadView($viewName, ['cv' => $cvData]);
        return $pdf->stream('generated-cv.pdf');
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|file|mimes:jpg,jpeg,png,webp|max:5120'
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('cv-photos', 'public');
            return response()->json(['photo_path' => '/storage/' . $path]);
        }
        return response()->json(['message' => 'No file uploaded'], 400);
    }

    /**
     * Helpers
     */
    private function validateCv(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'career_objective' => 'nullable|string',
            'photo_path' => 'nullable|string',
            'template_id' => 'nullable|exists:cv_templates,id',
            'template' => 'nullable|string', // Keeping for legacy temporarily
            'primary_color' => 'nullable|string',
            'font_family' => 'nullable|string',
            'layout' => 'nullable|string',
            'experiences' => 'nullable|array',
            'educations' => 'nullable|array',
            'skills' => 'nullable|array',
            'projects' => 'nullable|array',
            'certifications' => 'nullable|array',
            'languages' => 'nullable|array',
            'social_links' => 'nullable|array',
            'items' => 'nullable|array'
        ]);
    }

    private function syncRelations(Cv $cv, Request $request)
    {
        foreach ($this->relations as $relation) {
            if ($request->has($relation)) {
                $cv->{$relation}()->delete();
                foreach ($request->input($relation) as $index => $item) {
                    $item['order'] = $item['order'] ?? $index;
                    $cv->{$relation}()->create($item);
                }
            }
        }
        
        if ($request->has('social_links')) {
            $cv->socialLinks()->delete();
            foreach ($request->input('social_links') as $index => $item) {
                $item['order'] = $item['order'] ?? $index;
                $cv->socialLinks()->create($item);
            }
        }

        // Legacy support
        if ($request->has('items')) {
            $cv->items()->delete();
            foreach ($request->input('items') as $index => $item) {
                $item['order'] = $item['order'] ?? $index;
                $cv->items()->create($item);
            }
        }
    }

    private function getLoadedCv(Cv $cv)
    {
        return $cv->load(array_merge($this->relations, ['socialLinks', 'items']));
    }
}
