import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsert, create } = vi.hoisted(() => ({
  upsert: vi.fn(),
  create: vi.fn(),
}));
vi.mock("@/lib/prisma/prisma", () => ({ prisma: { plants: { upsert, create } } }));

import { PlantsModel } from "./plants-model";

const base = {
  name: "Planta",
  latitude: -10,
  longitude: -50,
  typeId: "t1",
  centerId: "c1",
};

describe("PlantsModel.create", () => {
  beforeEach(() => {
    upsert.mockReset().mockResolvedValue({ id: "p1" });
    create.mockReset().mockResolvedValue({ id: "p2" });
  });

  it("upserts by offlinePreviousId so a resend does not duplicate", async () => {
    await new PlantsModel().create({ ...base, offlinePreviousId: "local_1" });
    expect(create).not.toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { offlinePreviousId: "local_1" },
        create: expect.objectContaining({ name: "Planta" }),
        update: expect.objectContaining({ name: "Planta" }),
      })
    );
  });

  it("creates normally without offlinePreviousId", async () => {
    await new PlantsModel().create(base);
    expect(upsert).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
  });
});
