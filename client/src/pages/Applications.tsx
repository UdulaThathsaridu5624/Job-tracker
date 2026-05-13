import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar, Box, Button, Card, Container, Flex, Grid, Heading, Separator, Spinner, Text, TextField } from "@radix-ui/themes";
import { MapPin, Calendar, ChevronRight, ChevronLeft, Inbox, Plus, Search } from "lucide-react";
import { getApplications } from "../api/applications.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

const PAGE_SIZE = 6;

function statusColor(status: string): "blue" | "amber" | "green" | "red" | "gray" {
  const map: Record<string, "blue" | "amber" | "green" | "red" | "gray"> = {
    APPLIED: "blue",
    INTERVIEW: "amber",
    OFFER: "green",
    REJECTED: "red",
    WITHDRAWN: "gray",
  };
  return map[status] ?? "gray";
}

export default function Applications() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const filtered = applications.filter((app: any) =>
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="3" px="4" py="7">
        <Flex justify="between" align="center" mb="4">
          <Flex direction="column" gap="1">
            <Heading size="6">Applications</Heading>
            {!isLoading && (
              <Text size="2" color="gray">{filtered.length} application{filtered.length === 1 ? "" : "s"}</Text>
            )}
          </Flex>
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
          onChange={(e) => handleSearch(e.target.value)}
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
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Inbox size={36} style={{ color: "var(--gray-9)" }} />
            </Box>
            <Flex direction="column" align="center" gap="1">
              <Text size="4" weight="medium">
                {search ? "No results found" : "No applications yet"}
              </Text>
              <Text color="gray" size="2">
                {search ? `No companies match "${search}"` : "Add your first job application to get started."}
              </Text>
            </Flex>
            {!search && (
              <Link to="/applications/new" style={{ textDecoration: "none" }}>
                <Button size="2">
                  <Plus size={14} />
                  Add your first
                </Button>
              </Link>
            )}
          </Flex>
        )}

        {!isLoading && paginated.length > 0 && (
          <>
            <Grid columns="2" gap="4" mb="5">
              {paginated.map((app: any) => (
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
                    <Flex direction="column" gap="4" p="1">
                      {/* Top: avatar + company + badge */}
                      <Flex align="center" gap="3">
                        <Avatar
                          size="3"
                          fallback={app.company[0].toUpperCase()}
                          color={statusColor(app.status)}
                          radius="medium"
                          variant="soft"
                        />
                        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            weight="bold"
                            size="3"
                            style={{
                              color: "var(--gray-12)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {app.company}
                          </Text>
                          <Text
                            size="2"
                            style={{
                              color: "var(--gray-11)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {app.jobTitle}
                          </Text>
                        </Flex>
                        <StatusBadge status={app.status} />
                      </Flex>

                      <Separator size="4" />

                      {/* Bottom: location + date + chevron */}
                      <Flex justify="between" align="center">
                        <Flex gap="3">
                          {app.location && (
                            <Flex align="center" gap="1">
                              <MapPin size={13} style={{ color: "var(--gray-9)", flexShrink: 0 }} />
                              <Text size="1" color="gray">{app.location}</Text>
                            </Flex>
                          )}
                          <Flex align="center" gap="1">
                            <Calendar size={13} style={{ color: "var(--gray-9)" }} />
                            <Text size="1" color="gray">
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </Text>
                          </Flex>
                        </Flex>
                        <ChevronRight size={15} style={{ color: "var(--gray-8)" }} />
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Grid>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <Flex justify="center" align="center" gap="3">
                <Button
                  variant="soft"
                  color="gray"
                  size="2"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={14} />
                  Previous
                </Button>
                <Text size="2" color="gray">
                  Page {page} of {totalPages}
                </Text>
                <Button
                  variant="soft"
                  color="gray"
                  size="2"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              </Flex>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
