import Utils from "../Utils";

function createHeader() {
  const header = [];
  header.push("id");
  header.push("created_at");
  header.push("updated_at");
  header.push("accepted_at");
  header.push("deadline");
  header.push("story_type");
  header.push("story_priority");
  header.push("name");
  header.push("current_state");
  header.push("url");
  header.push("project_id");
  const doGetFourKeysData = Utils.convertStrToBool(Utils.getProperty("DO_GET_FOUR_KEYS_DATA","false"));
  if (doGetFourKeysData) {
    header.push("isFailure");
  }
  return header;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function createColumns(releaseWithFailureFlag) {
  const columns = [];
  columns.push(releaseWithFailureFlag.id);
  columns.push(Utils.formatDateForGSheets(releaseWithFailureFlag.created_at));
  columns.push(Utils.formatDateForGSheets(releaseWithFailureFlag.updated_at));
  columns.push(Utils.formatDateForGSheets(releaseWithFailureFlag.accepted_at));
  columns.push(Utils.formatDateForGSheets(releaseWithFailureFlag.deadline));
  columns.push(releaseWithFailureFlag.story_type);
  columns.push(releaseWithFailureFlag.story_priority);
  columns.push(releaseWithFailureFlag.name);
  columns.push(releaseWithFailureFlag.current_state);
  columns.push(releaseWithFailureFlag.url);
  columns.push(releaseWithFailureFlag.project_id);
  const doGetFourKeysData = Utils.convertStrToBool(Utils.getProperty("DO_GET_FOUR_KEYS_DATA","false"));
  if (doGetFourKeysData) {
      columns.push(releaseWithFailureFlag.isFailure);
  }
  return columns;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const setValuesToReleasesSheet = releasesWithFailureFlag => {
    const rows = [];
    const header = createHeader();
    rows.push(header);
    for (const releaseWithFailureFlag of releasesWithFailureFlag) {
        const columns = createColumns(releaseWithFailureFlag);
        rows.push(columns);
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Releases");
    sheet?.clear();
    sheet?.getRange(1, 1, rows.length, header.length).setValues(rows);
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
function createReleasesWithFailureFlag(releases: any[],
  releasesAndStories: ReleasesAndStories,
  projectId: number
) {
  const defectiveTicketIdentificationString = Utils.getProperty("DEFECTIVE_TICKET_IDENTIFICATION_STRING", "原因リリースチケットID")
  //バグデータのみ抽出
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
  const allBugs: any[] = [];
  const changeFailureIds: Set<string> = new Set();
  const doGetFourKeysData = Utils.convertStrToBool(Utils.getProperty("DO_GET_FOUR_KEYS_DATA", "false"));
  if (doGetFourKeysData) {
    for (const release of releases) {
      const stories = releasesAndStories[release.id];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
      allBugs[release.id] = stories.filter(function (story: any) {
        return (story.story_type = "bug");
      });
    }
    for (const release of releases) {
      const bugs = allBugs[release.id];
      for (const bug of bugs) {
        const blockers = Utils.fetchBlockers(projectId, bug.id);
        for (const block of blockers) {
          if (block.description.includes(defectiveTicketIdentificationString)) {
            const changeFailureId = block.description.split("#")[1];
            changeFailureIds.add(changeFailureId);
          }
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return releases.map(function(release: any) {
      release["isFailure"] = changeFailureIds.has(String(release.id));
      return release;
  });
}

export const getReleases = (): void => {
    console.log('getReleases start');
    // release のデータを取得する
    //デプロイの頻度 - 組織による正常な本番環境へのリリースの頻度
    //変更のリードタイム - commit から本番環境稼働までの所要時間
    //変更障害率 - デプロイが原因で本番環境で障害が発生する割合（%）
    //サービス復元時間 - 組織が本番環境での障害から回復するのにかかる時間
    const projectId= Number(Utils.getProperty("PROJECT_ID", "0"));
    const releases = Utils.fetchReleases(projectId);
    const releasesAndStories: ReleasesAndStories = {};
    for(const release of releases) {
        releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
    }
    const releasesWithFailureFlag = createReleasesWithFailureFlag(
      releases,
      releasesAndStories,
      projectId
    );
    setValuesToReleasesSheet(releasesWithFailureFlag);
    console.log('getReleases end');
};
