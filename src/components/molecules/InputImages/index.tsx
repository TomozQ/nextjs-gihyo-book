import React, {useCallback, useMemo} from 'react'
import styled from 'styled-components'
import Box from 'components/leyout/Box'
import Flex from 'components/leyout/Flex'
import Dropzone from '../Dropzone'
import ImagePreview from '../ImagePreview'

const InputImagesContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-top: 8px;
  }
`

export type FileData = {
  id?: string
  src?: string
  file?: File
  selected?: boolean
  chosen?: boolean
}

interface InputImagesProps {
  name?: string
  images: FileData[]
  maximumNumber?: number
  hasError?: boolean
  width?: string
  height?: string
  onChange: (images: FileData[]) => void
}

/**
 * インプットイメージ
 */
const InputImages = (props: InputImagesProps) => {
  const {
    images,
    maximumNumber,
    name,
    hasError,
    width='100%',
    height='260px',
    onChange,
  } = props

  const files = useMemo(
    () => 
      images
        .filter((img: FileData) => img.file)
        .map((img: FileData) => img.file as File),
      [images]
  )

  const isDropzoneDisplay =
    !maximumNumber || images.length < maximumNumber ? 'block' : 'none'

  const onRemove = useCallback(
    (src: string) => {
      const image = images.find((img: FileData) => img.src === src)
      const newImages = images.filter((img: FileData) => img.src !== src)

      if (image) {
        if(image.file && image.src) {
          URL.revokeObjectURL(image.src)
          delete image.src
        }
      }

      onChange && onChange(newImages)
    },
    [images, onChange]
  )

  const onDrop = useCallback(
    (files: File[]) => {
      const newImages = []
      for (const file of files) {
        const img = images.find((img: FileData) => img.file === file)

        if (
          !img &&
          (!maximumNumber || images.length + newImages.length < maximumNumber)
        ) {
          newImages.push({ file, src: URL.createObjectURL(file) })
        }
      }
    },
    [images, maximumNumber, onChange]
  )

  return (
    <InputImagesContainer flexDirection='column'>
      {images && 
        images.map((img, index) => {
          return (
            <ImagePreview 
              alt={img.id}
              key={index}
              src={img.src}
              height={height}
              onRemove={onRemove}
            />
          )
        })
      }
      <Box style={{ display: isDropzoneDisplay }}>
        <Dropzone 
          acceptedFileTypes={[
            'image/gif',
            'image/jpeg',
            'image/jpg',
            'image/png'
          ]}
          name={name}
          height={height}
          width={width}
          value={files}
          hasError={hasError}
          onDrop={onDrop}
        />
      </Box>
    </InputImagesContainer>
  )
}

export default InputImages

/**
 * 調べること
 * --------------------------------
 * ・URL.revokeObjectURL(image.src)
 * ObjectURLとは
 * オブジェクトにユニークなIDを付け、そのIDとURLを組み合わせた文字列
 * この文字列はブラウザがURLとして解釈できる
 * 
 * FileオブジェクトをURL.createObjectURLに渡すとオブジェクトURLを取得できる
 * const objectUrl = URL.createObjectURL(obj) -> "blob:null/f79b06de-2072-4fe4-bb2b-a89383231a79"
 * ※ objはBlobオブジェクトを指定する（FileオブジェクトはBlobの派生なので指定可能）
 * 
 * Blobから作成したObjectURLは、Blob URLストアにBlobオブジェクトへの参照とペアで格納される。
 * Blob URLストア{
 *  Blob URL1: {ObjectURL, Blobオブジェクトへの参照}
 *  Blob URL2: {ObjectURL, Blobオブジェクトへの参照}
 *  ...
 * }
 * URLの参照行為、例えばimgタグのsrcにObjectURLがセットされると、Blob URLストアから一致するものを検索してBlobオブジェクトからデータを取得する
 * 
 * ObjectURLはBlobを保持する。
 * JavaScriptは他から参照されていないオブジェクトを、ガベージコレクションのアルゴリズムに基づいて自動でメモリ上から削除する。
 * ※ガベージコレクション
 *  ... コンピュータプログラムの実行環境などが備える機能の一つで、実行中のプログラムが占有していたメモリ領域のうち不要になったものを自動的に解放し、
 *      空き領域として再利用できるようにするもの。そのような処理を実行するプログラムを「ガベージコレクタ」という。
 * File APIなどで作成されたBlobオブジェクトは、必要無くなれば削除される。
 * しかし
 * URL.createObjectURL()を実行すると、Blob URLストア内にBlobオブジェクトへの参照が作成され、
 * これは自動で削除されない。（ガベージコレクタが削除してくれない）
 * -> 使用する予定がないのに残り続ける。
 * URL.revokeObjectURL()はこのBlobオブジェクトの参照をBlob URLストア内から削除することができる
 * --------------------------------
 * ・delete
 * objectからプロパティを削除する
 * 今回の場合は
 * delete img.src
 * なのでimgオブジェクトからsrcというプロパティを削除する。
 * --------------------------------
 */