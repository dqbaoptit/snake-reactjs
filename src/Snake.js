import React from 'react';

export default (props) => {
  return (
    <div>
      {props.snakeDots.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`
        }
        return (
          <span className="snake" key={i} style={style}></span>
        )
      })}
    </div>
  )
}
