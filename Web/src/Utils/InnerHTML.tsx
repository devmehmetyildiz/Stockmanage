import React, { useEffect, useRef } from 'react'

const InnerHTML: React.FC<any> = (props) => {

  const { html, ...rest } = props
  const divRef = useRef<any>(null)

  useEffect(() => {
    if (!html) return

    const slotHtml = document.createRange().createContextualFragment(html)
    divRef.current.innerHTML = ''
    divRef.current.appendChild(slotHtml)
  }, [html])

  return (
    <div {...rest} ref={divRef} > </div>
  )
}

export default InnerHTML
