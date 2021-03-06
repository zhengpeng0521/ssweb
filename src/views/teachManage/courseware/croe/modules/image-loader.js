import Base from './base.js'
import consts from '../consts'
const { moduleNames, rejectMessages } = consts
const imageOption = {
  padding: 0,
  crossOrigin: 'anonymous'
}

export default class ImageLoader extends Base {
  constructor(parent) {
    super()
    this.setParent(parent)
    this.name = moduleNames.IMAGE_LOADER
  }

  /**
   * Load image from url
   * @param {?string} imageName - File name
   * @param {?(fabric.Image|string)} img - fabric.Image instance or URL of an image
   * @returns {jQuery.Deferred} deferred
   */
  load(imageName, img) {
    let promise

    if (!imageName && !img) {
      // Back to the initial state, not error.
      const canvas = this.getCanvas()

      canvas.backgroundImage = null
      canvas.renderAll()

      promise = new Promise(resolve => {
        this.setCanvasImage('', null)
        resolve()
      })
    } else {
      promise = this._setBackgroundImage(img).then(oImage => {
        this.setCanvasImage(imageName, oImage)
        this.adjustCanvasDimension()

        return oImage
      })
    }

    return promise
  }

  /**
   * Set background image
   * @param {?(fabric.Image|String)} img fabric.Image instance or URL of an image to set background to
   * @returns {$.Deferred} deferred
   * @private
   */
  _setBackgroundImage(img) {
    if (!img) {
      return Promise.reject(rejectMessages.loadImage)
    }

    return new Promise((resolve, reject) => {
      const canvas = this.getCanvas()

      canvas.setBackgroundImage(
        img,
        () => {
          const oImage = canvas.backgroundImage

          if (oImage.getElement()) {
            resolve(oImage)
          } else {
            reject()
          }
        },
        imageOption
      )
    })
  }
}
