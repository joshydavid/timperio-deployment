import { useNavigation, useShow } from "@refinedev/core";
import { Flex, Grid } from "antd";
import {
  CustomerInfoList,
  CustomerInfoSummary,
  CustomerOrderHistory,
  Drawer,
} from "../../components";
import type { IUser } from "../../interfaces";

export const CustomerShow = () => {
  const { list } = useNavigation();
  const breakpoint = Grid.useBreakpoint();
  const { query: queryResult } = useShow<IUser>();

  const { data } = queryResult;
  const user = data?.data;

  return (
    <Drawer
      open
      onClose={() => list("users")}
      width={breakpoint.sm ? "736px" : "100%"}
    >
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <CustomerInfoSummary customer={user} />
        <CustomerInfoList customer={user} />
        <CustomerOrderHistory customer={user} />
      </Flex>
    </Drawer>
  );
};
