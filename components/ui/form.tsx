"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { UserValidation } from "@/lib/validations/user";
import Image from "next/image";
import { Textarea } from "./textarea";

export function Form() {
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: "",
      username: "",
      bio: "",
    },
  });

  const handleImage = (e: React.ChangeEvent, fieldChange: () => void) => {
    e.preventDefault();
  };
  function onSubmit(data: z.infer<typeof UserValidation>) {
    console.log(data);
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form
          {...form}
          className="flex flex-col justify-start gap-10 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="profile_photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="flex text-base-semibold text-light-2 w-full"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    className="account-form_image-label left-align"
                    htmlFor="profile_photo"
                  >
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt="profile photo"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain"
                      />
                    ) : (
                      <Image
                        src="/assets/profile.svg"
                        alt="profile photo"
                        width={24}
                        height={24}
                        className=" object-contain"
                      />
                    )}
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className=" account-form_image-input "
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="flex  flex-col w-full gap-3"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    className="text-base-semibold text-light-2"
                    htmlFor="name"
                  >
                    Name
                  </FieldLabel>
                  <Input
                    type="text"
                    className=" account-form_input no-focus"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col w-full gap-3"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    className="text-base-semibold text-light-2"
                    htmlFor="username"
                  >
                    UserName
                  </FieldLabel>
                  <Input
                    type="text"
                    className=" account-form_input no-focus"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col w-full gap-3"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel
                    className="text-base-semibold text-light-2"
                    htmlFor="bio"
                  >
                    Bio
                  </FieldLabel>
                  <Textarea
                    rows={10}
                    className=" account-form_input no-focus"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" className="bg-primary-500" form="">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
