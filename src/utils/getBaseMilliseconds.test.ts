import { test, expect, describe } from "vitest";
import { WEEKLY_INTERVAL, getBaseMilliseconds } from "./getBaseMilliseconds";

describe("get base milliseconds", () => {
  test("should return the same day if the schedule hasn't passed the current date", () => {
    const currDate = new Date();
    currDate.setUTCMinutes(currDate.getUTCMinutes() + 10); // add 10 minutes

    const base = getBaseMilliseconds({
      day: currDate.getUTCDay(),
      hour: currDate.getUTCHours(),
      minute: currDate.getUTCMinutes(),
      second: currDate.getUTCSeconds(),
    });

    const expected = 10 * 60 * 1000;

    expect(base).toBe(expected);
  });

  test("should return the next week if the schedule has passed the current date", () => {
    const currDate = new Date();
    currDate.setUTCMinutes(currDate.getUTCMinutes() - 10); // subtract 10 minutes

    const base = getBaseMilliseconds({
      day: currDate.getUTCDay(),
      hour: currDate.getUTCHours(),
      minute: currDate.getUTCMinutes(),
      second: currDate.getUTCSeconds(),
    });

    const tenMinute = 10 * 60 * 1000;

    const expected = WEEKLY_INTERVAL - tenMinute;

    expect(base).toBe(expected);
  });

  test("should return the next week if the schedule has passed the current date", () => {
    const currDate = new Date();
    currDate.setDate(currDate.getDate() - 1); // subtract 1 day

    const base = getBaseMilliseconds({
      day: currDate.getUTCDay(),
      hour: currDate.getUTCHours(),
      minute: currDate.getUTCMinutes(),
      second: currDate.getUTCSeconds(),
    });

    const day = WEEKLY_INTERVAL / 7;

    const expected = WEEKLY_INTERVAL - day;

    expect(base).toStrictEqual(expected);
  });
});
