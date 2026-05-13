import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, Container, Avatar } from "@radix-ui/themes";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box style={{ background: "var(--gray-1)", borderBottom: "1px solid var(--gray-4)" }}>
      <Container size="3">
        <Flex justify="between" align="center" py="4" px="4">
          <Flex gap="6" align="center">
            <Text weight="bold" size="4" style={{ color: "var(--indigo-9)" }}>
              JobTracker
            </Text>
            <Flex gap="4">
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <Text size="2" color="gray" style={{ cursor: "pointer" }}>Dashboard</Text>
              </Link>
              <Link to="/applications" style={{ textDecoration: "none" }}>
                <Text size="2" color="gray" style={{ cursor: "pointer" }}>Applications</Text>
              </Link>
            </Flex>
          </Flex>

          <Flex gap="3" align="center">
            <Avatar
              size="2"
              fallback={user?.name?.[0]?.toUpperCase() ?? "U"}
              color="indigo"
              radius="full"
            />
            <Text size="2" color="gray">{user?.name}</Text>
            <Button variant="soft" color="gray" size="2" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
