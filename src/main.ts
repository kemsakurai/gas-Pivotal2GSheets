import Utils from "./Utils";

interface ReleasesAndStories {
  [key: number]: any
}

function onOpen() {
  const lang = Session.getActiveUserLocale();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("gas-GmailAutoPurge")
      .addItem(lang === "ja" ? "設定" : "Settings", "setValues")
      .addToUi();
}
function createRealeaseList() {
  const projectId= Number(PropertiesService.getScriptProperties().getProperty("PROJECT_ID")) ?? 0;
  const releases = Utils.fetchReleases(projectId);

  const releasesAndStories: ReleasesAndStories = {};
  for(const release of releases) {
    releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
  }

}
function setValues () {
  const ui = SpreadsheetApp.getUi();
  let response = ui.prompt(":PivotalTracker の API Token を入力してください。");
  let responseText = response.getResponseText();
  // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
  if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
    return;
  }
  PropertiesService.getScriptProperties().setProperty("API_TOKEN", responseText);
  ui.alert("PivotalTracker の API Token を設定しました。");
  response = ui.prompt(":PivotalTracker の ProjectId を入力してください。");
  responseText = response.getResponseText();
  // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
  if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
    return;
  }
  PropertiesService.getScriptProperties().setProperty("PROJECT_ID", responseText);
  ui.alert("PivotalTracker の ProjectId を設定しました。");
  return;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let global: any;
global.onOpen = onOpen;
global.createRealeaseList = createRealeaseList;
