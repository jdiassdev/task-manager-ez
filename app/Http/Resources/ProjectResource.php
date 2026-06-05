<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProjectResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return $this->filterFields([
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'status'      => $this->status->value,
            'tasks_count' => $this->whenCounted('tasks'),
            'tasks'       => TaskResource::collection($this->whenLoaded('tasks')),
            'created_at'  => $this->created_at?->toDateTimeString(),
            'updated_at'  => $this->updated_at?->toDateTimeString(),
        ]);
    }
}
