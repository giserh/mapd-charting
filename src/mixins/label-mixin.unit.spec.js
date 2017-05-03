import mixin from "./label-mixin"
import {expect} from "chai"


describe("label mixin", () => {
  let chart

  beforeEach(()=>{
    chart = {
      on: () => () => null,
    }
  })
  describe("measureLabelsOn", () => {
    it('should set and get _measureLabelsOn', () => {
      chart = mixin(chart)
      expect(chart.measureLabelsOn()).to.equal(false)
      chart.measureLabelsOn(true)
      expect(chart.measureLabelsOn()).to.equal(true)
    })
  })
})
