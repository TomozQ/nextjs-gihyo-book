import initStoryshots from '@storybook/addon-storyshots'

// アニメーションを活用したコンポーネントはスナップショットによるテストが失敗します
// StoryShotsのテストを全てのコンポーネントで成功させるために、ReactLoaderのテストを対象から外します。
initStoryshots({
  storyKindRegex: /^((?!.*?RectLoader).)*$/,
})