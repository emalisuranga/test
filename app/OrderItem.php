<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class OrderItem extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'order_items';
}
