// import { ReactNode, useMemo } from 'react'
// import { FieldValues, useFormContext } from 'react-hook-form'
// import { Label, LabelProps } from 'tamagui'
// import {
//   createConfigForm,
//   defaultComponents,
//   defaultHelpers
// } from 'tamagui-react-hook-form'

// const customHelpers = {
//   ...defaultHelpers,
//   Error: ({
//     name,
//     ...props
//   }: LabelProps & { name: keyof FieldValues }): ReactNode => {
//     const { getFieldState, formState } = useFormContext()
//     const field = getFieldState(name, formState)
//     return useMemo(
//       () => (
//         <Label htmlFor={name} color={'$red10'} {...props}>
//           {field.error?.message ?? null}
//         </Label>
//       ),
//       [name, props, field]
//     )
//   }
// }

// export const createForm = createConfigForm(defaultComponents, customHelpers)
