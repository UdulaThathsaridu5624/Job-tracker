import { useQuery } from "@tanstack/react-query";
import { Box, Card, Container, Flex, Grid, Heading, Text, Spinner } from "@radix-ui/themes";
import { TrendingUp, Send, Users, Award, XCircle, MinusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/applications.api";
import Navbar from "../components/Navbar";

const statCards = [
  { key: "applied",   label: "Applied",   icon: Send,        color: "var(--blue-9)"   },
  { key: "interview", label: "Interview",  icon: Users,       color: "var(--amber-9)"  },
  { key: "offer",     label: "Offer",      icon: Award,       color: "var(--green-9)"  },
  { key: "rejected",  label: "Rejected",   icon: XCircle,     color: "var(--red-9)"    },
  { key: "withdrawn", label: "Withdrawn",  icon: MinusCircle, color: "var(--gray-9)"   },
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
                <Flex align="center" justify="between">
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray" weight="medium">Total Applications</Text>
                    <Text size="8" weight="bold">{stats?.total ?? 0}</Text>
                    <Text size="2" color="gray">across all statuses</Text>
                  </Flex>
                  <Box
                    style={{
                      background: "var(--indigo-3)",
                      borderRadius: "var(--radius-3)",
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={28} style={{ color: "var(--indigo-9)" }} />
                  </Box>
                </Flex>
              </Card>

              <Grid columns={{ initial: "2", sm: "3", md: "5" }} gap="3">
                {statCards.map(({ key, label, icon: Icon, color }) => (
                  <Card key={key} size="2">
                    <Flex direction="column" align="center" gap="2" py="2">
                      <Icon size={20} style={{ color }} />
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
