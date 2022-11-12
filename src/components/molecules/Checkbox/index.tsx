import React, { useRef, useState, useCallback, useEffect } from "react";
import styled from 'styled-components'
import Flex from "components/leyout/Flex";
import Text from "components/atoms/Text";
import {
  CheckBoxOutlineBlankIcon,
  CheckBoxIcon
} from 'components/atoms/IconButton'

export interface CheckBoxProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> {
    /**
     * 表示ラベル
     */
    label?: string
}

// 非表示のチェックボックス
const CheckBoxElement = styled.input `
  display: none;
`

// チェックボックスのラベル
const Label = styled.label`
  cursor: pointer;
  margin-left: 6px;
  user-select: none;
`

/**
 * チェックボックス
 */
const CheckBox = (props: CheckBoxProps) => {
  const { id, label, onChange, checked, ...rest } = props
  const [isChecked, setIsChecked] = useState(checked)
  const ref = useRef<HTMLInputElement>(null)
  const onClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    // チェックボックスを強制的にクリック
    ref.current?.click()
    setIsChecked((isChecked) => !isChecked)
  },[ref, setIsChecked])
  
  useEffect(() => {
    // パラメータからの変更を受け付ける
    setIsChecked(checked ?? false)
  },[checked])

  return (
    <>
      <CheckBoxElement 
        { ...rest }
        ref={ref}
        type='checkbox'
        checked={isChecked}
        readOnly={!onChange}
        onChange={onChange}
      />
      <Flex alignItems='center'>
        {/* チェックボックスのON/OFFの描画 */}
        { checked ?? isChecked ? (
          <CheckBoxIcon size={20} onClick={onClick} />
          ) : (
          <CheckBoxOutlineBlankIcon size={20} onClick={onClick} />
        )}
        {/* チェックボックスのラベル */}
        {label && label.length > 0 && (
          <Label htmlFor={id} onClick={onClick}>
            <Text>{label}</Text>
          </Label>
        )}
      </Flex>
    </>
  )
}

export default CheckBox


/**
 * 調べること
 * --------------------------------
 * ・Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'>
 * -> Omitについて
 *  省く ... 
 * type User = {
 *  id: number
 *  name: string
 *  nickname: string
 *  age: number
 * }
 * -> type UserWithoutAge = Omit<User, 'age'>
 * とすることでUser型からageのプロパティを省いた型を定義する。
 * <React.InputHTMLAttributes<HTMLInputElement>> -> デフォルトのHTML要素であるinputを継承してコンポーネントを生成。
 * 
 * よって
 * Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'>
 * はデフォルトのinputのattributeからdefaultValueを除いた要素でコンポーネントの型を定義している。
 * --------------------------------
 * ・...rest
 *  渡されるpropsで定義されているもの以外のprops
 *  今回の場合は
 *  id, label, onChange, checked, 以外のporpsはrestに含まれる。
 * --------------------------------
 * ・useRef / ref.current?.click
 *  書き換え可能なrefオブジェクトを生成する。
 * 1. データの保持
 * 2. DOMの参照
 * データの保持について
 * 関数内でデータを保持するにはuseStateやuseReducerがあるが、これらは状態を更新するたびに再描画が発生する。
 * refオブジェクトに保存された値を更新しても再描画は発生しない。 -> 描画に関係ないデータを保存する。
 * データは << ref.current >>から読み出したり書き換えたりする。
 * 
 * DOMの参照について
 * refをコンポーネントに渡すと、この要素がマウントされた時、ref.currentにDOMの参照がセットされ、DOMの関数などを呼び出すことができる。
 * 
 * 今回の場合はrefをCheckBoxElementに渡しているので、CheckBoxElementがマウントされたときにrefにCheckBoxElementの参照がセットされる。(実際はdisplay: none;で非表示だが)
 * そしてチェックボックスのアイコン（CheckBoxIcon / CheckBoxOutlineBlankIcon）もしくはLabelがclickされた際にチェックボックスを強制的にクリックする。
 * --------------------------------
 * ・useCallback
 * 関数のメモ化
 * 第1引数は関数、第2引数は依存配列。
 * 関数の再描画が行われる時に、useCallback()は依存配列の中の値を比較する。
 * 依存配列の中の値がそれぞれ前の描画時と同じ場合はメモ化している関数を返す。
 * 依存配列の中で値が違うものがあれば新しい関数を返す。
 * 依存配列が空の場合は初期描画時に生成された関数を常に返す。
 */