"use client";

import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

export const TimeAgo = ({
  date,
  unit,
}: {
  date: Date;
  unit?: Intl.RelativeTimeFormatUnit;
}) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    // TODO: find way to spawn only a single timer instead of one per message
    const intervalId = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(intervalId);
  }, [date]);
  const format = useFormatter();
  return format.relativeTime(date, { now, unit });
};
