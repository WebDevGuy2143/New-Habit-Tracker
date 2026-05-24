import { format, isFuture, isSameDay, subDays } from "date-fns"
import { Button } from "./components/Button"
import { useHabits, type Habit } from "./context/HabitProvider"

type HabitItemProps = {
  habit: Habit
  visibleDates: Date[]
}

export function HabitItem({ habit, visibleDates }: HabitItemProps) {
  const { deleteHabit, toggleHabit } = useHabits()
  const streak = getStreak(habit.completions)

  return (
    <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <span className="font-medium">{habit.name}</span>
          {streak !== 0 && (
            <span className="text-sm text-amber-400">🔥 {streak}</span>
          )}
        </div>
        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost-destructive"
          className="text-sm"
        >
          Delete
        </Button>
      </div>
      <div className="flex gap-1.5">
        {visibleDates.map(date => (
          <Button
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs"
            key={date.toISOString()}
            disabled={isFuture(date)}
            onClick={() => toggleHabit(habit.id, date)}
            variant={
              habit.completions.some(d => isSameDay(date, d))
                ? "primary"
                : "secondary"
            }
          >
            <span className="font-medium">{format(date, "EEE")}</span>
            <span>{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

function getStreak(completions: Date[]) {
  if (completions.length === 0) return 0

  // Find the most recent completion date
  const mostRecent = new Date(
    Math.max(...completions.map(d => d.getTime()))
  )

  let streak = 0
  let currentDate = new Date(mostRecent)

  // Count backwards from most recent completion while consecutive days exist
  while (completions.some(c => isSameDay(c, currentDate))) {
    streak++
    currentDate = subDays(currentDate, 1)
  }

  return streak
}