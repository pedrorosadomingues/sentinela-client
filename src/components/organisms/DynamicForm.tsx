"use client";

import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Alert } from "@mui/material";
import Image from "next/image";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface AuthFormProps<T extends FieldValues> {
  title: string;
  fields: Field[];
  schema: ZodSchema<T>;
  buttonText: string;
  onSubmit: SubmitHandler<T>;
  isLoading: boolean;
  serverError?: Record<string, string> | null; // ✅ Suporte para erros específicos de cada campo
}

export default function AuthForm<T extends FieldValues>({
  title,
  fields,
  schema,
  buttonText,
  onSubmit,
  isLoading,
  serverError,
}: AuthFormProps<T>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="p-10 w-[80%] h-screen flex flex-col justify-center items-center max-w-[576px] mx-auto">
      <div className="w-[100%] flex flex-col justify-between ">    
        <Image
          src="/images/logo-vestiq.png"
          alt="Vestiq logo"
          width={150}
          height={250}
          priority
          className="mb-[20px]"
        />
        
        <p className="text-[30px] font-bold">{title}</p>
    
        {serverError && serverError.general && (
          <Alert severity="error" className="mb-4">
            {serverError.general}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-4">
          {fields.map((field) => (
            <div key={field.name} className="mb-5">
              <TextField
                label={field.label}
                variant="outlined"
                type={field.type}
                {...register(field.name as Path<T>)}
                className="w-full"
                error={!!errors[field.name] || !!serverError?.[field.name]} 
                helperText={
                  (errors[field.name]?.message as unknown as string) ||
                  serverError?.[field.name]
                }
              />
            </div>
          ))}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            className="bg-primary-background text-white"
          >
            {isLoading ? "Enviando..." : buttonText}
          </Button>
        </form>
      </div>
    </div>
  );
}
