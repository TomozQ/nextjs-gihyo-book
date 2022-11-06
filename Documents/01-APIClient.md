# APIクライアントの実装

APIへの問い合わせを管理する

今回はJSON Serverをバックエンドとして使用する。

### 実装方法
* src/util以下にfetchをラップして使いやすくするfetcher関数を作成
* APIクライアントを、src/services/auth以下に、関数ごとにファイルを分割して実装
* アプリケーションで使用されるデータの型を定義

### 実装するAPIクライアント
|  関数名  |  API  |  パス  |
|----|----|----|
|  signin  |  認証API  |  /auth/signin  |
|  signout  |  認証API  |  /auth/signout  |
|  getAllUsers  |  ユーザーAPI  |  /users  |
|  getUser  |  ユーザーAPI  |  /users/{id}  |
|  getUser  |  ユーザーAPI  |  /users/me  |
|  getAllProducts, addProduct  |  プロダクトAPI  |  /products  |
|  getProduct  |  プロダクトAPI  |  /products/{id}  |
|  purchase  |  購入API  |  /purchases  |

### 開発観光のためのAPIリクエストプロキシ

* __CORS__ ... オリジン間リソース共有。(Cross-Origin-Resource Sharing)<br>あるオリジンのWebアプリケーションに対して、別のオリジンのサーバーへのアクセスをHTTPリクエストによって許可できる仕組み。

* Next.jsのRewrites機能 ... 指定したURLパターンを内部で別のURLに変換する機能

CORSでのCookie送信を避けるために、Next.jsのRewrites機能を使用してプロキシの設定をする。<br>
Next.jsのエンドポイントにリクエストを送信するとjson-serverのエンドポイントに変換されてリクエストが送信される。
Next.jsのRewrites機能を利用するには __next.config.js__ を編集する。<br>
例えば、 __http://nextjsのホスト/api/proxy/signin__ とリクエストを送った場合には __http://json-serverのホスト/signin__ と変換される。
