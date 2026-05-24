import { isSameDay } from "date-fns"
import { createContext, useContext } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"


export type Habit = {
  id: string
  name: string
  length: number
  completions: Date[]
}

type Context = {
  habits: Habit[]
  addHabit: (name: string) => void
  deleteHabit: (id: string) => void
  toggleHabit: (id: string, date: Date) => void
}

type HabitProviderProps = {
  children: React.ReactNode
}

export const HabitContext = createContext<null | Context>(null)

export function HabitProvider({children}: HabitProviderProps) {

  const [habits, setHabits] = useLocalStorage<Habit[]>("Habits", []);

  function addHabit(name: string) {
    setHabits(curr => [...curr, {id: crypto.randomUUID(), name, length: 0, completions: []}])
  }

  function deleteHabit(id: string) {
    setHabits(curr => curr.filter(h => h.id !== id))
  }
  function toggleHabit(id: string, date: Date) {
    setHabits(curr => {
      return curr.map(h => {
        if(h.id !== id) return h
  
        const alreadyDone = h.completions.some(c => isSameDay(c, date))
        const completions = alreadyDone ? h.completions.filter(c => !isSameDay(c, date)) : [...h.completions, date]
  
        return { ...h, completions }
      })
    })
  }

  return <HabitContext value={{ habits, addHabit, deleteHabit, toggleHabit }}>{children}</HabitContext>
}

export function useHabits(){
  const habitContext = useContext(HabitContext)
  if (habitContext === null) throw new Error("useHabits must be used inside a HabitProvider")
  return habitContext
}