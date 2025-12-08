import { useAuth } from "../hooks/useAuth";
import { Box, Flex, VStack, Heading, Text, SimpleGrid, Card, CardBody } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <Flex flex={1}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box flex={1} p={8} overflowY="auto">
          {/* Welcome Card */}
          <Card mb={8} bg="white">
            <CardBody>
              <Heading as="h2" size="lg" mb={4}>
                Bienvenido, {user?.nombreUsuario}!
              </Heading>
              <Text color="gray.600" mb={4}>
                Este es tu panel de control. Aquí podrás gestionar:
              </Text>
              <VStack align="start" spacing={2} color="gray.600">
                <Text>👥 Clientes y huéspedes</Text>
                <Text>🛏️ Cuartos del hotel</Text>
                <Text>📅 Reservas y disponibilidad</Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg="white">
              <CardBody textAlign="center">
                <Text
                  fontSize="xs"
                  fontWeight={600}
                  color="gray.600"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Total Clientes
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  --
                </Text>
              </CardBody>
            </Card>

            <Card bg="white">
              <CardBody textAlign="center">
                <Text
                  fontSize="xs"
                  fontWeight={600}
                  color="gray.600"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Cuartos Disponibles
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  --
                </Text>
              </CardBody>
            </Card>

            <Card bg="white">
              <CardBody textAlign="center">
                <Text
                  fontSize="xs"
                  fontWeight={600}
                  color="gray.600"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Reservas Activas
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  --
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      </Flex>
    </Flex>
  );
};
