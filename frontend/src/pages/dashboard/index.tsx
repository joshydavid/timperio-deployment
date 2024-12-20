import { Card, Col, DatePicker, Flex, Row, theme, type MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  AllOrdersMap,
  CardWithContent,
  CardWithPlot,
  DailyOrders,
  DailyRevenue,
  TrendDownIcon,
  TrendingMenu,
  TrendUpIcon,
} from "../../components";

import { SalesTypePieChart } from "../../components/dashboard/salesTypePie";

import { List, NumberField } from "@refinedev/antd";
import { useApiUrl, useCustom } from "@refinedev/core";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { END_DATE, START_DATE } from "../../constant";
import type { ISalesChart } from "../../interfaces";

type DateFilter = "lastWeek" | "lastMonth";

const DATE_FILTERS: Record<
  DateFilter,
  {
    text: string;
    value: DateFilter;
  }
> = {
  lastWeek: {
    text: "lastWeek",
    value: "lastWeek",
  },
  lastMonth: {
    text: "lastMonth",
    value: "lastMonth",
  },
};

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const API_URL = useApiUrl();

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: START_DATE.toString(),
    end: END_DATE.toString(),
  });

  const handleDateChange = (dates: any) => {
    if (dates) {
      setSelectedDateRange({
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
      });
    }
  };

  const dateFilters: MenuProps["items"] = useMemo(() => {
    const filters = ["lastWeek", "lastMonth"];
    return filters.map((filter) => ({
      key: filter,
      label: t(`dashboard.filter.date.${filter}`),
      onClick: () => {
        setSelectedDateRange({
          start: dayjs().subtract(1, "month").startOf("day").format(),
          end: dayjs().endOf("day").format(),
        });
      },
    }));
  }, [t]);

  const [selecetedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value
  );

  // const dateFilters: MenuProps['items'] = useMemo(() => {
  //   const filters = Object.keys(DATE_FILTERS) as DateFilter[];

  //   return filters.map((filter) => {
  //     return {
  //       key: DATE_FILTERS[filter].value,
  //       label: t(`dashboard.filter.date.${DATE_FILTERS[filter].text}`),
  //       onClick: () => {
  //         setSelectedDateFilter(DATE_FILTERS[filter].value);
  //       },
  //     };
  //   });
  // }, []);

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selecetedDateFilter) {
      case "lastWeek":
        return {
          start: now.subtract(6, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      case "lastMonth":
        return {
          start: now.subtract(1, "month").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      default:
        return {
          start: now.subtract(7, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
    }
  }, [selecetedDateFilter]);

  const { data: dailyRevenueData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/dailyRevenue`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: dailyOrdersData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/dailyOrders`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: newCustomersData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/newCustomers`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const revenue = useMemo(() => {
    const data = dailyRevenueData?.data?.data;
    if (!data)
      return {
        data: [],
        trend: 0,
      };

    const plotData = data.map((revenue) => {
      const date = dayjs(revenue.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: revenue.value,
        state: "Daily Revenue",
      };
    });

    return {
      data: plotData,
      trend: dailyRevenueData?.data?.trend || 0,
    };
  }, [dailyRevenueData]);

  const orders = useMemo(() => {
    const data = dailyOrdersData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((order) => {
      const date = dayjs(order.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: order.value,
        state: "Daily Orders",
      };
    });

    return {
      data: plotData,
      trend: dailyOrdersData?.data?.trend || 0,
    };
  }, [dailyOrdersData]);

  const newCustomers = useMemo(() => {
    const data = newCustomersData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((customer) => {
      const date = dayjs(customer.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: customer.value,
        state: "New Customers",
      };
    });

    return {
      data: plotData,
      trend: newCustomersData?.data?.trend || 0,
    };
  }, [newCustomersData]);

  return (
    <List
      title={t("dashboard.overview.title")}
      headerButtons={() => (
        <Col>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            defaultValue={[
              dayjs(selectedDateRange.start),
              dayjs(selectedDateRange.end),
            ]}
            onChange={handleDateChange}
          />
        </Col>
      )}
    >
      <Row gutter={[16, 16]}>
        <Col xl={{ span: 19 }}>
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 12 }} lg={24} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <DollarCircleOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
                title={t("Revenue")}
              >
                <DailyRevenue
                  height={170}
                  // data={revenue.data}
                  selectedDateRange={selectedDateRange}
                />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 12 }} lg={24} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <DollarCircleOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
                title={t("Sales Type Revenue")}
              >
                <SalesTypePieChart
                  height={170}
                  selectedDateRange={selectedDateRange}
                />
              </CardWithPlot>
            </Col>

            <Col xl={{ span: 14 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  <ShoppingOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                title={t("Orders")}
              >
                <DailyOrders
                  height={170}
                  // data={orders.data}
                  selectedDateRange={selectedDateRange}
                />
              </CardWithPlot>
            </Col>
            <Col xl={10} lg={9} md={24} sm={24} xs={24}>
              <Card
                bodyStyle={{
                  padding: 0,
                }}
                title={t("Trending Products Sold")}
                extra={
                  <RiseOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              >
                <TrendingMenu
                  height={300}
                  selectedDateRange={selectedDateRange}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={5} lg={15} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              // height: "20",
              overflow: "scroll",
              padding: 0,
            }}
            icon={
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              <ClockCircleOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t("Top Spending Customers")}
          >
            <AllOrdersMap selectedDateRange={selectedDateRange} />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
