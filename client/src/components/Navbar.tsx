import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, Container, Avatar, IconButton } from "@radix-ui/themes";
import { Target, LayoutDashboard, Briefcase, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { appearance, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  return (
    <Box style={{ background: "var(--gray-1)", borderBottom: "1px solid var(--gray-4)" }}>
      <Container size="3">
        <Flex justify="between" align="center" py="3" px="4">
          <Flex gap="6" align="center">
            <Flex align="center" gap="2">
              <Target size={18} style={{ color: "var(--indigo-9)" }} />
              <Text weight="bold" size="4" style={{ color: "var(--indigo-9)" }}>
                JobTracker
              </Text>
            </Flex>

            <Flex gap="1">
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  gap="1"
                  px="3"
                  py="2"
                  style={{
                    borderRadius: "var(--radius-2)",
                    background: isActive("/dashboard") ? "var(--indigo-3)" : "transparent",
                    color: isActive("/dashboard") ? "var(--indigo-11)" : "var(--gray-11)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <LayoutDashboard size={14} />
                  <Text size="2" weight={isActive("/dashboard") ? "medium" : "regular"} className="nav-link-text">
                    Dashboard
                  </Text>
                </Flex>
              </Link>

              <Link to="/applications" style={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  gap="1"
                  px="3"
                  py="2"
                  style={{
                    borderRadius: "var(--radius-2)",
                    background: isActive("/applications") ? "var(--indigo-3)" : "transparent",
                    color: isActive("/applications") ? "var(--indigo-11)" : "var(--gray-11)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <Briefcase size={14} />
                  <Text size="2" weight={isActive("/applications") ? "medium" : "regular"} className="nav-link-text">
                    Applications
                  </Text>
                </Flex>
              </Link>
            </Flex>
          </Flex>

          <Flex gap="3" align="center">
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              onClick={toggleTheme}
              aria-label={appearance === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {appearance === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </IconButton>

            <Avatar
              size="2"
              fallback={user?.name?.[0]?.toUpperCase() ?? "U"}
              color="indigo"
              radius="full"
            />
            <Text size="2" color="gray" className="nav-user-name">{user?.name}</Text>
            <Button variant="soft" color="gray" size="2" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
