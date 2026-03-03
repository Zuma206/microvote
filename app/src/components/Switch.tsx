import { Center, Flex, SegmentedControl } from "@mantine/core";
import { useMicrovote } from "../lib/context";
import { MessageType } from "../lib/reducers";
import { Results } from "./Results";
import { Devices } from "./Devices";
import { NewVote } from "./NewVote";
import { Init } from "./Init";

export const pages = {
  "New Vote": <NewVote />,
  "Results": <Results />,
  "Devices": <Devices />,
};

export function Switch() {
  const { serialVote, page, dispatch } = useMicrovote();

  return (
    serialVote === undefined
      ? <Init />
      : (
        <Flex flex={1} align="stretch" direction="column" gap="lg">
          <SegmentedControl
            onChange={(page) => dispatch({
              type: MessageType.ChangePage,
              page: page as keyof typeof pages
            })}
            data={Object.keys(pages)}
            value={page}
          />
          <Center>
            {pages[page]}
          </Center>
        </Flex>
      )
  );
}
