import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { getBaseMilliseconds } from "./utils/getBaseMilliseconds";
import {
  CreateScheduleRequest,
  ScheduleService,
} from "./generated/proto/gigachad/v1/schedule";
import { ReminderServiceClientImpl } from "./generated/proto/gigachad/v1/reminder";

class ScheduleSvc implements ScheduleService {
  async createSchedule(request: CreateScheduleRequest): Promise<Empty> {
    const ctx = restate.useContext(this);
    const { schedules, addReminderRequest } = request;
    for (const schedule of schedules) {
      if (addReminderRequest) {
        const base = getBaseMilliseconds(schedule);
        const client = new ReminderServiceClientImpl(ctx);
        await ctx.delayedCall(
          () => client.addReminder({ ...addReminderRequest }),
          base,
        );
      }
    }
    return {};
  }
}

export { ScheduleSvc };
