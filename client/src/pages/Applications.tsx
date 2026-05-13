import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Box, Button, Container, Flex, Heading, Spinner, Table, Text } from "@radix-ui/themes";
import { getApplications } from "../api/applications.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function Applications() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="3" px="4" py="7">
        <Flex justify="between" align="center" mb="5">
          <Heading size="6">Applications</Heading>
          <Link to="/applications/new" style={{ textDecoration: "none" }}>
            <Button size="2">+ Add New</Button>
          </Link>
        </Flex>

        {isLoading && <Flex justify="center" py="9"><Spinner size="3" /></Flex>}

        {!isLoading && applications.length === 0 && (
          <Flex direction="column" align="center" gap="2" py="9">
            <Text size="4" weight="medium">No applications yet</Text>
            <Text color="gray" size="2">Add your first job application to get started.</Text>
          </Flex>
        )}

        {!isLoading && applications.length > 0 && (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Job Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Company</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Applied</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {applications.map((app: any) => (
                <Table.Row key={app.id}>
                  <Table.Cell>
                    <Link to={`/applications/${app.id}`} style={{ color: "var(--indigo-9)", textDecoration: "none", fontWeight: 500 }}>
                      {app.jobTitle}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{app.company}</Table.Cell>
                  <Table.Cell><StatusBadge status={app.status} /></Table.Cell>
                  <Table.Cell>{new Date(app.appliedDate).toLocaleDateString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Container>
    </Box>
  );
}
