import { Card, Center, Flex, SimpleGrid, Slider, Text } from "@mantine/core";

export function Results() {
  const options = [
    { name: "Blue", percent: 33 },
    { name: "Green", percent: 33 },
    { name: "Red", percent: 33 },
  ];
  return (
    <Card withBorder flex={1} maw="50em">
      <Flex direction="column" gap="sm" p="md">
        <Text size="xl" fw="bolder">What is your favourite color?</Text>
        <SimpleGrid spacing="sm" style={{
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
        }}>
          {options.map((option, index) => {
            const char = String.fromCharCode("A".charCodeAt(0) + index);
            return (
              <>
                <Text>{char}: {option.name}</Text>
                <Slider value={option.percent} />
                <div>{option.percent}%</div>
              </>
            );
          })}
        </SimpleGrid>
      </Flex>
    </Card>
  );
}
