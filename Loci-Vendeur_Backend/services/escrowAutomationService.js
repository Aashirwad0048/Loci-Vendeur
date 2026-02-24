import env from "../config/env.js";
import { autoReleaseEligibleEscrows } from "./escrowService.js";

let autoReleaseTimer = null;

const runAutoReleaseTick = async () => {
  const result = await autoReleaseEligibleEscrows({
    holdHours: env.escrowAutoReleaseHoldHours,
    batchSize: env.escrowAutoReleaseBatchSize,
  });

  if (result.scanned > 0 || result.failedCount > 0) {
    console.log(
      `[escrow-auto-release] scanned=${result.scanned} released=${result.released} failed=${result.failedCount}`
    );
  }
};

export const startEscrowAutoReleaseJob = () => {
  if (!env.escrowAutoReleaseEnabled) {
    console.log("[escrow-auto-release] disabled");
    return;
  }

  if (autoReleaseTimer) {
    return;
  }

  runAutoReleaseTick().catch((error) => {
    console.error("[escrow-auto-release] initial run failed", error.message);
  });

  autoReleaseTimer = setInterval(() => {
    runAutoReleaseTick().catch((error) => {
      console.error("[escrow-auto-release] tick failed", error.message);
    });
  }, env.escrowAutoReleaseIntervalMs);

  if (typeof autoReleaseTimer.unref === "function") {
    autoReleaseTimer.unref();
  }

  console.log(
    `[escrow-auto-release] enabled intervalMs=${env.escrowAutoReleaseIntervalMs} holdHours=${env.escrowAutoReleaseHoldHours} batchSize=${env.escrowAutoReleaseBatchSize}`
  );
};

