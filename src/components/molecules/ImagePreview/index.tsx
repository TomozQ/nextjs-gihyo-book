import styled from 'styled-components'
import Flex from 'components/layout/Flex'
import { CloseIcon } from 'components/atoms/IconButton'
import Text from 'components/atoms/Text'
import React from 'react'

const ImagePreviewContainer = styled.div`
  position: relative;
`

// 閉じるボタンのラップ
const CloseBox = styled(Flex)`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 06px 06px;
  background-color: rgba(44, 44, 44,  0.66);
  cursor: pointer;
`

// 画像タイトル
const ImageTitle = styled(Text)`
  position: absolute;
  top: 14px;
  border-radius: 06px 06px 0;
  background-color: #1d3461;
  box-sizing: border-box;
  padding-left: 4px;
  padding-right: 4px;
`

interface ImagePreviewProps {
  /**
   * 画像URL
   */
  src?: string
  /**
   * 代替テキスト
   */
  alt?: string
  /**
   * 縦幅
   */
  height?: string
  /**
   * 横幅
   */
  width?: string
  /**
   * 削除ボタンを押したときのイベントハンドラ
   */
  onRemove?: (src: string) => void
}

/**
 * イメージプレビュー
 */
const ImagePreview = ({
  src,
  alt,
  height,
  width,
  onRemove,
}: ImagePreviewProps) => {
  // 閉じるボタンを押したらonRemoveを呼ぶ
  const handleCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove && src && onRemove(src)

    return false
  }

  return (
    <ImagePreviewContainer>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} height={height} width={width} />
      <CloseBox
        alignItems='center'
        justifyContent='center'
        onClick={handleCloseClick}
      >
        <CloseIcon size={24} color='white' />
      </CloseBox>
    </ImagePreviewContainer>
  )
}

export default ImagePreview