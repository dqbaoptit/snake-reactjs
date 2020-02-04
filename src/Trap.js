import React from 'react';

export default (props) => {

  const style = {
    left: `${props.trap[0]}%`,
    top: `${props.trap[1]}%`
  }

  return (
    <div className="trap" style={style}></div>
  )
}
