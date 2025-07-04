<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Preference;
use App\Models\SetupProgress;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        SetupProgress::create([
            'user_id' => $user->id,
            'current_step' => 'spenders',
            'is_completed' => false,
        ]);

        Preference::create([
            'user_id' => $user->id,
            'currency' => 'EUR',
            'language' => 'fr',
            'theme' => 'light',
            'number_format' => 'cd',
            'date_format' => 'dmy',
            'charts_color' => 'hsl(198.6 88.7% 48.4%)',
            'charts_style' => 'line',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('setup.spenders');
    }


}
