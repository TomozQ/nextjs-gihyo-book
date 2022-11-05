import { useForm, SubmitHandler } from 'react-hook-form'

type MyFormData = {
  firstName: string
  lastName: string
  category: string
}

export default function Form() {
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