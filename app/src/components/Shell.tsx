import { AppShell, Center } from "@mantine/core";
import { PropsWithChildren } from "react";

export function Shell(props: PropsWithChildren) {
  return (
    <AppShell>
      <AppShell.Header p="xs" fw="bold">🗳️ Microvote</AppShell.Header>
      <AppShell.Main m="xl" p="xl">
        <Center>
          {props.children}
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
