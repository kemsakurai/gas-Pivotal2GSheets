declare module "gas-webpack-plugin";
interface ReleasesAndStories {
    [key: number]: any
}
interface Ticket {
    kind: string;
    id: number;
    created_at: string;
    updated_at: string;
    accepted_at: string;
    estimate: number;
    story_type: string;
    story_priority: string;
    name: string;
    description: string;
    current_state: string;
    requested_by_id: number;
    url: string;
    project_id: number;
    owner_ids: number[];
    labels: Label[];
    owned_by_id: number;
}

interface Label {
    id: number;
    project_id: number;
    kind: string;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Activity {
    kind: string;
    guid: string;
    project_version: number;
    message: string;
    highlight: string;
    occurred_at: string;
    changes: Change[];
}

interface Change {
    kind: string;
    change_type: string;
    id: number;
    new_values: NewValues;
    name?: string;
    story_type?: string;
    story_priority?: string;
}

interface NewValues {
    id: number;
    project_id: number;
    name: string;
    description: string;
    story_type: string;
    current_state: string;
    estimate: number;
    accepted_at: string;
    requested_by_id: number;
    owned_by_id: number;
    owner_ids: number[];
    label_ids: number[];
    follower_ids: number[];
    created_at: string;
    updated_at: string;
    before_id: number;
    blocked_story_ids: number[];
    story_priority: string;
    labels: string[];
}

interface UpdateStateAts {
    startedAt?: string;
    finishedAt?: string;
    deliveredAt?: string;
    rejectedAt?: string;
}