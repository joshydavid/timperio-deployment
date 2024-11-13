import { DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

interface DateRangePickerProps {
  selectedDateRange: { start: string; end: string };
  onChange: (dates: [Dayjs, Dayjs] | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedDateRange,
  onChange,
}) => {
  return (
    <Space direction="vertical" size={12}>
      <DatePicker.RangePicker
        value={[
          selectedDateRange.start ? dayjs(selectedDateRange.start) : null,
          selectedDateRange.end ? dayjs(selectedDateRange.end) : null,
        ]}
        onChange={onChange}
        format="YYYY-MM-DD"
      />
    </Space>
  );
};

export default DateRangePicker;
