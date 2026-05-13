import { useQuery } from "@tanstack/react-query";
import { Box, Card, Container, Flex, Grid, Heading, Text, Spinner } from "@radix-ui/themes";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/applications.api";
import Navbar from "../components/Navbar";

const statCards = [
  { key: "applied",   label: "Applied",   color: "#3b82f6" },
  { key: "interview", label: "Interview",  color: "#f59e0b" },
  { key: "offer",     label: "Offer",      color: "#10b981" },
  { key: "rejected",  label: "Rejected",   color: "#ef4444" },
  { key: "withdrawn", label: "Withdrawn",  color: "#6b7280" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Navbar />
      <Container size="3" px="4" py="7">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="1">
            <Heading size="7">Welcome back, {user?.name}</Heading>
            <Text size="3" color="gray">Here's how your job search is going.</Text>
          </Flex>

          {isLoading ? (
            <Flex justify="center" py="9"><Spinner size="3" /></Flex>
          ) : (
            <>
              <Card size="3">
                <Flex direction="column" gap="1">
                  <Text size="2" color="gray" weight="medium">Total Applications</Text>
                  <Text size="8" weight="bold">{stats?.total ?? 0}</Text>
                </Flex>
              </Card>

              <Grid columns="5" gap="3">
                {statCards.map(({ key, label, color }) => (
                  <Card key={key} size="2" style={{ borderTop: `3px solid ${color}` }}>
                    <Flex direction="column" align="center" gap="1" py="2">
                      <Text size="6" weight="bold">{stats?.[key] ?? 0}</Text>
                      <Text size="1" color="gray">{label}</Text>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
