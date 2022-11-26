import {render, screen, RenderResult} from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import Header from '.'
import { AuthContextProvider } from 'contexts/AuthContext'
import { theme } from 'themes'
import type { User, Product } from 'types'

// ShoppingCartContextのモック
jest.mock('contexts/ShoppingCartContext')
// eslint-disable-next-line import/order
import { useShoppingCartContext } from 'contexts/ShoppingCartContext'
// オリジナルのShoppingCartContextProviderを取得
const {ShoppingCartContextProvider} = jest.requireActual(
  'contexts/ShoppingCartContext',
)

// ダミーユーザー
const authUser: User = {
  id: 1,
  username: 'dummy',
  displayName: 'Taketo Yoshida',
  email: 'test@example.com',
  profileImageUrl: '/images/sample/1.jpeg',
  description: '',
}

// ダミー商品
const product: Product = {
  id: 1,
  category: 'book',
  title: 'Product',
  description: '',
  imageUrl: '/images/sample/1.jpeg',
  blurDataUrl: '',
  price: 1000,
  condition: 'used',
  owner: authUser,
}

describe('Header', () => {
  let renderResult: RenderResult
  const useShoppingCartContextMock = useShoppingCartContext as jest.MockedFunction<typeof useShoppingCartContext>

  // カートに商品が存在する時にバッジが表示されているか
  it('カートに商品が存在する', async () => {
    // ShoppingCartContextの初期状態を操作し、カートに商品が1つ存在するようにする。
    useShoppingCartContextMock.mockReturnValue({
      cart: [product],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addProductToCart: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeProductFromCart: () => {}
    })

    renderResult = render(
      <ThemeProvider theme={theme}>
        <ShoppingCartContextProvider>
          <AuthContextProvider
            authUser={authUser}
            context={{apiRootUrl: 'https://dummy'}}
          >
            <Header />
          </AuthContextProvider>
        </ShoppingCartContextProvider>
      </ThemeProvider>,
    )

    // カートに入っている(バッジが出ている)
    expect(screen.getAllByTestId('badge-wrapper').length).toBeGreaterThan(0)
  })

  // プロファイル画像が表示されていないかつカートが空であるか
  it('未サインイン', async () => {
    useShoppingCartContextMock.mockReturnValue({
      cart: [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addProductToCart: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      removeProductFromCart: () => {}
    })

    renderResult = render(
      <ThemeProvider theme={theme}>
        <ShoppingCartContextProvider>
          <AuthContextProvider
            context={{apiRootUrl: 'https://dummy'}}
          >
            <Header />
          </AuthContextProvider>
        </ShoppingCartContextProvider>
      </ThemeProvider>,
    )

    // サインインしていない
    expect(screen.queryByTestId('profile-shape-image')).toBeNull()  // プロファイル画像が空

    // カートが空
    expect(screen.queryByTestId('badge-wrapper')).toBeNull()        // カートが空

    renderResult.unmount()
    useShoppingCartContextMock.mockReset()
  })
})