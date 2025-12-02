"use client";

import { useState } from "react";
import {
  Field,
  Input,
  Button,
  Group,
  RadioGroup,
  HStack,
} from "@chakra-ui/react";

import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
export type IFieldType = "text" | "password" | "number" | "radio";
interface Props {
  name: string;
  label: string;
  type: IFieldType;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
  renderInput?: (
    field: ControllerRenderProps<FieldValues, string>,
    error: FieldError | undefined
  ) => React.ReactNode;
}

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  options,
  renderInput,
}: Props) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const renderFieldByType = (
    field: ControllerRenderProps<FieldValues, string>,
    error?: FieldError
  ) => {
    switch (type) {
      case "password":
        return (
          <Group attached w="full">
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
            />
            <Button
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
              borderColor={error ? "red.500" : undefined}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </Button>
          </Group>
        );

      case "radio":
        return (
          <RadioGroup.Root {...field}>
            <HStack gap="6">
              {options?.map((item) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </HStack>
          </RadioGroup.Root>
        );

      case "number":
        return (
          <Input
            {...field}
            type="number"
            placeholder={placeholder}
            borderColor={error ? "red.500" : undefined}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        );

      default:
        return (
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <Field.Root>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Field.Root invalid={!!error}>
            <Field.Label>{label}</Field.Label>
            {renderInput
              ? renderInput(field, error)
              : renderFieldByType(field, error)}
            <Field.ErrorText>{error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
    </Field.Root>
  );
}
