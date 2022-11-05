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