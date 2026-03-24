<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class CVController extends Controller
{
    public function generate(Request $request)
    {
        // Simple validation to ensure basic structure
        $data = $request->validate([
            'fullName' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'experience' => 'nullable|string',
            'education' => 'nullable|string',
            'skills' => 'nullable|string',
        ]);

        // Fallbacks for empty data mapping to the blade view
        $pdf = Pdf::loadView('cv-template', $data);

        // In DomPDF, streaming directly returns application/pdf content
        return $pdf->stream('generated-cv.pdf');
    }
}
