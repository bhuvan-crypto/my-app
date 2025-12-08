"use client";

import { Button, Textarea, VStack } from "@chakra-ui/react";
import { useForm, FormProvider, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import { ProductSchema, productSchema } from "../schemas/product.schema";
import { Product } from "../lib/products";
import { useEffect } from "react";

interface Props {
    defaultValues?: Partial<Product>;
    onSubmit: (data: ProductSchema, setError: UseFormSetError<ProductSchema>) => void;
    onCancel?: () => void;
    submitText?: string;
    loader?: boolean;
}

export default function ProductForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitText = "Submit",
    loader
}: Props) {
    const methods = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: defaultValues?.name ?? "",
            price: defaultValues?.price ?? 0,
            description: defaultValues?.description ?? "",
            stock_quantity: defaultValues?.stockQuantity ?? 0,
            category_id: defaultValues?.categoryId ?? '0',
        },
    });

    const { handleSubmit, setError, reset } = methods;

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        } else {
            reset({
                name: "",
                price: 0,
                description: "",
                stock_quantity: 0,
                category_id: '0',
            })
        }
    }, [defaultValues])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit((data) => onSubmit(data, setError))}>
                <VStack align="stretch">
                    <FormInput name="name" label="Product Name" placeholder="Product name" type={"text"} />

                    <FormInput
                        name="price"
                        label="Price"
                        placeholder="0.00"
                        type="number"

                    />

                    <FormInput
                        name="description"
                        label="Description"
                        renderInput={(field) => (
                            <Textarea {...field} placeholder="Enter description" />
                        )}
                        type={"text"}
                    />

                    <FormInput
                        name="stock_quantity"
                        label="Stock Quantity"
                        type="number"
                        placeholder="0"
                    />

                    <FormInput
                        name="category_id"
                        label="Category Id"
                        placeholder="Category ID"
                        type={"text"}
                    />

                    <VStack align="stretch" mt={3}>
                        <Button colorScheme="blue" type="submit" loading={loader}>
                            {submitText}
                        </Button>

                        {onCancel && (
                            <Button variant="ghost" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </VStack>
                </VStack>
            </form>
        </FormProvider>
    );
}
