import { useState } from "react"


import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="bg">
       <h2 className="fs-2">Words</h2>

      <a  className="btn btn-primary" href="options.html">Settings</a> 
    </div>
  )
}

export default IndexPopup
