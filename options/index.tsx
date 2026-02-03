import { useSettings } from "../assets/storage/settings"

import settingsSVG from "data-base64:~assets/icons/settings.svg"

import "../assets/styles/normalize.css"
import "../assets/styles/bootstrap.min.css"
import "./style.scss"

function Settings() {
  const {
    doSaveWords,
    setSaveWords,
    doTranslation,
    setTranslation,
    doAutoAdd,
    setAutoAdd,
    defaultGroup,
    setDefaultGroup,
    translateFrom,
    setTranslateFrom,
    translateTo,
    setTranslateTo
  } = useSettings()

  return (
    <div className="settings container pb-2 pt-2">
      <div className="row mb-4">
        <div className="col-8 d-flex align-items-center justify-content-space-between">
          <img className="settings_img" src={settingsSVG} />
          <h2 className="fs-2 settings_text">Settings</h2>
        </div>
        <div className="col-4 d-flex align-items-center justify-content-end">
          <a href="popup.html" className="btn-close" />
        </div>
      </div>

      <div className="row">
        <div className="container">
          <div className="form-check form-switch">
            <label className="form-check-label pt-1" htmlFor="saveWords">
              Enable saving words
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="saveWords"
              checked={doSaveWords}
              onChange={(e) => setSaveWords(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-1">
        <div className="container">
          <div className="form-check form-switch">
            <label className="form-check-label pt-1" htmlFor="translationTgl">
              Enable translation
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="translation"
              checked={doTranslation}
              onChange={(e) => setTranslation(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-1">
        <div className="container">
          <div className="form-check form-switch">
            <label className="form-check-label pt-1" htmlFor="autoAdd">
              Auto Add on double click
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="autoAdd"
              checked={doAutoAdd}
              onChange={(e) => setAutoAdd(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-1">
        <div className="container">
          <label htmlFor="selectDefaultGroup" className="form-label">
            Default group
          </label>
          <select
            className="form-select"
            id="selectDefaultGroup"
            value={defaultGroup}
            onChange={(e) => setDefaultGroup(Number(e.target.value))}
          >
            <option value={0}>General</option>
            <option value={1}>Eng</option>
            <option value={2}>Name of the book</option>
            <option value={3}>Movie</option>
          </select>
        </div>
      </div>

      <div className="row mb-1">
        <div className="container">
          <label htmlFor="selectTranslateFrom" className="form-label">
            Translate from:
          </label>
          <select
            className="form-select"
            id="selectTranslateFrom"
            value={translateFrom}
            onChange={(e) => setTranslateFrom(Number(e.target.value))}
          >
            <option value={0}>Eng</option>
            <option value={1}>Ukr</option>
            <option value={2}>Pol</option>
            <option value={3}>Ger</option>
          </select>
        </div>
      </div>

      <div className="row mb-1">
        <div className="container">
          <label htmlFor="selectTranslateTo" className="form-label">
            Translate to:
          </label>
          <select
            className="form-select"
            id="selectTranslateTo"
            value={translateTo}
            onChange={(e) => setTranslateTo(Number(e.target.value))}
          >
            <option value={0}>Ukr</option>
            <option value={1}>Eng</option>
            <option value={2}>Pol</option>
            <option value={3}>Ger</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Settings