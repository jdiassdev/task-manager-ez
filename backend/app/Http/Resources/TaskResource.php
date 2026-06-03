<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TaskResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return $this->filterFields([
            'id'          => $this->id,
            'project_id'  => $this->project_id,
            'title'       => $this->title,
            'description' => $this->description,
            'status'      => $this->status->value,
            'priority'    => $this->priority->value,
            'due_date'    => $this->due_date?->toDateString(),
            'is_overdue'  => $this->due_date !== null
                && $this->due_date->lt(Carbon::today())
                && $this->status->value !== 'done',
            'project'     => new ProjectResource($this->whenLoaded('project')),
            'created_at'  => $this->created_at->toDateTimeString(),
            'updated_at'  => $this->updated_at->toDateTimeString(),
        ]);
    }
}
