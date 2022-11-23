import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BreadcrumbItem from 'components/atoms/BreadcrumbItem'
import Separator from 'components/atoms/Separator'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Breadcrumb from 'components/molecules/Breadcrumb'
import Layout from 'components/templates/Layout'
import UserProductCardListContainer from 'containers/UserProductCardListContainer'
import UserProfileContainer from 'containers/UserProfileContainer'
import getAllProducts from 'services/products/get-all-products'
import getAllUsers from 'services/users/get-all-users'
import getUser from 'services/users/get-user'
import type { ApiContext } from 'types'

type UserPageProps = InferGetStaticPropsType<typeof getStaticProps>

const UserPage: NextPage<UserPageProps> = ({
  id,
  user,
  products,
}: UserPageProps) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading ... </div>
  }

  return (
    <Layout>
      <Flex
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={{base: 2, md: 0}}
        paddingRight={{base: 2, md: 0}}
        justifyContent='center'
      >
        <Box width='1180px'>
          <Box marginBottom={2}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link href='/' passHref>
                  <a>トップ</a>
                </Link>
              </BreadcrumbItem>
              {user && <BreadcrumbItem>{user.username}</BreadcrumbItem>}
            </Breadcrumb>
          </Box>
          <Box>
            <Box marginBottom={1}>
              {/* 
                ユーザープロファイルコンテナ
                ユーザー情報を表示する。useUserで常に最新のデータを取得する。 
              */}
              <UserProfileContainer userId={id} user={user} />
            </Box>
            <Box marginBottom={1}>
              <Separator />
            </Box>
            {/* 
              ユーザー商品カードリストコンテナ
              ユーザーが所持する商品カードリストを表示する。useSearchで常に最新のデータを取得する
             */}
             <UserProductCardListContainer userId={id} products={products} />
          </Box>
        </Box>
      </Flex>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  }
  const users = await getAllUsers(context)
  const paths = users.map((u) => `/users/${u.id}`)

  return {paths, fallback: true}
}

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  }

  if (!params) {
    throw new Error('params is undefined')
  }

  // ユーザー情報とユーザーの所持する商品を取得し、性的ページを作成
  // 10秒でrevalidateな状態にし、静的ページを更新する
  const userId = Number(params.id)
  const [user, products] = await Promise.all([
    getUser(context, {id: userId}),
    getAllProducts(context, { userId })
  ])

  return {
    props: {
      id: userId,
      user,
      products: products ?? [],
    },
    revalidate: 10,
  }
}

export default UserPage

/**
 * 調べること
 * --------------------------------
 * ・router.isFallback
 * ISR
 * Incremental Static Regeneration
 * アクセス時に静的ファイルを生成する。
 * getStaticPropsが使われており、revalidateが指定されている場合はISR
 * 
 * SSGのデメリット
 * ¥ 静的なページを生成する際にページ数が多いとビルドに時間がかかる。
 * ¥ 1度しかビルドしないので、再度全てのページをビルドし直さないと内容が更新されない。
 * ISRがこの欠点を補う。
 * ¥ アクセス時に初めて生成されるので次回ビルドが高速
 * ¥ ISRでページ生成後も再度アクセスがあった際に次回以降の内容をビルドするので内容が更新される。
 * 
 * revalidate -> 前回から何秒以内のアクセスを無視するかを指定する。
 * 今回の場合は
 * revalidate: 10,
 * なので
 * 10秒はアクセスを無視するということになる。
 * 
 * fallbackは
 * アクセスされたURLのファイルが存在しない場合の挙動を決めるもの。
 * router.isFallback
 * -> 下記getStaticPathsの 2. サーバーの裏側での静的ファイル生成が完了するまでrouter.isFallback = trueとなり
 * Loading ... が表示される。
 * --------------------------------
 * ・getStaticPaths
 * Dynamic Routes
 * ファイル名に[]を使うことで実現できる。
 * [id].tsx とすることで、id部分を動的にルーティングすることが可能になる
 * (/users/1, /users/2など)
 * 
 * Dynamic RoutesはgetStaticPathsメソッドで予めパスパラメータとして取りうる値を指定することでルーティングが可能になる。
 * 
 * メソッドの最後では下記のようにpathsとfallbackを返している。
 * return {paths, fallback: true}
 * pathsはパスパラメータとして取りうる値
 * 今回の場合は
 * const paths = users.map((u) => `/users/${u.id}`)
 * なので
 * ['/users/1', '/users/2' ...] というような配列になっている。
 * 
 * fallbackは定義したpaths以外のアクセスがあった場合どのような処理を行うかを決める。
 * fallback: falseの場合
 * pathsに定義されていないパスからのアクセスがあった場合、404ページを返却する。
 * fallback: trueの場合
 * pathsに定義されていないパスからのアクセスがあったとしても、404ページが返却されない。
 * 代わりに以下のようなフローで新たに静的ファイルを作成し、クライアント側に返却する。
 * 1. 例えば "/users/3"のパスが定義されていないとして、そこからRequestがくる。 -> fallback: trueなので404は返さない。 
 * 2. 裏側でサーバー側がgetStaticPropsを実行し、id=3に紐づく静的なファイルを生成する。
 * 3. 生成が完了したら作成した静的ファイルを返す。
 * 4. これ以降の/users/3は 2. で生成した静的ファイルを返す。
 * 
 * SSGだと内容の更新があったとしても、2で静的ファイルが作成されたら以降ずっとその静的ファイルを参照することになってしまう。
 * この解消のためにISRを使用する。
 * revalidateで有効期限を指定することで、有効期限を過ぎたページにアクセスされた場合は、前回ビルドされたコンテンツを返しつつも
 * 裏側で再ビルドをサーバー側にかけにいく。
 * --------------------------------
 * ・getStaticProps
 * その前に...
 * getInitialProps
 * -> ページがレンダリングされる前に実行されるAPI
 * パスにリクエストがあると実行され、ページに必要なデータをpropsとして渡す。
 * pagesフォルダ内のファイルのみで使用できる。（getStaticPropsも同様）
 * 
 * getStaticProps
 * getInitialPropsが行なっていた処理をビルド時に行い、静的なファイルを事前に生成する。
 * 
 * getStaticPropsが使われており、revalidateが指定されている場合はISRとなる。
 * --------------------------------
 */