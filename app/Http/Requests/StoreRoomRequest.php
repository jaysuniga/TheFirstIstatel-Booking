<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_number' => 'required|string|max:50|unique:rooms,room_number',
            'room_type_id' => 'required|exists:room_types,id',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|string|in:available,occupied,maintenance',
            'images.*' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120', // 5MB
            'image_360' => 'nullable|image|mimes:jpeg,png,gif,webp',     // 5MB
        ];
    }
}
