<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class CompanyFirms extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'company_member_firms';
}
