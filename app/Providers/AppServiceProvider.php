<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // descomentar para logar as queries no arquivo de log
        
        // if (config('app.debug')) {
        //     DB::listen(fn ($query) => Log::debug('SQL', [
        //         'sql'      => $query->sql,
        //         'bindings' => $query->bindings,
        //         'time'     => $query->time . 'ms',
        //     ]));
        // }
    }
}
