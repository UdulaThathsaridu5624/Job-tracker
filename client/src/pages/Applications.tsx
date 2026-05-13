import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Box, Button, Card, Container, Flex, Grid, Heading, Spinner, Text, TextField } from "@radix-ui/themes";
import { MapPin, Calendar, ChevronRight, Inbox, Plus, Search } from "lucide-react";
import { getApplications } from "../api/applications.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function Applications() {
  const [search, setSearch] = useState("");
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const filtered = applications.filter((app: any) =>
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="3" px="4" py="7">
        <Flex justify="between" align="center" mb="4">
          <Heading size="6">Applications</Heading>
          <Link to="/applications/new" style={{ textDecoration: "none" }}>
            <Button size="2">
              <Plus size={14} />
              Add New
            </Button>
          </Link>
        </Flex>

        <TextField.Root
          placeholder="Search by company name..."
          size="2"
          mb="5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        >
          <TextField.Slot>
            <Search size={14} style={{ color: "var(--gray-9)" }} />
          </TextField.Slot>
        </TextField.Root>

        {isLoading && (
          <Flex justify="center" py="9"><Spinner size="3" /></Flex>
        )}

        {!isLoading && filtered.length === 0 && (
          <Flex direction="column" align="center" gap="4" py="9">
            <Box
              style={{
                background: "var(--gray-3)",
                borderRadius: "var(--radius-3)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Inbox size={32} style={{ color: "var(--gray-9)" }} />
            </Box>
            <Flex direction="column" align="center" gap="1">
              <Text size="4" weight="medium">No applications yet</Text>
              <Text color="gray" size="2">Add your first job application to get started.</Text>
            </Flex>
            <Link to="/applications/new" style={{ textDecoration: "none" }}>
              <Button size="2">
                <Plus size={14} />
                Add your first
              </Button>
            </Link>
          </Flex>
        )}

        {!isLoading && filtered.length > 0 && (
          <Grid columns="3" gap="4">
            {filtered.map((app: any) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <Card
                  variant="surface"
                  className="app-card-hover"
                  style={{ cursor: "pointer", height: "100%" }}
                >
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text weight="bold" size="3" style={{ color: "var(--gray-12)" }}>
                        {app.company}
                      </Text>
                      <StatusBadge status={app.status} />
                    </Flex>

                    <Text size="2" color="gray" style={{ lineHeight: "1.4" }}>
                      {app.jobTitle}
                    </Text>

                    {app.location && (
                      <Flex align="center" gap="1">
                        <MapPin size={12} style={{ color: "var(--gray-9)", flexShrink: 0 }} />
                        <Text size="1" color="gray">{app.location}</Text>
                      </Flex>
                    )}

                    <Flex justify="between" align="center" mt="1">
                      <Flex align="center" gap="1">
                        <Calendar size={12} style={{ color: "var(--gray-9)" }} />
                        <Text size="1" color="gray">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                      <ChevronRight size={14} style={{ color: "var(--gray-8)" }} />
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
