"use client";

import { useFormatter } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export const TimeAgo = ({
  date,
  unit,
}: {
  date: number;
  unit?: Intl.RelativeTimeFormatUnit;
}) => {
  const memoDate = useMemo(() => new Date(date), [date]);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    // TODO: find way to spawn only a single timer instead of one per message
    const intervalId = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(intervalId);
  }, [date]);
  const format = useFormatter();
  return format.relativeTime(memoDate, { now, unit });
};
