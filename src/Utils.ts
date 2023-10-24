const pivotalTrackerApiUrl = "https://www.pivotaltracker.com/services/v5";

export default class Utils {
  public static fetchReleases(projectCode: number) {
    // TODO エラーハンドリング
    const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
      "X-TrackerToken":
        PropertiesService.getScriptProperties().getProperty("API_TOKEN") ?? "",
    };
    let options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    // eslint-disable-next-line prefer-const
    options = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return Utils.fetchAsJson(
      pivotalTrackerApiUrl +
        "/projects/" +
        projectCode +
        "/stories?filter=type%3Arelease",
      options
    );
  }

  public static fetchStories(projectCode: number, releaseId: number) {
    // TODO エラーハンドリング
    const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
      "X-TrackerToken":
        PropertiesService.getScriptProperties().getProperty("API_TOKEN") ?? "",
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return Utils.fetchAsJson(
      pivotalTrackerApiUrl +
        "/projects/" +
        projectCode +
        "/releases/" +
        releaseId +
        "/stories",
      options
    );
  }

  public static fetchBlockers(projectCode: number, storyId: number) {
    // TODO エラーハンドリング
    const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
      "X-TrackerToken":
        PropertiesService.getScriptProperties().getProperty("API_TOKEN") ?? "",
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return Utils.fetchAsJson(
      pivotalTrackerApiUrl +
        "/projects/" +
        projectCode +
        "/stories/" +
        storyId +
        "/blockers",
      options
    );
  }

  public static foratDateforGSheets(target: string | number | Date) {
    if (target == "") {
      return "";
    }
    return Utilities.formatDate(new Date(target), "JST", "yyyy/MM/dd hh:mm:ss");
  }

  public static fetchActivities(projectCode: number, storyId: number) {
    // TODO エラーハンドリング
    const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
      "X-TrackerToken":
        PropertiesService.getScriptProperties().getProperty("API_TOKEN") ?? "",
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "get",
      headers: headers,
      muteHttpExceptions: true,
    };
    return Utils.fetchAsJson(
      pivotalTrackerApiUrl +
        "/projects/" +
        projectCode +
        "/stories/" +
        storyId +
        "/activity",
      options
    );
  }

  public static fetchAsJson = (
    url: string,
    requestOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    const response = UrlFetchApp.fetch(url, requestOptions);
    return JSON.parse(response.getContentText());
  };
}
