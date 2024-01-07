import { env } from "process";

const pivotalTrackerApiUrl = "https://www.pivotaltracker.com/services/v5";

export default class Utils {
  public static isTest(): boolean {
    return env["NODE_ENV"] == "test";
  }

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

  public static formatDateForGSheets(target?: string | number | Date) {
    if (!target || target == "") {
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

  public static convertStrToBool(str: string) {
    try {
      const obj = JSON.parse(str.toLowerCase());
      return obj == true;
    } catch (e) {
      return Boolean("");
    }
  }

  public static getProperty(key: string, defaultValue: string) {
    if (Utils.isTest()) {
      return defaultValue;
    }
    return (
      PropertiesService.getScriptProperties().getProperty(key) ?? defaultValue
    );
  }
}
