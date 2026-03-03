import { Button, Card, Flex, Text } from "@mantine/core";
import { SerialVoteDevice } from "../lib/serialvote";
import { MessageType } from "../lib/reducers";
import { useMicrovote } from "../lib/context";
import { Microbit } from "../lib/microbit";

export function Init() {
  const { dispatch } = useMicrovote();

  async function onConnectClicked() {
    const microbit = await Microbit.request();
    await microbit.open();
    const serialVote = new SerialVoteDevice(microbit);
    dispatch({ type: MessageType.SetMicrobit, serialVote });
  }

  return (
    <Card maw="30em" withBorder p="lg">
      <Flex direction="column" gap="sm">
        <Text size="lg" fw="bold">Connect the host Micro:Bit</Text>
        <Text>
          To get started, plug your host Micro:Bit, press "connect",
          and select your Micro:Bit from the list of devices.
        </Text>
        <Button onClick={onConnectClicked}>Connect</Button>
      </Flex>
    </Card>
  );
}
