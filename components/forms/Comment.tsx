"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // Do something with the form values.
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname,
    );
    form.reset();
  };
  return (
    <form
      id="comment-thread-form"
      className="comment-form items-center border-none text-light-1"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="flex flex-row w-full items-center">
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            /* FIX: Added flex, items-center, flex-1, and w-full */
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-row items-center w-full gap-3"
            >
              <FieldLabel htmlFor="comment-thread-form-thread">
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FieldLabel>

              {/* Input */}
              <Input
                {...field}
                id="comment-thread-form-thread"
                aria-invalid={fieldState.invalid}
                placeholder="Comment..."
                autoComplete="off"
                className="flex-2 no-focus border-dark-4 bg-dark-1 text-light-1 bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          className="comment-form_btn bg-primary-500"
          form="comment-thread-form"
        >
          Reply
        </Button>
      </FieldGroup>
    </form>
  );
};
export default Comment;
