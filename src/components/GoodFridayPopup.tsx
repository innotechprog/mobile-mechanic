import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Good Friday dates (Friday before Easter)
const GOOD_FRIDAY_DATES: Record<number, Date> = {
  2025: new Date(2025, 3, 18),   // April 18, 2025
  2026: new Date(2026, 3, 3),    // April 3, 2026
  2027: new Date(2027, 2, 26),   // March 26, 2027
  2028: new Date(2028, 3, 14),   // April 14, 2028
};

const getNextGoodFriday = (): Date => {
  const now = new Date();
  const year = now.getFullYear();
  for (let y = year; y <= year + 3; y++) {
    const gf = GOOD_FRIDAY_DATES[y];
    if (gf && gf > now) return gf;
  }
  return new Date(year + 1, 3, 18);
};

const formatTimeLeft = (ms: number) => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

const SESSION_KEY = "good-friday-popup-seen";

const GoodFridayPopup = () => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = getNextGoodFriday();

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft(formatTimeLeft(diff));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-primary/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-heading text-gradient">
            Good Friday Special
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <p className="text-center font-body text-muted-foreground">
            Don&apos;t miss our exclusive Good Friday deals on mobile auto repair!
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Mins" },
              { value: timeLeft.seconds, label: "Secs" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-lg bg-primary/10 py-3"
              >
                <span className="font-heading text-2xl font-bold text-primary tabular-nums">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Offer ends {targetDate.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoodFridayPopup;
