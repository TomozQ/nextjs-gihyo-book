# Atomic Designによるコンポーネント設計の実施

* propsやコンテキストを活用し、ビジネスロジックの実装を避け、再利用可能にする
* 外部依存性を極力排除し、外部から依存性を注入できるようにする
* Atomic Designに従ってコンポーネントを分割
* 個々のコンポーネントはStorybookで確認
* ユニットテストの追加

### 実装の流れ
1. デザインをもとに、Atomic Designに沿ったコンポーネントの分割
2. Atomsの実装
3. Moleculesの実装
4. Organismsの実装
5. Templateの実装
6. ページ(Pages)の実装
7. APIクライアント等の外部依存関係の実装
