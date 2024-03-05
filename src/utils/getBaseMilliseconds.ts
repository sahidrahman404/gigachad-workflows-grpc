type Schedule = {
  day: number;
  second: number;
  minute: number;
  hour: number;
};

const WEEKLY_INTERVAL = 7 * 24 * 60 * 60 * 1000;

function getBaseMilliseconds({ day, hour, minute, second }: Schedule): number {
  const currentDate = new Date();

  let daysAhead = day - currentDate.getDay(); // Sunday is 0
  if (daysAhead < 0) {
    daysAhead += 7;
  }

  const base = new Date(
    currentDate.getTime() + daysAhead * 24 * 60 * 60 * 1000,
  );

  base.setUTCHours(hour);
  base.setUTCMinutes(minute);
  base.setUTCSeconds(second);

  if (base.getTime() < currentDate.getTime()) {
    return base.getTime() + WEEKLY_INTERVAL - currentDate.getTime();
  }

  return base.getTime() - currentDate.getTime();
}

export { getBaseMilliseconds, WEEKLY_INTERVAL };
