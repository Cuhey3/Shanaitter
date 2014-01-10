Shanaitter
==========

概要
  HTML5とMongoDBで実装した、簡易な社内連絡ツールです。

準備
  1.MongoDB1.8.5をご用意ください。（旧Simple Rest APIを使用するため）
  2.MongoDBを、--restオプションと -jsonpオプションとともに起動してください。
    # 付属の社内tterサーバー起動.cmdを参考にしてください。
  3.MongoDBが常駐している端末のIPを、js/main.js内のグローバル変数domainにセットしてください。
  4.本番環境で使用する場合は、tweetsコレクションをcapped とし、上限を設定してください。
    # デフォルトでは300となっています。

機能
  赤枠の「全員へ発言」スコープと青枠の「つぶやく」スコープを選択して、発言できます。
    # 「つぶやく」スコープでは、自分あるいはアンカー相手のみが発言を閲覧できます。
  他のユーザーの閲覧状況を、画面右側に表示します。（最終アクセスからの経過時間）
  他のユーザーの発言は、最大15秒のラグのあと、自動的に反映されます。
    # Windowsであれば、Msgコマンドで最前面にアラートを表示させることができます。
