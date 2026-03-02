import type { AccelSample, WorkoutState } from "./types";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();

  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";
  private peak = 0;
  private valley = 0;
  private lastRepTime = 0;

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      percentOk: 0,
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.phase = "WAIT_UP";
    this.peak = 0;
    this.valley = 0;
    this.lastRepTime = Date.now();

    this.state = {
      status: "RUNNING",
      repDisplay: 0,
      stats: {
        repsTotal: 0,
        repsOk: 0,
        repsBad: 0,
        score: 0,
        avgRepMs: 0,
        percentOk: 0,
      },
    };

    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    const y = sample.ay;
    const sideMovement = Math.abs(sample.ax) + Math.abs(sample.az);

    const UP_TH = 2.0;
    const DOWN_TH = -1.5;
    const MIN_ROM = 3.0;
    const MIN_MS = 700;
    const MAX_MS = 3500;

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);

      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
      }

    } else {

      this.valley = Math.min(this.valley, y);

      if (y < DOWN_TH) {

        const now = sample.t;
        const repMs = now - this.lastRepTime;
        this.lastRepTime = now;

        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;

        let ok = true;
        let msg = "ดีมาก";

        if (rom < MIN_ROM) {
          ok = false;
          msg = "ยกแขนต่ำเกินไป";
        } else if (repMs < MIN_MS) {
          ok = false;
          msg = "เร็วเกินไป";
        } else if (repMs > MAX_MS) {
          ok = false;
          msg = "ช้าเกินไป";
        } else if (sideMovement > 6) {
          ok = false;
          msg = "กรุณายกแนวตั้ง";
        }

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score++;

          // คำนวณค่าเฉลี่ย tempo ใหม่
          const totalOk = this.state.stats.repsOk;
          const oldAvg = this.state.stats.avgRepMs;
          this.state.stats.avgRepMs =
            Math.round((oldAvg * (totalOk - 1) + repMs) / totalOk);

        } else {
          this.state.stats.repsBad++;
        }

        // คำนวณ percent
        this.state.stats.percentOk = Math.round(
          (this.state.stats.repsOk / this.state.stats.repsTotal) * 100
        );

        this.state.stats.lastMessage = msg;

        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;

        this.emit();
      }
    }
  }
}