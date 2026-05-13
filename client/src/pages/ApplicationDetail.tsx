import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { AlertDialog, Box, Button, Card, Container, Flex, Heading, ScrollArea, Select, Separator, Spinner, Text, TextArea, TextField } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import { getApplication, updateApplication, deleteApplication } from "../api/applications.api";
import { extractMarkdownFromClipboard } from "../lib/pasteHandler";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id as string),
  });

  const { register, handleSubmit, control, reset, setValue } = useForm();

  useEffect(() => {
    if (application) {
      reset({
        ...application,
        appliedDate: application.appliedDate?.slice(0, 10),
        followUpDate: application.followUpDate?.slice(0, 10) ?? "",
      });
    }
  }, [application, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateApplication(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate("/applications");
    },
  });

  if (isLoading) return <><Navbar /><Flex justify="center" py="9"><Spinner size="3" /></Flex></>;
  if (!application) return <><Navbar /><Flex justify="center" py="9"><Text color="gray">Application not found.</Text></Flex></>;

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="2" px="4" py="7">
        <Card size="4">
          <Flex direction="column" gap="5">
            <Flex justify="between" align="start">
              <Flex direction="column" gap="1">
                <Heading size="6">{application.jobTitle}</Heading>
                <Text color="gray" size="2">
                  {application.company}{application.location && ` · ${application.location}`}
                </Text>
              </Flex>
              <StatusBadge status={application.status} />
            </Flex>

            <Separator size="4" />

            {editing ? (
              <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>
                <Flex direction="column" gap="4">
                  <Flex gap="4" className="form-row">
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="jobTitle" size="2" weight="medium">Job Title</Text>
                      <TextField.Root id="jobTitle" {...register("jobTitle")} size="2" />
                    </Flex>
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="company" size="2" weight="medium">Company</Text>
                      <TextField.Root id="company" {...register("company")} size="2" />
                    </Flex>
                  </Flex>

                  <Flex gap="4" className="form-row">
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="location" size="2" weight="medium">Location</Text>
                      <TextField.Root id="location" {...register("location")} size="2" />
                    </Flex>
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="status" size="2" weight="medium">Status</Text>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select.Root value={field.value} onValueChange={field.onChange} size="2">
                            <Select.Trigger id="status" style={{ width: "100%" }} />
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

                  <Flex gap="4" className="form-row">
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="appliedDate" size="2" weight="medium">Applied Date</Text>
                      <TextField.Root id="appliedDate" {...register("appliedDate")} type="date" size="2" />
                    </Flex>
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Text as="label" htmlFor="followUpDate" size="2" weight="medium">Follow Up Date</Text>
                      <TextField.Root id="followUpDate" {...register("followUpDate")} type="date" size="2" />
                    </Flex>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" htmlFor="notes" size="2" weight="medium">Notes</Text>
                    <TextArea id="notes" {...register("notes")} rows={3} size="2" />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" htmlFor="jobDescription" size="2" weight="medium">Job Description</Text>
                    <TextArea
                    id="jobDescription"
                    {...register("jobDescription")}
                    rows={10}
                    size="2"
                    onPaste={(e) => {
                      const md = extractMarkdownFromClipboard(e);
                      if (md !== null) {
                        e.preventDefault();
                        setValue("jobDescription", md, { shouldDirty: true });
                      }
                    }}
                  />
                  </Flex>

                  <Flex gap="3" justify="end">
                    <Button type="button" variant="soft" color="gray" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </Flex>
                </Flex>
              </form>
            ) : (
              <Flex direction="column" gap="4">
                <Flex gap="6">
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray" weight="medium">APPLIED</Text>
                    <Text size="2">{new Date(application.appliedDate).toLocaleDateString()}</Text>
                  </Flex>
                  {application.followUpDate && (
                    <Flex direction="column" gap="1">
                      <Text size="1" color="gray" weight="medium">FOLLOW UP</Text>
                      <Text size="2">{new Date(application.followUpDate).toLocaleDateString()}</Text>
                    </Flex>
                  )}
                </Flex>

                {application.notes && (
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray" weight="medium">NOTES</Text>
                    <Text size="2">{application.notes}</Text>
                  </Flex>
                )}

                {application.jobDescription && (
                  <Flex direction="column" gap="2">
                    <Text size="1" color="gray" weight="medium">JOB DESCRIPTION</Text>
                    <ScrollArea style={{ maxHeight: "400px", background: "var(--gray-2)", borderRadius: "var(--radius-3)", padding: "16px" }}>
                      <div className="job-description-markdown">
                        <ReactMarkdown>{application.jobDescription}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </Flex>
                )}

                <Flex gap="3" justify="end" pt="2">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                      <Button variant="soft" color="red">Delete</Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content>
                      <AlertDialog.Title>Delete application?</AlertDialog.Title>
                      <AlertDialog.Description>
                        This will permanently delete your application to {application.company}. This cannot be undone.
                      </AlertDialog.Description>
                      <Flex gap="3" justify="end" mt="4">
                        <AlertDialog.Cancel><Button variant="soft" color="gray">Cancel</Button></AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button color="red" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                  <Button onClick={() => setEditing(true)}>Edit</Button>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
