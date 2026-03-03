import { Card, Center, Flex, SimpleGrid, Slider, Text } from "@mantine/core";
import { useMicrovote } from "../lib/context";

interface ResultProps {
  index: number;
  name: string;
}

function Result(props: ResultProps) {
  const char = String.fromCharCode("A".charCodeAt(0) + props.index);
  return (
    <>
      <Text>{char}: {props.name}</Text>
      <Slider value={0} />
      <div>{0}%</div>
    </>
  );
}

export function Results() {
  const { vote } = useMicrovote();

  return (
    vote === undefined
      ? <Text>No vote started</Text>
      : (
        <Card withBorder flex={1} maw="50em">
          <Flex direction="column" gap="sm" p="md">
            <Text size="xl" fw="bolder">{vote.title}</Text>
            <SimpleGrid spacing="sm" style={{
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center",
            }}>
              {vote.choices.map((choice, index) => (
                <Result key={index} name={choice} index={index} />
              ))}
            </SimpleGrid>
          </Flex>
        </Card>
      )
  );
}
