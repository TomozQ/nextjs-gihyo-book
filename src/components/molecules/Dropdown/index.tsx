import React, { useEffect, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import Text from 'components/atoms/Text'
import Flex from 'components/layout/Flex'

const DropdownRoot = styled.div`
  position: relative;
  height: 38px;
`

// ドロップダウン外観
const DropdownControl = styled.div<{ hasError?: boolean }>`
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border: ${({ theme, hasError }) =>
    hasError
      ? `1px solid ${theme.colors.danger}`
      : `1px solid ${theme.colors.border}`};
  border-radius: 5px;
  box-sizing: border-box;
  cursor: default;
  outline: none;
  padding: 8px 52px 8px 12px;
`

const DropdownValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
`

// ドロップダウンプレースホルダー
const DropdownPlaceholder = styled.div`
  color: #757575;
  font-size: ${({ theme }) => theme.fontSizes[1]};
  min-height: 20px;
  line-height: 20px;
`

// ドロップダウンの矢印の外観
const DropdownArrow = styled.div<{ isOpen?: boolean }>`
  border-color: ${({ isOpen }) =>
    isOpen
      ? 'transparent transparent #222222;'
      : '#222222 transparent transparent'};
  border-width: ${({ isOpen }) => (isOpen ? '0 5px 5px' : '5px 5px 0;')};
  border-style: solid;
  content: ' ';
  display: block;
  height: 0;
  margin-top: -ceil(2.5);
  position: absolute;
  right: 10px;
  top: 16px;
  width: 0;
`

const DropdownMenu = styled.div`
  background-color: #ffffff;
  border: ${({ theme }) => theme.colors.border};
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
    0px 8px 10px 1px rgb(0 0 0 / 10%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  border-radius: 5px;
  margin-top: -1px;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
`

const DropdownOption = styled.div`
  padding: 8px 12px 8px 12px;
  &:hover {
    background-color: #f9f9f9;
  }
`

interface DropdownItemProps {
  item: DropdownItem
}

const DropdownItem = (props: DropdownItemProps) => {
  const { item } = props

  return (
    <Flex alignItems="center">
      <Text margin={0} variant="small">
        {item.label ?? item.value}
      </Text>
    </Flex>
  )
}

export interface DropdownItem {
  value: string | number | null
  label?: string
}

interface DropdownProps {
  /**
   * ドロップダウンの選択肢
   */
  options: DropdownItem[]
  /**
   * ドロップダウンの値
   */
  value?: string | number
  /**
   * <input />のname属性
   */
  name?: string
  /**
   * プレースホルダー
   */
  placeholder?: string
  /**
   * バリデーションエラーフラグ
   */
  hasError?: boolean
  /**
   * 値が変化した時のイベントハンドラ
   */
  onChange?: (selected?: DropdownItem) => void
}

/**
 * ドロップダウン
 */
const Dropdown = (props: DropdownProps) => {
  const { onChange, name, value, options, hasError } = props
  const initialItem = options.find((i) => i.value === value)
  const [isOpen, setIsOpenValue] = useState(false)
  const [selectedItem, setSelectedItem] = useState(initialItem)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleDocumentClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      // 自分自身をクリックした場合は何もしない
      if (dropdownRef.current) {
        const elems = dropdownRef.current.querySelectorAll('*')

        for (let i = 0; i < elems.length; i++) {
          if (elems[i] == e.target) {
            return
          }
        }
      }

      setIsOpenValue(false)
    },
    [dropdownRef],
  )

  const handleMouseDown = (e: React.SyntheticEvent) => {
    setIsOpenValue((isOpen) => !isOpen)
    e.stopPropagation()
  }

  const handleSelectValue = (
    e: React.FormEvent<HTMLDivElement>,
    item: DropdownItem,
  ) => {
    e.stopPropagation()

    setSelectedItem(item)
    setIsOpenValue(false)
    onChange && onChange(item)
  }

  useEffect(() => {
    // 画面外のクリックとタッチをイベントを設定
    document.addEventListener('click', handleDocumentClick, false)
    document.addEventListener('touchend', handleDocumentClick, false)

    return function cleanup() {
      document.removeEventListener('click', handleDocumentClick, false)
      document.removeEventListener('touchend', handleDocumentClick, false)
    }
    // 最初だけ呼び出す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DropdownRoot ref={dropdownRef}>
      <DropdownControl
        hasError={hasError}
        onMouseDown={handleMouseDown}
        onTouchEnd={handleMouseDown}
        data-testid="dropdown-control"
      >
        {selectedItem && (
          <DropdownValue>
            <DropdownItem item={selectedItem} />
          </DropdownValue>
        )}
        {/* 何も選択されてない時はプレースホルダーを表示 */}
        {!selectedItem && (
          <DropdownPlaceholder>{props?.placeholder}</DropdownPlaceholder>
        )}
        {/* ダミーinput */}
        <input
          type="hidden"
          name={name}
          value={selectedItem?.value ?? ''}
          onChange={() => onChange && onChange(selectedItem)}
        />
        <DropdownArrow isOpen={isOpen} />
      </DropdownControl>
      {/* ドロップダウンを表示 */}
      {isOpen && (
        <DropdownMenu>
          {props.options.map((item, idx) => (
            <DropdownOption
              key={idx}
              onMouseDown={(e) => handleSelectValue(e, item)}
              onClick={(e) => handleSelectValue(e, item)}
              data-testid="dropdown-option"
            >
              <DropdownItem item={item} />
            </DropdownOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownRoot>
  )
}

export default Dropdown

/**
 * 調べること
 * --------------------------------
 * ・?? の演算子
 *  Null合体演算子
 *  左辺がnullまたはundefinedの場合に右の値を返し、それ以外の場合に左の値を返す
 *  value={selectedItem?.value ?? ''}
 *  -> selectedItem.valueがあればselectedItem.valueを返し、selectedItem.valueがnullもしくはundefinedの場合には''を返す
 * --------------------------------
 * ・React.SyntheticEvent
 *  まず、イベントには種類によって様々なインターフェイスがある。
 *  例えばクリックイベントを作るならMouseEventを使い、キーボード入力をイベントリスナーとするならKeyBoardEventを使う
 *  イベントインターフェイスの種類によって、独自のプロパティが実装されており、ブラウザごとの対応状況も異なる。
 *  そのため、ネイティブのJSでイベントをクロスブラウザ対応させるのは大変
 *  Reactの場合、すべてのイベントをSyntheticEventとして扱う。
 *  SyntheticEventを使えば、各ブラウザのネイティブイベントを全てラップしており、何も意識しなくてもクロスブラウザ対応ができる。
 *
 *  つまりいつもeventとして渡している(e)の種類。合成イベント。
 * --------------------------------
 * ・e.stopPropagation()
 *  ここ以降のイベントの伝播をキャンセルする。
 *  今回の場合は親要素の下に階層違いで同じonMouseDownイベントで別の関数が定義されているため、どちらもが実行されないように伝播をキャンセルしている。
 * --------------------------------
 * ・React.FormEvent
 *  Formのイベント？ onSubmitとかに使用されるようだが...?
 *  ここでなぜ使っているのかは不明
 * --------------------------------
 * ・onMouseDown
 *  マウスがクリックされたイベント
 *  内部ではmousedown, mouseup, clickという3つのイベントが発生している。
 *  以下イベントの発火が早い順
 *  mousedown -> 要素上でマウスボタンが押された
 *  mouseup ->要素上でマウスボタンが離された
 *  click -> 要素上でマウスのボタンが押されて話された
 * --------------------------------
 * ・onTouchEnd
 *  スマートフォンなどで当該要素に触れていた指が離れた際に発火するイベント
 * --------------------------------
 */
