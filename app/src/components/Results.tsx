import { Card, Flex, SimpleGrid, Slider, Text } from "@mantine/core";
import { useMicrovote } from "../lib/context";

interface ResultProps {
  result: number;
  index: number;
  name: string;
}

function Result(props: ResultProps) {
  const char = String.fromCharCode("A".charCodeAt(0) + props.index);
  return (
    <>
      <Text>{char}: {props.name}</Text>
      <Slider value={props.result} />
      <div>{props.result}%</div>
    </>
  );
}

export function Results() {
  const { vote } = useMicrovote();
  if (vote === undefined) return <Text>No vote started</Text>;
  const totalVotes = vote.results.reduce((prev, curr) => prev + curr, 0);

  return (
    <Card withBorder flex={1} maw="50em">
      <Flex direction="column" gap="sm" p="md">
        <Text size="xl" fw="bolder">{vote.title}</Text>
        <SimpleGrid spacing="sm" style={{
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
        }}>
          {vote.choices.map((choice, index) => (
            <Result
              result={(vote.results[index] ?? 0) / totalVotes * 100}
              index={index}
              name={choice}
              key={index}
            />
          ))}
        </SimpleGrid>
        <Text>Total Votes: {totalVotes}</Text>
      </Flex>
    </Card>
  );
}
