import React, { useState, useContext, createContext } from 'react'

// コンテキストを作る
const GlobalSpinnerContext = createContext<boolean>(false)
const GlobalSpinnerActionContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>(() => {})

// グローバルスピナーの表示・非表示
export const useGlobalSpinnerContext = (): boolean => useContext<boolean>(GlobalSpinnerContext)

// グローバルスピナーの表示・非表示アクション
export const useGlobalSpinnerActionContext = (): React.Dispatch<
  React.SetStateAction<boolean>
> => 
  useContext<React.Dispatch<React.SetStateAction<boolean>>> (
    GlobalSpinnerActionContext,
  )

interface GlobalSpinnerContextProviderProps {
  children?: React.ReactNode
}

/**
 * グローバルスピナーコンテキストプロバイダー
 */
const GlobalSpinnerContextProvider = ({
  children,
}: GlobalSpinnerContextProviderProps) => {
  const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)

  return (
    <GlobalSpinnerContext.Provider value={isGlobalSpinnerOn}>
      <GlobalSpinnerActionContext.Provider value={setGlobalSpinner}>
        {children}
      </GlobalSpinnerActionContext.Provider>
    </GlobalSpinnerContext.Provider>
  )
}

export default GlobalSpinnerContextProvider

/**
 * 調べること
 * --------------------------------
 * ・React.Dispatch
 * type Dispatch<A> = (value: A) => void
 * Aという型を指定。戻り値なし。
 * --------------------------------
 * ・React.SetStateAction<boolean>
 * useStateを用いる際の変数変更用関数
 * 今回の場合は
 * const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)
 * の'setGlobalSpinner'を指す。
 * 変更はuseState(false)となっているようにbooleanのみなので型引数として<boolean>が渡される。
 * --------------------------------
 * React.Dispatch<React.SetStateAction<boolean>>
 * 今回の場合は
 * const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)
 * のsetGlobalSpinneという型を指定する。
 * ということになる。
 */