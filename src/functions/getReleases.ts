import Utils from "../Utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const setValuesToReleasesSheet = releasesWithFailureFlag => {
    const rows = [];
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
    header.push("isFailure");
    rows.push(header);
    for (const releaseWithFailureFlag of releasesWithFailureFlag) {
        const columns = [];
        columns.push(releaseWithFailureFlag.id);
        columns.push(Utils.foratDateforGSheets(releaseWithFailureFlag.created_at));
        columns.push(Utils.foratDateforGSheets(releaseWithFailureFlag.updated_at));
        columns.push(Utils.foratDateforGSheets(releaseWithFailureFlag.accepted_at));
        columns.push(Utils.foratDateforGSheets(releaseWithFailureFlag.deadline));
        columns.push(releaseWithFailureFlag.story_type);
        columns.push(releaseWithFailureFlag.story_priority);
        columns.push(releaseWithFailureFlag.name);
        columns.push(releaseWithFailureFlag.current_state);
        columns.push(releaseWithFailureFlag.url);
        columns.push(releaseWithFailureFlag.project_id);
        columns.push(releaseWithFailureFlag.isFailure);
        rows.push(columns);
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Releases");
    sheet?.clear();
    sheet?.getRange(1, 1, rows.length, header.length).setValues(rows);
};

export const getReleases = (): void => {
    console.log('getReleases start');
    // release のデータを取得する
    //デプロイの頻度 - 組織による正常な本番環境へのリリースの頻度
    //変更のリードタイム - commit から本番環境稼働までの所要時間
    //変更障害率 - デプロイが原因で本番環境で障害が発生する割合（%）
    //サービス復元時間 - 組織が本番環境での障害から回復するのにかかる時間
    const projectId= Number(PropertiesService.getScriptProperties().getProperty("PROJECT_ID")) ?? 0;
    const releases = Utils.fetchReleases(projectId);
    const releasesAndStories: ReleasesAndStories = {};
    for(const release of releases) {
        releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
    }
    //バグデータのみ抽出
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const allBugs: any[] = [];
    for(const release of releases) {
        const stories = releasesAndStories[release.id];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        allBugs[release.id] = stories.filter(function (story: any) {
            return story.story_type = "bug";
        });
    }

    const changeFailureIds : Set<string> =  new Set();
    for(const release of releases) {
        const bugs = allBugs[release.id];
        for(const bug of bugs) {
            const blockers = Utils.fetchBlockers(projectId, bug.id);
            for(const block of blockers) {
                if(block.description.includes('原因リリースチケットID')) {
                    const changeFailureId = block.description.split('#')[1];
                    changeFailureIds.add(changeFailureId);
                }
            }
        }
    }
    const releasesWithFailureFlag = releases.map(function (release: any) {
        release['isFailure'] = changeFailureIds.has(String(release.id));
        return release;
    });
    setValuesToReleasesSheet(releasesWithFailureFlag);
    console.log('getReleases end');
};
