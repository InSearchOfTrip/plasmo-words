import { useWords, useCollections } from "~assets/storage/collections"

import "~assets/styles/normalize.css"
import "~assets/styles/bootstrap.min.css"

function LearnGround() {
  const { words } = useWords()
  const { collections } = useCollections()

  return (
    <div className="learnground container-fluid vh-100 d-flex flex-column">
      <div className="header p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="fs-2 m-0">LearnGround</h1>
        </div>
      </div>

      <div className="content flex-grow-1 p-4">
        <div className="row h-100">
          <div className="col-12">

          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnGround
