"use client";

import { Field, Input } from "@chakra-ui/react";
import { Controller, ControllerRenderProps, FieldError, FieldValues, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  renderInput?: (field: ControllerRenderProps<FieldValues, string>,error:FieldError | undefined) => React.ReactNode;
}

export default function FormInput({ 
  name, 
  label, 
  type = "text", 
  placeholder,
  renderInput
}: Props) {

  const { control } = useFormContext();

  return (
    <Field.Root>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Field.Root invalid={!!error}>
            <Field.Label>{label}</Field.Label>

            {renderInput ? (
              renderInput(field,error)  
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                _invalid={{ borderColor: "red.500" }}
              />
            )}

            <Field.ErrorText>{error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
    </Field.Root>
  );
}
