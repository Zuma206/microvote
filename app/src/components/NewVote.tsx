import { TextInput, Card, Flex, InputLabel, Button } from "@mantine/core";
import { useState } from "react";

export function NewVote() {
  const [choices, setChoices] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  return (
    <Card withBorder flex={1} maw="40em">
      <Flex direction="column" gap="md">
        <InputLabel htmlFor="question">Question:</InputLabel>
        <TextInput
          onChange={(e) => setTitle(e.currentTarget.value)}
          placeholder="Vote Question"
          value={title}
          id="question"
          size="lg"
        />
        <InputLabel htmlFor="choice">Choices:</InputLabel>
        <Flex direction="column" gap="xs">
          {[
            ...choices.map((choice, index) => (
              <TextInput
                flex={1}
                onChange={({ currentTarget: { value } }) => {
                  if (value != "") return setChoices(choices.with(index, value));
                  setChoices([...choices.slice(0, index), ...choices.slice(index + 1)]);
                }}
                value={choice}
                key={index}
              />
            )),
            <TextInput
              onChange={(e) => setChoices([...choices, e.currentTarget.value])}
              placeholder="Add a choice..."
              key={choices.length}
              id="choice"
              value=""
            />
          ]}
        </Flex>
        <Button color="green">Start Vote</Button>
      </Flex>
    </Card>
  );
}
