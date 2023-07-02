import Utils from "./Utils";

interface ReleasesAndStories {
  [key: number]: any
}

function onOpen() {
  const lang = Session.getActiveUserLocale();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("gas-Pivotal2GSheets")
      .addItem(lang === "ja" ? "設定" : "Settings", "setValues")
      .addItem(lang === "ja" ? "変更履歴を作成する" : "Create Changelog", "createChangeLogs")
      .addToUi();}

function createChangeLogs() {
  const projectId= Number(PropertiesService.getScriptProperties().getProperty("PROJECT_ID")) ?? 0;
  const releases = Utils.fetchReleases(projectId);
  const releasesAndStories: ReleasesAndStories = {};
  for(const release of releases) {
    releasesAndStories[release.id] = Utils.fetchStories(projectId, release.id);
  }
  const rows = [];
  const header = [];
  header.push("Story type");
  header.push("Story URL");
  header.push("Story name");
  header.push("Story point");
  header.push("Story status");
  header.push("Release name");
  header.push("Release status");
  header.push("Release date");
  rows.push(header);
  for(const release of releases) {
    const stories = releasesAndStories[release.id];
    for (const story of stories) {
      const columns = [];
      columns.push(story.story_type);
      columns.push(story.url);
      columns.push(story.name);
      columns.push(story.estimate);
      columns.push(story.current_state);
      columns.push(release.name);
      columns.push(release.current_state);
      columns.push(release.deadline);
      rows.push(columns);
    }
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChangeLogs");
  sheet?.clear();
  sheet?.getRange(1,1, rows.length, header.length).setValues(rows);
}

function setValues () {
  const ui = SpreadsheetApp.getUi();
  let response = ui.prompt(":::PivotalTracker の API Token を入力してください。");
  let responseText = response.getResponseText();
  // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
  if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
    return;
  }
  PropertiesService.getScriptProperties().setProperty("API_TOKEN", responseText);
  ui.alert("PivotalTracker の API Token を設定しました。");
  response = ui.prompt(":::PivotalTracker の ProjectId を入力してください。");
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
global.createChangeLogs = createChangeLogs;
global.setValues = setValues;
