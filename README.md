# gas-Pivotal2GSheets

Pivotal Trackerのチケット情報を、リリースごとにスプレッドシートにエクスポートするツールです。    
Pivotal TrackerはチケットのリンクURLが取得しづらく、リンクURL取得を省力化するために作成しました。    

## インストール、スクリプトのデプロイ

1. git clone
```console
git clone https://github.com/kemsakurai/gas-Pivotal2GSheets.git
```
2. claspのインストール
```console
npm install -g clasp
```

4. ライブラリインストール
```console
npm inlstall
```

5. スプレッドシートを作成し、scriptIdを取得する    
スプレットシートを作成後、スプレッドシートの、メニュー`拡張機能`から`App Script`をクリック。
スクリプトエディタのプロジェクトの設定で表示されるスプリプトをコピーし、`.clasp.json`にコピー&ペーストします。
[![Image from Gyazo](https://i.gyazo.com/a4227251d02d2051abbaa41f7638b908.png)](https://gyazo.com/a4227251d02d2051abbaa41f7638b908)

6. App Scriptの登録
```console
npm run deploy
```

## スプレッドシートの設定、ストーリーの取得
App Scriptの登録まで済ませて、スプレッドシートを再表示すると、`gas-Pivotal2GSheet`が表示されます。   
以下の順番でメニューをクリックすることでスプレッドシートの設定、チケットの取得を実施できます。

[![Image from Gyazo](https://i.gyazo.com/6f42bacc5db1b9bff91f16cca9b79374.png)](https://gyazo.com/6f42bacc5db1b9bff91f16cca9b79374)

1. 初期化
不要なシートを削除して、`ChangeLogs`シートを作成します。   

2. 設定   
API実行に必要な以下を設定値を入力します。
* API Token   
* Project ID

3. Pivotal Trackerのストーリーを取得する     
対象のプロジェクトのリリースに紐づくストーリーが`ChangeLogs`シートに書き出されます。

---

## ライセンス     
MIT

