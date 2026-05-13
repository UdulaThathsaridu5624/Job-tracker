import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Box, Card, Flex, Heading, Text, TextField, Button, Callout } from "@radix-ui/themes";
import { Target } from "lucide-react";
import { registerUser } from "../api/auth.api";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(data: FormData) {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      gap="5"
      px="4"
      style={{ minHeight: "100vh", background: "var(--gray-2)" }}
    >
      <Flex direction="column" align="center" gap="2">
        <Box
          style={{
            background: "var(--indigo-3)",
            borderRadius: "var(--radius-3)",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Target size={32} style={{ color: "var(--indigo-9)" }} />
        </Box>
        <Text weight="bold" size="5" style={{ color: "var(--indigo-9)" }}>JobTracker</Text>
        <Text size="2" color="gray">Your personal job search command center</Text>
      </Flex>

      <Box style={{ width: "100%", maxWidth: "380px" }}>
        <Card size="4">
          <Flex direction="column" gap="5">
            <Flex direction="column" gap="1">
              <Heading size="6">Create an account</Heading>
              <Text size="2" color="gray">Start tracking your job search</Text>
            </Flex>

            {error && (
              <Callout.Root color="red" size="1">
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Name</Text>
                  <TextField.Root
                    {...register("name", { required: "Name is required" })}
                    placeholder="John Doe"
                    size="2"
                  />
                  {errors.name && <Text size="1" color="red">{errors.name.message}</Text>}
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Email</Text>
                  <TextField.Root
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="you@example.com"
                    size="2"
                  />
                  {errors.email && <Text size="1" color="red">{errors.email.message}</Text>}
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Password</Text>
                  <TextField.Root
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                    type="password"
                    placeholder="••••••••"
                    size="2"
                  />
                  {errors.password && <Text size="1" color="red">{errors.password.message}</Text>}
                </Flex>

                <Button type="submit" size="2">Create account</Button>
              </Flex>
            </form>

            <Text size="2" color="gray" align="center">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--indigo-9)", textDecoration: "none", fontWeight: 500 }}>
                Sign in
              </Link>
            </Text>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}
