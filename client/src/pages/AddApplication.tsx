import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Callout, Card, Container, Flex, Heading, Select, Text, TextArea, TextField } from "@radix-ui/themes";
import { createApplication } from "../api/applications.api";
import Navbar from "../components/Navbar";

interface FormData {
  jobTitle: string;
  company: string;
  location?: string;
  status: string;
  appliedDate: string;
  followUpDate?: string;
  notes?: string;
  jobDescription?: string;
}

export default function AddApplication() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: { status: "APPLIED" },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate("/applications");
    },
  });

  function onSubmit(data: FormData) {
    mutation.mutate(data);
  }

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="2" px="4" py="7">
        <Card size="4">
          <Flex direction="column" gap="5">
            <Heading size="6">Add Application</Heading>

            {mutation.isError && (
              <Callout.Root color="red" size="1">
                <Callout.Text>
                  {(mutation.error as any)?.response?.data?.error || "Something went wrong"}
                </Callout.Text>
              </Callout.Root>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                <Flex gap="4">
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Job Title *</Text>
                    <TextField.Root {...register("jobTitle", { required: "Required" })} placeholder="Software Engineer" size="2" />
                    {errors.jobTitle && <Text size="1" color="red">{errors.jobTitle.message}</Text>}
                  </Flex>
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Company *</Text>
                    <TextField.Root {...register("company", { required: "Required" })} placeholder="Acme Corp" size="2" />
                    {errors.company && <Text size="1" color="red">{errors.company.message}</Text>}
                  </Flex>
                </Flex>

                <Flex gap="4">
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Location</Text>
                    <TextField.Root {...register("location")} placeholder="Remote" size="2" />
                  </Flex>
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Status</Text>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select.Root value={field.value} onValueChange={field.onChange} size="2">
                          <Select.Trigger style={{ width: "100%" }} />
                          <Select.Content>
                            <Select.Item value="APPLIED">Applied</Select.Item>
                            <Select.Item value="INTERVIEW">Interview</Select.Item>
                            <Select.Item value="OFFER">Offer</Select.Item>
                            <Select.Item value="REJECTED">Rejected</Select.Item>
                            <Select.Item value="WITHDRAWN">Withdrawn</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Flex>
                </Flex>

                <Flex gap="4">
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Applied Date *</Text>
                    <TextField.Root {...register("appliedDate", { required: "Required" })} type="date" size="2" />
                    {errors.appliedDate && <Text size="1" color="red">{errors.appliedDate.message}</Text>}
                  </Flex>
                  <Flex direction="column" gap="1" style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">Follow Up Date</Text>
                    <TextField.Root {...register("followUpDate")} type="date" size="2" />
                  </Flex>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Notes</Text>
                  <TextArea {...register("notes")} placeholder="Any personal notes about this application..." rows={3} size="2" />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Job Description</Text>
                  <Text size="1" color="gray">Paste the full job posting here — formatting will be preserved.</Text>
                  <TextArea {...register("jobDescription")} placeholder="Paste job description here..." rows={10} size="2" />
                </Flex>

                <Flex gap="3" justify="end">
                  <Button type="button" variant="soft" color="gray" onClick={() => navigate("/applications")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Add Application"}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
