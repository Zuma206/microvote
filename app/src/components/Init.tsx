import { Button, Card, Flex, Text } from "@mantine/core";
import { useConnect } from "../lib/connect";

export function Init() {
  const connect = useConnect();

  return (
    <Card maw="30em" withBorder p="lg">
      <Flex direction="column" gap="sm">
        <Text size="lg" fw="bold">Connect the host Micro:Bit</Text>
        <Text>
          To get started, plug your host Micro:Bit, press "connect",
          and select your Micro:Bit from the list of devices.
        </Text>
        <Button onClick={connect}>Connect</Button>
      </Flex>
    </Card>
  );
}
