"use client";

import { useEffect, useState } from "react";

const pluralize = (n: number, singular: string, plural: string) =>
  n === 1 ? singular : plural;

const formatDiff = (
  from: Date,
  to: Date,
  minDiffInMinutes: number,
  maxDiffInMinutes: number,
) => {
  const diff = to.getTime() - from.getTime();
  const minutesDiff = Math.floor(diff / 1000 / 60);
  if (minutesDiff <= minDiffInMinutes) return "just now";
  if (minutesDiff >= maxDiffInMinutes) return from.toDateString();
  if (minutesDiff < 60)
    return `${minutesDiff} ${pluralize(minutesDiff, "minute", "minutes")} ago`;
  const hoursDiff = Math.floor(diff / 1000 / 60 / 60);
  if (hoursDiff < 24)
    return `${hoursDiff} ${pluralize(hoursDiff, "hour", "hours")} ago`;
  const daysDiff = Math.floor(diff / 1000 / 60 / 60 / 24);
  if (daysDiff < 30)
    return `${daysDiff} ${pluralize(daysDiff, "day", "days")} ago`;
  const monthsDiff = Math.floor(diff / 1000 / 60 / 60 / 24 / 30); // approximate
  if (monthsDiff < 12)
    return `${monthsDiff} ${pluralize(monthsDiff, "month", "months")} ago`;
  const yearsDiff = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
  return `${yearsDiff.toFixed(0)} ${pluralize(yearsDiff, "year", "years")} ago`;
};

export const TimeAgo = ({
  date,
  minDiffInMinutes,
  maxDiffInMinutes,
}: {
  date: Date;
  minDiffInMinutes: number;
  maxDiffInMinutes: number;
}) => {
  const [formatted, setFormatted] = useState(
    formatDiff(date, new Date(), minDiffInMinutes, maxDiffInMinutes),
  );
  useEffect(() => {
    // TODO: find way to spawn only a single timer instead of one per message
    const intervalId = setInterval(() =>
      setFormatted(
        formatDiff(date, new Date(), minDiffInMinutes, maxDiffInMinutes),
      ),
    );
    return () => clearInterval(intervalId);
  }, [date]);
  return formatted;
};
