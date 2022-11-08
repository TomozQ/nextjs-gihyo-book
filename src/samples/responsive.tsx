import { theme } from 'themes'
// /**
//  * Responsiveプロパティ
//  * CSSプロパティの値をブレークポイントごとに設定できる
//  * TはCSSプロパティの値の型
//  */
// type ResponsiveProp<T> = {
//   base?: T // デフォルト
//   sm?: T // 640px以上
//   md?: T // 768px以上
//   lg?: T // 1024px以上
//   xl?: T // 1280px以上
// }

// /**
//  * Responsive型はResponsiveプロパティもしくはCSSプロパティの値
//  */
// type Responsive<T> = T | ResponsiveProp<T>

// // Themeの型
// type AppTheme = typeof theme
// // Themeのキーの型
// type SpaceThemeKeys = keyof typeof theme.space
// // Themeのキーの型（SpaceThemeKeys）もしくは任意の文字列('10px'など)
// type Space = SpaceThemeKeys | (string & {}) // & {} を書くとエディターの補完が効くようになる。

// /**
//  * Responsive型をCSSプロパティとその値に変換
//  * @param propKey CSSプロパティ
//  * @param prop Responsive型
//  * @returns CSSプロパティとその値（ex. background-color: white;）
//  */
// function toPropValue<T>(propKey: string, prop?: Responsive<T>): string {
//   /**
//    * 実装省略
//    * toPropValue('flex-direction', 'column')の場合は
//    * >> flex-direction: column;
//    * の文字列が返ってくる。
//    * 
//    * toPropValue('flex-direction', {base: 'column', sm: 'row'})の場合は
//    * flex-direction: column;
//    * @media screen and (min-width: 640px) {
//    *  flex-direction: row;
//    * }
//    * の文字列が返ってくる。
//    */
//   return ''
// }

// interface ContainerProps {
//   flexDirection?: Responsive<string>
// }

// const Container = styled.section<ContainerProps>`
//   padding: 4em;
//   display: flex;
//   ${(props) => toPropValue('flex-direction', props.flexDirection)}
// `

// const Page: NextPage = () => {
//   return (
//     <>
//       <Container flexDirection="column" marginBottom="8px">
//         {/* 
//           - 常に縦並びになる
//           - 下に8px(テーマ設定した2つ目の要素)のマージン
//         */}
//         <div>First Item</div>
//         <div>Second Item</div>
//       </Container>
//       <Container flexDirection={{base: 'column', sm: 'row'}} marginBottom={1}>
//         {/* 
//           - 640px以上だと横並び、それ以外だと縦並び
//           - 下に8px(テーマ設定した2つ目の要素)のマージン
//             const space: string[] = ['0px', '8px', '16px', '32px', '64px']
//         */}
//         <div>First Item</div>
//         <div>Second Item</div>
//       </Container>
//       <Container flexDirection={{base: 'column', sm: 'row'}} marginBottom={{base: 1, sm: 2}}>
//         {/* 
//           - 640px以上だと横並び、それ以外だと縦並び
//           - 640px以上だと下に16pxのマージン
//             それ以外は8pxマージン
//             const space: string[] = ['0px', '8px', '16px', '32px', '64px']
//         */}
//         <div>First Item</div>
//         <div>Second Item</div>
//       </Container>
//     </>
//   )
// }

// export default Page