"use client";

import { startTransition, useActionState, useState } from "react";
import { Form, Input, Button, Card } from "@heroui/react";
import z from "zod";
import { addWebsiteAction } from "../submit/actions";
import Link from "next/link";

const FormSchema = z.object({
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .refine(
      (val) => {
        // Check if it's a URL with protocol
        if (/^https?:\/\//i.test(val)) {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }
        // Check if it's a valid domain without protocol
        return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
          val
        );
      },
      {
        message: "Please enter a valid URL or domain name",
      }
    ),
  websiteTitle: z.string().min(1, "Website title is required"),
  websiteDescription: z.string().optional(),
  username: z.string().optional(),
});

interface Errors {
  websiteUrl: string;
  websiteTitle: string;
}

export const SubmitForm = () => {
  const [submitted, setSubmitted] = useState<z.infer<typeof FormSchema> | null>(
    null
  );
  const [errors, setErrors] = useState<Partial<Errors>>({
    websiteUrl: "",
    websiteTitle: "",
  });
  const [_, addWebsite] = useActionState(addWebsiteAction, null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = FormSchema.safeParse(data);

    if (result.success) {
      setSubmitted(result.data);
      setErrors({});
      startTransition(() => addWebsite(formData));
    } else {
      const fieldErrors: Partial<Record<keyof Errors, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof Errors] = issue.message;
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <>
      <Card className="max-w-md p-8 mx-auto mb-10">
        {submitted ? (
          <>
            <p className="text-center">
              You&apos;ve just submitted a website to be added to the shuffle.
            </p>
            <p className="text-center mt-4">Thanks for your contribution!</p>
          </>
        ) : null}
        {!submitted ? (
          <Form
            action={addWebsite}
            className="w-full justify-center items-stretch"
            validationErrors={errors}
            onSubmit={onSubmit}
          >
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                label="Website URL"
                labelPlacement="outside"
                name="websiteUrl"
                placeholder="example.com"
                autoComplete="off"
              />

              <Input
                isRequired
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter the website title";
                  }
                  return errors.websiteTitle;
                }}
                label="Website Title"
                labelPlacement="outside"
                name="websiteTitle"
                placeholder="Enter the website title"
              />

              <Input
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter the website title";
                  }
                  return errors.websiteTitle;
                }}
                label="Website Description"
                labelPlacement="outside"
                name="websiteDescription"
                placeholder="Enter a short description"
              />

              <Input
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Enter your username"
              />

              <div className="flex gap-4">
                <Button className="w-full" color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </div>

            {submitted && (
              <div className="text-small text-default-500 mt-4">
                Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
              </div>
            )}
          </Form>
        ) : null}
      </Card>
      {submitted ? (
        <div className="flex justify-center w-full">
          <Button
            size="lg"
            color="secondary"
            variant="shadow"
            radius="sm"
            as={Link}
            href="/"
          >
            Continue Shuffling!
          </Button>
        </div>
      ) : null}
    </>
  );
};
