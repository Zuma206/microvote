import { Grid, Card, Text, Button, Flex } from "@mantine/core";

export function Devices() {
  const devices = [
    381742915,
    927451083,
    1402938475,
    563920174,
    2093847561,
    874561230,
    3120984756,
    1902837465,
    456789123,
    2783491056,
    1029384756,
    398475610
  ];
  return (
    <div>
      <Grid>
        {devices.map(device => (
          <Grid.Col key={device} span={3}>
            <Card withBorder p="xl">
              <Card.Section><Text size="lg" pb="sm" fw="bold">🕹️ {device}</Text></Card.Section>
              <Card.Section>
                <Flex gap="xs">
                  <Button>Identify</Button>
                  <Button color="red">Kick</Button>
                </Flex>
              </Card.Section>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
