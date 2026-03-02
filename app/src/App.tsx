import { AppShell, Button, Text, Card, Center, MantineProvider, Flex } from "@mantine/core";

export function App() {
  return (
    <MantineProvider>
      <AppShell>
        <AppShell.Header p="xs" fw="bold">🗳️ Microvote</AppShell.Header>
        <AppShell.Main m="xl" p="xl">
          <Center>
            <Card maw="30em" withBorder p="lg">
              <Flex direction="column" gap="sm">
                <Text size="lg" fw="bold">Connect the host Micro:Bit</Text>
                <Text>
                  To get started, plug your host Micro:Bit, press "connect",
                  and select your Micro:Bit from the list of devices.
                </Text>
                <Button>Connect</Button>
              </Flex>
            </Card>
          </Center>
        </AppShell.Main>
      </AppShell>
    </MantineProvider >
  );
}
