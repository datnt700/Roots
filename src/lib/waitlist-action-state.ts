export type WaitlistActionState = {
  success: boolean
  message: string
  count: number | null
}

export const initialWaitlistState: WaitlistActionState = {
  success: false,
  message: '',
  count: null,
}
