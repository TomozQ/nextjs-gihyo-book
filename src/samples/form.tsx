import { useForm, SubmitHandler } from 'react-hook-form'

type MyFormData = {
  firstName: string
  lastName: string
  category: string
}

export default function Form() {
  /**
   *  useFormフックはregister関数、handlerSubmit関数、errorsオブジェクトを返す
   *  register関数 ... フォームの<input>,<select>にフックを登録して、状態を管理下における
   *  handleSubmit関数 ... フォームのonSubmitのイベントハンドラを登録するために使用する。
   *  errorsオブジェクト ... どの要素にバリデーションエラーが発生しているかを検知する。
   */
  const { register, handleSubmit, formState: { errors }, } = useForm<MyFormData>()
  const onSubmit: SubmitHandler<MyFormData> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName', {required: true})} placeholder='名前' />
      {errors.firstName && <div>名前を入力してください</div>}
      <input {...register('lastName', {required: true})} placeholder='苗字' />
      {errors.lastName && <div>苗字を入力してください</div>}
      <select {...register('category', {required: true})}>
        <option value=''>選択...</option>
        <option value='A'>カテゴリA</option>
        <option value='B'>カテゴリB</option>
      </select>
      {errors.category && <div>カテゴリを選択したください</div>}
      <input type='submit' />
    </form>
  )
}