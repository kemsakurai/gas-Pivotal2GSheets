import Utils from "../Utils";

function getTimeOfFailureAndResolution(ticket: Ticket) {
    let timeOfFailure, timeOfFailureResolution = '';
    const failureDatetimeIdentificationString = Utils.getProperty("FAILURE_DATETIME_IDENTIFICATION_STRING", "障害発生日時")
    const failureResolutionDatetimeIdentificationString = Utils.getProperty("FAILURE_RESOLUTION_DATETIME_IDENTIFICATION_STRING","障害解消日時")
    if (ticket.story_type != 'bug' || !ticket.description) {
        return {
            timeOfFailure:'',
            timeOfFailureResolution:''
        }
    }
    const lines = ticket.description.split('\n');
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
        textExists = line.includes(failureDatetimeIdentificationString);
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
        textExists = line.includes(failureResolutionDatetimeIdentificationString);
    }
    return {
        timeOfFailure:timeOfFailure,
        timeOfFailureResolution:timeOfFailureResolution
    }
}
const isDate = (v: string | number | Date) => !isNaN(new Date(v).getTime());

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
function getUpdateStateAtsFrom(activities: Activity[]): UpdateStateAts {
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

function createHeader() {
    const header = [];
    header.push("Story type");
    header.push("Story URL");
    header.push("Story name");
    header.push("Story description");
    header.push("Story point");
    header.push("Story created_at");
    header.push("Story updated_at");
  const doGetFourKeysData = Utils.convertStrToBool(Utils.getProperty("DO_GET_FOUR_KEYS_DATA", "false"));
  if(doGetFourKeysData) {
        header.push("Story started_at");
        header.push("Story finished_at");
        header.push("Story delivered_at");
        header.push("Story rejected_at");
    }
    header.push("Story accepted_at");
    if(doGetFourKeysData) {
        header.push("Story Time of failure");
        header.push("Story Time of failure resolution");
    }
    header.push("Story status");
    header.push("Release name");
    header.push("Release status");
    header.push("Release deadline");
    header.push("Release created_at");
    header.push("Release updated_at");
    header.push("Release accepted_at");
    return header;
}

function createColumns(story: any, projectId: number, release: any) {
  const columns = [];
  columns.push(story.story_type);
  columns.push(story.url);
  columns.push(story.name);
  columns.push(story.description);
  columns.push(story.estimate);
  columns.push(Utils.formatDateForGSheets(story.created_at));
  columns.push(Utils.formatDateForGSheets(story.updated_at));
  const doGetFourKeysData = Utils.convertStrToBool(Utils.getProperty("DO_GET_FOUR_KEYS_DATA", "false"));
  if (doGetFourKeysData) {
    const activities = Utils.fetchActivities(projectId, story.id);
    const updateStateAts = getUpdateStateAtsFrom(activities);
    columns.push(Utils.formatDateForGSheets(updateStateAts.startedAt));
    columns.push(Utils.formatDateForGSheets(updateStateAts.finishedAt));
    columns.push(Utils.formatDateForGSheets(updateStateAts.deliveredAt));
    columns.push(Utils.formatDateForGSheets(updateStateAts.rejectedAt));
  }
  columns.push(Utils.formatDateForGSheets(story.accepted_at));
  if (doGetFourKeysData) {
    const timeOfFailureAndFailureResolution =
      getTimeOfFailureAndResolution(story);
    columns.push(timeOfFailureAndFailureResolution.timeOfFailure);
    columns.push(timeOfFailureAndFailureResolution.timeOfFailureResolution);
  }
  columns.push(story.current_state);
  columns.push(release.name);
  columns.push(release.current_state);
  columns.push(Utils.formatDateForGSheets(release.deadline));
  columns.push(Utils.formatDateForGSheets(release.created_at));
  columns.push(Utils.formatDateForGSheets(release.updated_at));
  columns.push(Utils.formatDateForGSheets(release.accepted_at));
  return columns;
}

export function getPTStories() {
    const projectId = Number(Utils.getProperty("PROJECT_ID", "0"));
    const releases = Utils.fetchReleases(projectId);
    const releasesAndStories: ReleasesAndStories = {};
    for (const release of releases) {
        releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
    }
    const rows = [];
    const header = createHeader();
    rows.push(header);
    for (const release of releases) {
        const stories = releasesAndStories[release.id];
        for (const story of stories) {
            const columns = createColumns(story, projectId, release);
            rows.push(columns);
        }
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChangeLogs");
    sheet?.clear();
    sheet?.getRange(1, 1, rows.length, header.length).setValues(rows);
}
