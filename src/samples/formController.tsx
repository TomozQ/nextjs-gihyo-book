import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import Checkbox from '@mui/material/Checkbox'

type MyFormData = {
  isChecked: boolean
}

export default function FormController() {
  const { handleSubmit, control, formState: { errors }} = useForm<MyFormData>()
  const onSubmit: SubmitHandler<MyFormData> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='isChecked'
        control={control}
        defaultValue={false}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => <Checkbox onChange={onChange} value={value} />}
      />
      {errors.isChecked && <label>チェックしてください</label>}
      <input type='submit' />
    </form>
  )
}