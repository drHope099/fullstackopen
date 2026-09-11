import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useUnicafeStore = create((set) => ({
  good: 0,
  ok: 0,
  bad: 0,
  actions: {
    good: () => set((state) => ({ good: state.good + 1 })),
    ok: () => set((state) => ({ ok: state.ok + 1 })),
    bad: () => set((state) => ({ bad: state.bad + 1 })),
    zero: () => set({ good: 0, ok: 0, bad: 0 }),
  },
}))

export const useUnicafeFeedback = () =>
  useUnicafeStore(
    useShallow((state) => ({
      good: state.good,
      ok: state.ok,
      bad: state.bad,
    }))
  )

export const useUnicafeActions = () =>
  useUnicafeStore((state) => state.actions)