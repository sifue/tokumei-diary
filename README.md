# 匿名ダイアリー

単一ドメインのGoogle認証だけを許可する、はてな匿名ダイアリークローン。
全ての日記はパブリックに公開されるほか、匿名性はホスト主によってのみ遵守される仕組みになっている。
トラックバックでバックリンクが作れる他、トラックバックをURLをタイトルに入れる、返信の日記を書くボタン機能を持っている。
自身の日記は編集、削除できる。また、IDで指定された人のみが削除人となり、削除を実施することが可能なようになっている。

現在、各種文言がN高等学校向けにカスタマイズされたものとなっているが、利用する際にはフォークして適切な文言に変更すること。また、著作権はすべて運営者に帰属する内容となっている。その投稿時の承諾事項も利用者の用途に合わせてカスタマイズできる。

# セットアップ

Node.js 6.11.1 以上で動作。Node.jsをインストールの後、`npm install` で環境用意。ローカルにPostgreSQLのDBを用意する必要がある。
`config.js` を適当に編集して運用してください。文言、DBの設定、許可ドメインなどカスタマイズできるところはすべてこのファイルに集約。
HerokuのPostgreSQLでも大丈夫だがしっかり運用しようと思うと無料枠では難しそうなので要注意。安いVPSで運用したほうがコスパは良い。

# 起動コマンド

tokumei-diary-template.sh を編集して tokumei-diary.sh というファイル名にして `./tokumei-diary.sh` で実行するか

```
env NODE_ENV=production PORT=8000 GOOGLE_CLIENT_ID=xxxxxxxx-xxxxxxxxxxxxxxxx GOOGLE_CLIENT_SECRET=xxxxxx-xxxxxxxxxxxxxx GOOGLE_CLIENT_CALLBACL_ROOT='https://domain/' npm start 2>&1 | tee application.log
```

以上のような形式となる。

# ライセンス

ISC license
