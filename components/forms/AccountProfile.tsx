"use client";

import { useState } from "react";
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

import { UserValidation } from "@/lib/validations/user";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}
const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    console.log("submit button pr");
    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
    // Update user profile
    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });
    if (pathname === "profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <Card className="w-full sm:max-w-md px-0">
      <CardContent className="w-full px-0 mx-0">
        <form
          className="flex flex-col justify-start gap-10 w-full "
          id="account-profile-form"
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
                  <FieldLabel className="account-form_image-label p-0 m-0">
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
                    className=" account-form_image-input p-0 m-0 "
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
                  <FieldLabel className="text-base-semibold text-light-2">
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
                  <FieldLabel className="text-base-semibold text-light-2">
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
                  <FieldLabel className="text-base-semibold text-light-2">
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
      <CardFooter className="w-full px-0">
        <Field orientation="horizontal">
          <Button
            type="submit"
            className="mt-5 btn w-full bg-primary-500 text-light-2"
            form="account-profile-form"
          >
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AccountProfile;
