<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Toutes les routes frontend sont servies par React SPA.
|
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');