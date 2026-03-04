import { Grid, Card, Text, Button, Flex } from "@mantine/core";
import { useMicrovote } from "../lib/context";

interface DeviceProps {
  device: number;
}

function Device(props: DeviceProps) {
  const { serialVote } = useMicrovote();

  return (
    <Grid.Col span={3}>
      <Card withBorder p="xl">
        <Card.Section><Text size="lg" pb="sm" fw="bold">🕹️ {props.device}</Text></Card.Section>
        <Card.Section>
          <Flex gap="xs">
            <Button onClick={() => serialVote?.identify(props.device)}>
              Identify
            </Button>
            <Button onClick={() => serialVote?.remove(props.device)} color="red">
              Remove
            </Button>
          </Flex>
        </Card.Section>
      </Card>
    </Grid.Col>
  );
}

export function Devices() {
  const { devices } = useMicrovote();

  return (
    <div>
      <Grid>
        {devices.map(device => (
          <Device key={device} device={device} />
        ))}
      </Grid>
    </div>
  );
}
