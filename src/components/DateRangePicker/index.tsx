import { useEffect, useState } from "react";
// eslint-disable-next-line import/order
import $ from "jquery";
import "daterangepicker/daterangepicker.js";
import "daterangepicker/daterangepicker.css";
import { endOfDay, startOfDay, format, startOfMonth } from "date-fns";
import CalendarIcon from "../icons/CalendarIcon";
import moment from "moment";
import { defaultCustomDate, formatDateWithoutZone } from "@/src/helpers/misc";

type Props = {
  index: string;
  // eslint-disable-next-line no-unused-vars
  callBack: (arg: { start: string; end: string }) => void;
  selectedCustomDate?: {
    start: string;
    end: string;
  };
};

function DateRangePicker({ index, callBack, selectedCustomDate }: Props) {
  const offset = moment().utcOffset();
  const offsetUnit = offset > 12 || offset < -12 ? "m" : "h";

  const [range, setRange] = useState(selectedCustomDate ?? defaultCustomDate);

  const handleReset = () => {
    setRange(defaultCustomDate);
    callBack(defaultCustomDate);
    $(`#date-range-toggler-${index}`)
      .data("daterangepicker")
      .setStartDate(moment(defaultCustomDate.start));
    $(`#date-range-toggler-${index}`)
      .data("daterangepicker")
      .setEndDate(moment(defaultCustomDate.end));
  };

  useEffect(() => {
    startRangePicking();
  }, []);
  const startRangePicking = async () => {
    const moment = (await import("moment")).default;
    $(() => {
      // eslint-disable-next-line
      ($(`#date-range-toggler-${index}`) as any)
        .daterangepicker(
          {
            startDate: startOfMonth(new Date()),
            endDate: new Date(),
            locale: {
              cancelLabel: "Reset",
            },
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [
                moment().subtract(1, "days"),
                moment().subtract(1, "days"),
              ],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          (start: any, end: any) => {
            // eslint-disable-next-line no-underscore-dangle
            const startDate = formatDateWithoutZone(
              startOfDay(new Date(start._d)),
            );
            // eslint-disable-next-line no-underscore-dangle
            const endDate = formatDateWithoutZone(endOfDay(new Date(end._d)));
            setRange({
              start: startDate,
              end: endDate,
            });
            callBack({
              start: startDate,
              end: endDate,
            });
          },
        )
        .on("cancel.daterangepicker", handleReset);
    });
  };

  /**
   * @name useEffect
   * @description
   * @returns {MemoVoidArrayIterator}
   */
  useEffect(() => {
    startRangePicking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative z-[2] h-10 rounded bg-[#f5f5f5] whitespace-nowrap">
      <button
        type="button"
        className={`toggler date-range-toggler pull-right flex h-full items-center justify-between gap-2`}
        id={`date-range-toggler-${index}`}
      >
        <div className="mx-2">
          <CalendarIcon smallSize={true} />
        </div>
        <div className="text-sm leading-4 font_gilroy-normal">
          {`${format(
            new Date(range.start),
            "MMM. dd, yyyy",
          )} - ${format(moment(range.end).subtract(offset, offsetUnit).toDate(), "MMM. dd, yyyy")}`}
        </div>

        <div className="mr-2">
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.9399 1.7124L8.04994 6.6024C7.47244 7.1799 6.52744 7.1799 5.94994 6.6024L1.05994 1.7124"
              stroke="#737373"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}

export default DateRangePicker;
