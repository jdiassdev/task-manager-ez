<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    protected ?array $fields = null;

    public function only(array $fields): static
    {
        $this->fields = $fields;
        return $this;
    }

    protected function filterFields(array $data): array
    {
        if ($this->fields === null) {
            return $data;
        }

        return array_intersect_key($data, array_flip($this->fields));
    }
}
