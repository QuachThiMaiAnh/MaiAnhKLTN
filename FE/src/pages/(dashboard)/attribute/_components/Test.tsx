"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name_0754101233: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date. Please provide a valid date.",
  }),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_0754101233: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.name_0754101233.toISOString());
    toast({
      title: "Form submitted",
      description: values.name_0754101233.toISOString(),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="name_0754101233"
          render={({ field }) => (
            console.log(field.value),
            (
              <FormItem>
                <FormLabel>What's the best time for you?</FormLabel>
                <FormControl>
                  <SmartDatetimeInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. Tomorrow morning 9am"
                  />
                </FormControl>
                <FormDescription>Please select the full time</FormDescription>
                <FormMessage className="text-green-600" />
              </FormItem>
            )
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
