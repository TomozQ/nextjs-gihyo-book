import React, { useState, useRef, useCallback, useEffect, } from 'react'
import styled from 'styled-components'
import { CloudUploadIcon } from 'components/atoms/IconButton'
import { file } from '@babel/types'

// eslint-disable-next-line @typescript-eslint-/no-explicit-any
const isDragEvt = (value: any): value is React.DragEvent => {
  return !!value.dataTransfer
}

const isInput = (value: EventTarget | null): value is HTMLInputElement => {
  return value !== null
}

/**
 * イベントから入力されたファイルを取得
 * @param e DragEventかChangeEvent
 * @returns Fileの配列
 */
const getFilesFromEvent = (e: React.DragEvent | React.ChangeEvent): File[] => {
  if(isDragEvt(e)){
    return Array.from(e.dataTransfer.files)
  } else if (isInput(e.target) && e.target.files) {
    return Array.from(e.target.files)
  }

  return []
}

// ファイルのContent-Type
type FileType = 
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/gif'
  | 'video/mp4'
  | 'video/quicktime'
  | 'application/pdf'

interface DropzoneProps {
  /**
   * 入力ファイル
   */
  value?: File[]
  /**
   * <input />のname属性
   */
  name?: string
  /**
   * 許可されるファイルタイプ
   */
  acceptedFileTypes?: FileType[]
  /**
   * 横幅
   */
  width?: number | string
  /**
   * 縦幅
   */
  height?: number | string
  /**
   * バリデーションエラーフラグ
   */
  hasError?: boolean
  /**
   * ファイルがドロップ入力された時のイベントハンドラ
   */
  onDrop?: (files: File[]) => void
  /**
   * ファイルが入力された時のイベントハンドラ
   */
  onChange?: (files: File[]) => void
}

type DropzoneRootProps = {
  isFocused?: boolean
  hasError?: boolean
  width?: string | number
  height?: string | number
}

// ドロップゾーンの外側の外観
const DropzoneRoot = styled.div<DropzoneRootProps>`
  border: 1px dashed
    ${( {theme, isFocused, hasError} ) => {
      if (hasError) {
        return theme.colors.danger
      } else if (isFocused) {
        return theme.colors.black
      } else {
        return theme.colors.border
      }
    }};
  border-radius: 8px;
  cursor: pointer;
  width: ${( { width } ) => (typeof width === 'number' ? `${width}px` : width)}};
  height: ${( { height } ) => (typeof height === 'number' ? `${height}px` : height)};
`

const DropzoneContent = styled.div<{
  width: string | number
  height: string | number
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${( { width } ) => (typeof width === 'number' ? `${width}px` : width)}};
  height: ${( { height } ) => (typeof height === 'number' ? `${height}px` : height)};
`

const DropzoneInputFile = styled.input`
  display: none;
`

/**
 * ドロップゾーン
 * ファイルの入力を受け取る
 */
const Dropzone = (props: DropzoneProps) =>  {
  const {
    onDrop,
    onChange,
    value = [],
    name,
    acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif',],
    hasError,
    width = '100%',
    height = '200px'
  } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(false)

    const files = value.concat(
      getFilesFromEvent(e).filter((f) => 
        acceptedFileTypes.includes(f.type as FileType),
      ),
    )

    onDrop && onDrop(files)
    onChange && onChange(files)
  }

  // ドラッグ状態のマウスポインタが範囲内でドロップされた時
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFocused(false)

    const files = value.concat(
      getFilesFromEvent(e).filter((f) => 
        acceptedFileTypes.includes(f.type as FileType)
      )
    )

    if (files.length == 0) {
      return window.alert(
        `次のファイルフォーマットは指定できません${acceptedFileTypes.join(
          ' ,',
        )}`
      )
    }

    onDrop && onDrop(files)
    onChange && onChange(files)
  }

  // ドラッグ状態のマウスポインタが範囲内に入っている時
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  },[])

  // ドラッグ状態のマウスポインタが範囲外に消えた時にフォーカスを外す
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFocused(false)
  },[])
  
  // ドラッグ状態のマウスポインタが範囲内に来た時にフォーカスを当てる
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFocused(true)
  },[])

  // ファイル選択ダイアログを表示する
  const handleClick = () => {
    inputRef.current?.click()
  }

  useEffect(() => {
    if (inputRef.current && value && value.length == 0) {
      inputRef.current.value = ''
    }
  },[value])

  return (
    <>
      {/* ドラッグアンドドロップイベントを管理 */}
      <DropzoneRoot
        ref={rootRef}
        isFocused={isFocused}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        onClick={handleClick}
        hasError={hasError}
        width={width}
        height={height}
        data-testid='dropzone'
      >
        {/* ダミーインプット */}
        <DropzoneInputFile 
          ref={inputRef}
          type='file'
          name={name}
          accept={acceptedFileTypes.join(',')}
          onChange={handleChange}
          multiple
        />
        <DropzoneContent width={width} height={height}>
          <CloudUploadIcon size={24} />
          <span style={{textAlign: 'center'}}>デバイスからアップロード</span>
        </DropzoneContent>
      </DropzoneRoot>
    </>
  )
}

Dropzone.defaultProps = {
  acceptedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
  hasError: false,
}

export default Dropzone

/**
 * 調べること
 * ・is
 * TypeScriptの型推論を補強するuser-defined type guard(ユーザー定義型ガード)
 * unknown型、any型、Union型の型の絞り込みができる。
 * 
 * 例えば
 * ... 引数の型がstring型だったら文字列の長さを出力する関数
 * const example = (foo: unknown) => {
 *  if(typeof foo === 'string'){
 *    console.log(foo.length)
 *  }
 * }
 * 他にもstring型への絞り込みが必要な関数があり、typeof foo === 'string'の部分を
 * isSring関数に抽出して汎用的に使いまわしたいとする。
 * ... そうすると
 * const isString(bar: unknown): boolean => {
 *  return typeof bar === 'string'
 * }
 * 
 * const example = (foo: unknown) => {
 *  if(isString(foo)){
 *    console.log(foo.length)   // -> Error fooはまだunkownとして推論される。
 *  }
 * }
 * となるが
 * typeofでの型の絞り込みは関数スコープで完結してしまうので、isStringがtrueの場合でも、まだfooはunknown型として推論され、型の絞り込みが行えない。
 * 
 * こんな時に is を使う
 * ... つまり
 * const isString(bar: unknown): bar is string => {   // isを使うとisStringの結果がtrueの場合は引数で受け取った変数の型は、string型であるとコンパイラに伝えることができる。
 *  return typeof bar === 'string'
 * }
 * 
 * const example = (foo: unknown) => {
 *  if(isString(foo)){
 *    console.log(foo.length)   // -> Error fooはまだunkownとして推論される。
 *  }
 * }
 * --------------------------------
 * ・!!
 * --------------------------------
 * ・e.dataTransfer
 * --------------------------------
 * ・concat
 * --------------------------------
 */