import React, { useContext } from 'react'
import useSWR from 'swr'
import signin from 'services/auth/signin'
import signout from 'services/auth/signout'
import type { ApiContext, User } from 'types'

type AuthContextType = {
  authUser?: User
  isLoading: boolean
  signin: (username: string, password: string) => Promise<void>
  signout: () => Promise<void>
  mutate: (
    data?: User | Promise<User>,
    shouldRevalidate?: boolean,
  ) => Promise<User | undefined>
}

type AuthContextProviderProps = {
  context: ApiContext
  authUser?: User
}

const AuthContext = React.createContext<AuthContextType>({
  authUser: undefined,
  isLoading: false,
  signin: async () => Promise.resolve(),
  signout: async () => Promise.resolve(),
  mutate: async () => Promise.resolve(undefined),
})

export const useAuthContext = (): AuthContextType =>
  useContext<AuthContextType>(AuthContext)

/**
 * 認証コンテキストプロバイダー
 * @param params パラメータ
 */
export const AuthContextProvider = ({
  context,
  authUser,
  children,
}: React.PropsWithChildren<AuthContextProviderProps>) => {
  const { data, error, mutate } = useSWR<User>(
    `${context.apiRootUrl.replace(/\/$/g, '')}/users/me`,
  )
  const isLoading = !data && !error

  // サインイン
  const signinInternal = async (username: string, password: string) => {
    await signin(context, { username, password })
    await mutate()
  }

  // サインアウト
  const signoutInternal = async () => {
    await signout(context)
    await mutate()
  }

  return (
    <AuthContext.Provider
      value={{
        authUser: data ?? authUser,
        isLoading,
        signin: signinInternal,
        signout: signoutInternal,
        mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 調べること
 * --------------------------------
 * ・React.PropsWithChildren
 * propsを引数に取るコンポーネントの型
 * 今回の場合は
 * React.PropsWithChildren<AuthContextProvideProps>
 * なので
 * AuthContextProviderPropsの型のpropsを引数に取るコンポーネントという型で定義している。
 * --------------------------------
 * ・useSWR mutate
 * swr -> stale-while-revalidate
 * キャッシュをなるべく最新に保つ機能
 * 
 * ・シンプル
 * ・React Hooksファースト
 * ・非同期処理を簡単に扱えるようになる
 * ・講師区で軽量で再利用可能なデータフェッチ
 * ・リクエストの重複削除
 * ・リアクティブな動作の実現
 * ・SSR / SSGに対応
 * 
 * mutate() -> ローカルデータ（キャッシュされたデータ）を更新して、再検証させる。
 * --------------------------------
 */