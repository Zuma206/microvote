import { Flex, SegmentedControl } from "@mantine/core";
import { ReactNode, useState } from "react";
import { Results } from "./Results";
import { Devices } from "./Devices";

const pages = new Map<string, ReactNode>()
  .set("New Vote", <p>New Vote</p>)
  .set("Results", <Results />)
  .set("Devices", <Devices />);

const pagesKeys = Array.from(pages.keys());

export function Switch() {
  const [page, setPage] = useState(pagesKeys[0]);

  return (
    <Flex flex={1} align="stretch" direction="column" gap="lg">
      <SegmentedControl
        onChange={(page) => setPage(page)}
        data={pagesKeys}
        value={page}
      />
      {pages.get(page)}
    </Flex>
  );
}
