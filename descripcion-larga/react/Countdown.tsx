import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { TimeSplit } from './typings/global'
import { tick, getTwoDaysFromNow } from './utils/time'

interface CountdownProps {
  targetDate: string
}

const DEFAULT_TARGET_DATE = getTwoDaysFromNow();

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {
  const CSS_HANDLES = ['contador', 'item', 'tiempo', 'texto-tiempo']
  const handles = useCssHandles(CSS_HANDLES)
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  tick(targetDate, setTime)

  return (
    <div className={`${handles.contador} db tc`}>
      <div className={`${handles.item}`}>
        <div className={`${handles.tiempo}`}>{`${timeRemaining.hours}`}</div> Horas
      </div>
      <div className={`${handles.item}`}>
        <div className={`${handles.tiempo}`}>{`${timeRemaining.minutes}`}</div> Minutos
      </div>
      <div className={`${handles.item}`}>
        <div className={`${handles.tiempo}`}>{`${timeRemaining.seconds}`}</div> Segundos
      </div>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Final date',
      description: 'Final date used in the countdown',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
