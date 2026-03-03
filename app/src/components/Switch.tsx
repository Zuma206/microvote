import { Center, Flex, SegmentedControl } from "@mantine/core";
import { useMicrovote } from "../lib/context";
import { ReactNode, useState } from "react";
import { Results } from "./Results";
import { Devices } from "./Devices";
import { NewVote } from "./NewVote";
import { Init } from "./Init";

const pages = new Map<string, ReactNode>()
  .set("New Vote", <NewVote />)
  .set("Results", <Results />)
  .set("Devices", <Devices />);

const pagesKeys = Array.from(pages.keys());

export function Switch() {
  const [page, setPage] = useState(pagesKeys[0]);
  const microvote = useMicrovote();

  return (
    microvote.microbit === undefined
      ? <Init />
      : (
        <Flex flex={1} align="stretch" direction="column" gap="lg">
          <SegmentedControl
            onChange={(page) => setPage(page)}
            data={pagesKeys}
            value={page}
          />
          <Center>
            {pages.get(page)}
          </Center>
        </Flex>
      )
  );
}
