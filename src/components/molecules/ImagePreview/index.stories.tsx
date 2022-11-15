import React, { useState, useEffect } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react'
import styled from 'styled-components'
import ImagePreview from './index'
import Dropzone from "components/molecules/Dropzone";

export default {
  title: 'Molecules/ImagePreview',
  argTypes: {
    src: {
      control: {type: 'text'},
      description: '画像URL',
      table: {
        type: {summary: 'string' }
      }
    },
    alt: {
      control: {type: 'text'},
      description: '代替テキスト',
      table: {
        type: {summary: 'string'}
      }
    },
    height: {
      control: {type: 'number'},
      description: '縦幅',
      table: {
        type: {summary: 'number'}
      }
    },
    width: {
      control: {type: 'number'},
      description: '横幅',
      table: {
        type: {summary: 'number'}
      }
    },
    onRemove: {
      description: '削除ボタンを押した時のイベントハンドラ',
      table: {
        type: {summary: 'function'}
      }
    }
  }
} as ComponentMeta<typeof ImagePreview>

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`

interface Image {
  file?: File
  src?: string
}

// ドロップゾーンとの組み合わせ
const Template: ComponentStory<typeof ImagePreview> = (args) => {
  const [files, setFiles] = useState<File[]>([])
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    // ファイルの数が変更されると、表示する画像を変更
    const newImages = [...images]
    for (const f of files) {
      const index = newImages.findIndex((img: Image) => img.file === f)

      if (index === -1) {
        newImages.push({
          file: f,
          src: URL.createObjectURL(f),
        })
      }
    }
    setImages(newImages)
  },[files])

  // 閉じるボタンが押されたら、画像を削除
  const handleRemove = (src: string) => {
    const image = images.find((img: Image) => img.src === src)

    if (image !== undefined) {
      setImages((images) => images.filter((img) => img.src !== image.src))
      setFiles((files) => files.filter((file: File) => file !== image.file))
    }

    args && args.onRemove && args.onRemove(src)
  }

  return (
    <Container>
      <Dropzone value={files} onDrop={(fileList) => setFiles(fileList)} />
      {images.map((image, i) => (
        <ImagePreview 
          key={i}
          src={image.src}
          {...args}
          width='200px'
          onRemove={handleRemove}
        />
      ))}
    </Container>
  )
}

export const WithDropzone = Template.bind({})
WithDropzone.args = {}