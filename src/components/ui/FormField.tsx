import React from "react"
import { Controller, Control, FieldValues, Path } from "react-hook-form"

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  render: (props: { field: any }) => React.ReactElement
}

export default function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => render({ field })}
    />
  )
}