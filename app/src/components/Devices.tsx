import { Grid, Card, Text, Button, Flex } from "@mantine/core";
import { useMicrovote } from "../lib/context";

interface DeviceProps {
  device: number;
}

function Device(props: DeviceProps) {
  return (
    <Card withBorder p="xl">
      <Text size="lg" pb="sm" fw="bold">🕹️ {props.device}</Text>
    </Card>
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
