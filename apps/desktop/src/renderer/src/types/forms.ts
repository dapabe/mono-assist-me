/**
 *  When state comes from outside the component
 */
export type IFormProps<FormSchema> = {
  values: FormSchema
  /** Wheter outside values are being loaded */
  isLoading?: Record<keyof FormSchema, boolean>
  /** Wether has loaded with errors */
  errorsIn?: Record<keyof FormSchema, boolean>
}
