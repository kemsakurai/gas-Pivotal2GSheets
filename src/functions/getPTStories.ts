import Utils from "../Utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
function getTimeOfFailureAndResolution(story: any) {
    let timeOfFailure, timeOfFailureResolution = '';
    if (story.story_type != 'bug' || !story.description) {
        return {
            timeOfFailure:'',
            timeOfFailureResolution:''
        }
    }
    const lines = story.description.split('\n');
    let textExists = false;
    for (const line of lines) {
        if (textExists) {
            console.log(line);
            const trimmedLine = line.trim();
            if (isDate(trimmedLine)) {
                timeOfFailure = trimmedLine
                break;
            } else {
                timeOfFailure = ''
            }
        }
        textExists = line.includes('障害発生時刻');
    }
    textExists = false;
    for (const line of lines) {
        if (textExists) {
            console.log(line);
            const trimmedLine = line.trim();
            if (isDate(trimmedLine)) {
                timeOfFailureResolution = trimmedLine
                break;
            } else {
                timeOfFailureResolution = ''
            }
        }
        textExists = line.includes('障害解消時刻');
    }
    return {
        timeOfFailure:timeOfFailure,
        timeOfFailureResolution:timeOfFailureResolution
    }
}
const isDate = (v: string | number | Date) => !isNaN(new Date(v).getTime());


function getUpdateStateAtsFrom(activities: any) {
    let startedAt,finishedAt,deliveredAt,rejectedAt = '';
    for(const activity of activities) {
        if(activity['kind'] == 'story_update_activity') {
            if(activity['highlight'] == 'started') {
                startedAt = activity['occurred_at']
            } else if (activity['highlight'] == 'finished') {
                finishedAt = activity['occurred_at']
            } else if (activity['highlight'] == 'delivered') {
                deliveredAt = activity['occurred_at']
            } else if (activity['highlight'] == 'rejected') {
                rejectedAt = activity['occurred_at']
            }
        }
    }
    return {
        startedAt: startedAt,
        finishedAt: finishedAt,
        deliveredAt: deliveredAt,
        rejectedAt: rejectedAt
    }
}

export function getPTStories() {
    const projectId = Number(PropertiesService.getScriptProperties().getProperty("PROJECT_ID")) ?? 0;
    const releases = Utils.fetchReleases(projectId);
    const releasesAndStories: ReleasesAndStories = {};
    for (const release of releases) {
        releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
    }
    const rows = [];
    const header = [];
    header.push("Story type");
    header.push("Story URL");
    header.push("Story name");
    header.push("Story description");
    header.push("Story point");
    header.push("Story created_at");
    header.push("Story updated_at");
    header.push("Story started_at")
    header.push("Story finished_at")
    header.push("Story delivered_at")
    header.push("Story rejected_at")
    header.push("Story accepted_at");
    header.push("Story Time of failure");
    header.push("Story Time of failure resolution");
    header.push("Story status");
    header.push("Release name");
    header.push("Release status");
    header.push("Release deadline");
    header.push("Release created_at");
    header.push("Release updated_at");
    header.push("Release accepted_at");
    rows.push(header);
    for (const release of releases) {
        const stories = releasesAndStories[release.id];
        for (const story of stories) {
            const columns = [];
            columns.push(story.story_type);
            columns.push(story.url);
            columns.push(story.name);
            columns.push(story.description);
            columns.push(story.estimate);
            columns.push(Utils.formatDateForGSheets(story.created_at));
            columns.push(Utils.formatDateForGSheets(story.updated_at));
            const activities = Utils.fetchActivities(projectId, story.id);
            const updateStateAts = getUpdateStateAtsFrom(activities);
            columns.push(Utils.formatDateForGSheets(updateStateAts.startedAt))
            columns.push(Utils.formatDateForGSheets(updateStateAts.finishedAt))
            columns.push(Utils.formatDateForGSheets(updateStateAts.deliveredAt))
            columns.push(Utils.formatDateForGSheets(updateStateAts.rejectedAt))
            columns.push(Utils.formatDateForGSheets(story.accepted_at));
            const timeOfFailureAndFailureResolution= getTimeOfFailureAndResolution(story)
            columns.push(timeOfFailureAndFailureResolution.timeOfFailure);
            columns.push(timeOfFailureAndFailureResolution.timeOfFailureResolution);
            columns.push(story.current_state);
            columns.push(release.name);
            columns.push(release.current_state);
            columns.push(Utils.formatDateForGSheets(release.deadline));
            columns.push(Utils.formatDateForGSheets(release.created_at));
            columns.push(Utils.formatDateForGSheets(release.updated_at));
            columns.push(Utils.formatDateForGSheets(release.accepted_at));
            rows.push(columns);
        }
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChangeLogs");
    sheet?.clear();
    sheet?.getRange(1, 1, rows.length, header.length).setValues(rows);
}
