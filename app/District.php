<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class District extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'districts';
}
