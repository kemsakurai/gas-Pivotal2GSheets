export function onOpen() {
    const lang = Session.getActiveUserLocale();
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("gas-Pivotal2GSheets")
        .addItem(lang === "ja" ? "初期化" : "Initialize", "initialize")
        .addItem(lang === "ja" ? "設定" : "Settings", "setValues")
        .addItem(lang === "ja" ? "Pivotal Trackerのストーリーを取得する" : "Get Pivotal Tracker's stories", "getPTStories")
        .addItem(lang === "ja" ? "Pivotal Trackerのリリースチケットを取得する" : "Get a Pivotal Tracker release ticket", "getReleases").addToUi();
}