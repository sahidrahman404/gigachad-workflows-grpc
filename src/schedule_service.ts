import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { getBaseMilliseconds } from "./utils/getBaseMilliseconds";
import {
  CreateScheduleRequest,
  ScheduleService,
} from "./generated/proto/schedule";
import { ReminderServiceClientImpl } from "./generated/proto/reminder";

class ScheduleSvc implements ScheduleService {
  async createSchedule(request: CreateScheduleRequest): Promise<Empty> {
    const ctx = restate.useContext(this);
    const { scheduleId, schedules, remindRequest } = request;
    for (const schedule of schedules) {
      if (remindRequest) {
        const base = getBaseMilliseconds(schedule);
        const client = new ReminderServiceClientImpl(ctx);
        await ctx.delayedCall(
          () => client.remind({ ...remindRequest, scheduleId }),
          base,
        );
      }
    }
    return {};
  }
}

export { ScheduleSvc };
