declare module 'react-timeago' {
  import * as React from 'react'

  namespace ReactTimeago {
    type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    type Suffix = 'ago' | 'from now'

    type Formatter = (
      value: number,
      unit: Unit,
      suffix: Suffix,
      epochMilliseconds: number,
      nextFormatter: () => React.ReactNode,
      now: () => number,
    ) => React.ReactNode

    interface Props<T extends React.ElementType = 'time'> {
      /** If the component should update itself over time */
      live?: boolean
      /** minimum amount of time in seconds between re-renders */
      minPeriod?: number
      /** Maximum time between re-renders in seconds */
      maxPeriod?: number
      /** The container to render the string into */
      component?: T
      /** Title attribute if a time HTML Element is used */
      title?: string
      /** Function to format the date */
      formatter?: Formatter
      /** The Date to display */
      date: string | number | Date
      /** Function that returns what Date.now would return */
      now?: () => number
    }
  }

  function ReactTimeago<T extends React.ElementType = 'time'>(
    props: ReactTimeago.Props<T> &
      Omit<React.ComponentProps<T>, keyof ReactTimeago.Props<T> | 'children'>,
  ): React.ReactElement | null

  export default ReactTimeago
}
