# JSON Server の設定
REST APIのダミーエンドポイントを作成するためのツール

| API | パス | HTTPメソッド | 説明 |
| -- | -- | -- | -- |
| 認証API | /auth/signin | POST | サインイン |
| 認証API | /auth/signout | POST | サインアウト |
| ユーザーAPI | /users | GET | 一覧取得 |
| ユーザーAPI | /users/{id} | GET | 個別取得 |
| ユーザーAPI | /users/me | GET | 認証済みのユーザーを取得 |
| プロダクトAPI | /products | GET,POST | 一覧取得、新規追加 |
| プロダクトAPI | /products/{id} | GET | 個別取得 |
| 購入API | /purchases | POST | 商品購入 |